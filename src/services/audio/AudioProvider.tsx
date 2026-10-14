import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import { Alert, AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { API_ORIGIN } from '../config';
import { resolveMediaUrl } from '../media';
import { subscribeAuthSession } from '../storage';

type AudioState = {
  url?: string;
  playing: boolean;
  position: number;
  duration: number;
  loading: boolean;
};
type Command = {
  type: 'toggle' | 'seek' | 'stop';
  url?: string;
  seconds?: number;
};
const idle: AudioState = {
  playing: false,
  position: 0,
  duration: 0,
  loading: false,
};

// One invisible WebView hosts the existing players; no additional controls are rendered.
export const AUDIO_DOCUMENT = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1" /></head><body>
<audio id="audio" playsinline preload="metadata"></audio><script>
var audio = document.getElementById('audio');
var sourceUrl = null;
var loading = false;
function publish(error) {
  window.ReactNativeWebView.postMessage(JSON.stringify({
    url: sourceUrl, playing: !audio.paused && !audio.ended,
    position: audio.currentTime || 0, duration: isFinite(audio.duration) ? audio.duration : 0,
    loading: loading, error: error
  }));
}
['loadedmetadata','timeupdate','play','pause','ended','durationchange'].forEach(function(event) {
  audio.addEventListener(event, function() { publish(); });
});
audio.addEventListener('waiting', function() { loading = true; publish(); });
audio.addEventListener('canplay', function() { loading = false; publish(); });
audio.addEventListener('error', function() { loading = false; publish('Không thể tải audio. Vui lòng kiểm tra kết nối hoặc nội dung bài học.'); });
window.audioCommand = function(command) {
  if (command.type === 'stop') {
    audio.pause(); sourceUrl = null; audio.removeAttribute('src'); audio.load(); loading = false; publish(); return;
  }
  if (command.type === 'seek') {
    if (sourceUrl === command.url && isFinite(audio.duration)) audio.currentTime = Math.max(0, Math.min(command.seconds, audio.duration));
    publish(); return;
  }
  if (sourceUrl !== command.url) {
    audio.pause(); sourceUrl = command.url; audio.src = sourceUrl; loading = true;
  } else if (!audio.paused) { audio.pause(); publish(); return; }
  if (audio.ended) audio.currentTime = 0;
  var playback = audio.play();
  if (playback) playback.catch(function() { loading = false; publish('Không thể phát audio. Vui lòng thử lại.'); });
  publish();
};
</script></body></html>`;

const playerSource = { html: AUDIO_DOCUMENT, baseUrl: API_ORIGIN };

const AudioContext = createContext<{
  state: AudioState;
  command: (command: Command) => void;
  stopIfUrl: (url?: string) => void;
} | null>(null);

export function AudioProvider({ children }: PropsWithChildren) {
  const player = useRef<WebView<object>>(null);
  const ready = useRef(false);
  const queued = useRef<Command | null>(null);
  const [state, setState] = useState<AudioState>(idle);
  const stateRef = useRef(state);
  stateRef.current = state;
  const command = useCallback((value: Command) => {
    if (!ready.current) {
      queued.current = value;
      return;
    }
    player.current?.injectJavaScript(
      `window.audioCommand(${JSON.stringify(value)});true;`,
    );
  }, []);
  const stopIfUrl = useCallback(
    (url?: string) => {
      if (!url || stateRef.current.url === url || queued.current?.url === url) {
        command({ type: 'stop' });
        setState(idle);
      }
    },
    [command],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (status !== 'active') stopIfUrl();
    });
    const unsubscribe = subscribeAuthSession(() => stopIfUrl());
    return () => {
      subscription.remove();
      unsubscribe();
    };
  }, [stopIfUrl]);

  return (
    <AudioContext.Provider value={{ state, command, stopIfUrl }}>
      {children}
      <WebView<object>
        ref={player}
        source={playerSource}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
        containerStyle={{
          position: 'absolute',
          width: 1,
          height: 1,
          opacity: 0,
        }}
        originWhitelist={['*']}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback
        onLoadEnd={() => {
          ready.current = true;
          if (queued.current) {
            command(queued.current);
            queued.current = null;
          }
        }}
        onMessage={(event) => {
          try {
            const message = JSON.parse(event.nativeEvent.data);
            setState({
              url: message.url ?? undefined,
              playing: !!message.playing,
              position: Number(message.position) || 0,
              duration: Number(message.duration) || 0,
              loading: !!message.loading,
            });
            if (message.error)
              Alert.alert('Không thể phát audio', message.error);
          } catch {
            /* Ignore messages that are not player state. */
          }
        }}
        onError={() =>
          Alert.alert(
            'Không thể phát audio',
            'Vui lòng kiểm tra kết nối và thử lại.',
          )
        }
      />
    </AudioContext.Provider>
  );
}

export const audioTime = (seconds: number) => {
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, '0')}`;
};

export const useAudioPlayback = (value?: string | null) => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('AudioProvider is required.');
  const { state, command, stopIfUrl } = context;
  const url = resolveMediaUrl(value);
  useFocusEffect(
    useCallback(
      () => () => {
        if (url) stopIfUrl(url);
      },
      [stopIfUrl, url],
    ),
  );
  const active = !!url && state.url === url;
  const position = active ? state.position : 0;
  const duration = active ? state.duration : 0;
  return {
    playing: active && state.playing,
    loading: active && state.loading,
    position,
    duration,
    progress: duration ? Math.min(100, (position / duration) * 100) : 0,
    toggle: () => {
      if (!url) {
        Alert.alert('Chưa có audio', 'Bài học này chưa có tệp audio.');
        return;
      }
      command({ type: 'toggle', url });
    },
    seek: (offset: number) => {
      if (url) command({ type: 'seek', url, seconds: position + offset });
    },
  };
};
