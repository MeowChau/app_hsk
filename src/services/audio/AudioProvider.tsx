import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import { AppState } from 'react-native';
import { AppAlert } from '@/services/feedback/appAlert';
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { API_ORIGIN } from '../config';
import { resolveMediaUrl } from '../media';
import { subscribeAuthSession } from '../storage';

type AudioState = {
  ownerId?: string;
  url?: string;
  playing: boolean;
  position: number;
  duration: number;
  loading: boolean;
};
type Command = {
  type: 'toggle' | 'seek' | 'stop';
  ownerId?: string;
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
var ownerId = null;
var loading = false;
function publish(error) {
  window.ReactNativeWebView.postMessage(JSON.stringify({
    url: sourceUrl, ownerId: ownerId, playing: !audio.paused && !audio.ended,
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
    audio.pause(); sourceUrl = null; ownerId = null; audio.removeAttribute('src'); audio.load(); loading = false; publish(); return;
  }
  if (command.type === 'seek') {
    if (ownerId === command.ownerId && sourceUrl === command.url && isFinite(audio.duration)) audio.currentTime = Math.max(0, Math.min(command.seconds, audio.duration));
    publish(); return;
  }
  if (sourceUrl !== command.url || ownerId !== command.ownerId) {
    audio.pause(); ownerId = command.ownerId;
    if (sourceUrl !== command.url) {
      sourceUrl = command.url; audio.src = sourceUrl; loading = true;
    } else { audio.currentTime = 0; }
  } else if (!audio.paused) { audio.pause(); publish(); return; }
  if (audio.ended) audio.currentTime = 0;
  var requestOwner = ownerId;
  var requestUrl = sourceUrl;
  var playback = audio.play();
  if (playback) playback.catch(function(error) {
    if (ownerId !== requestOwner || sourceUrl !== requestUrl || error.name === 'AbortError') return;
    loading = false; publish('Không thể phát audio. Vui lòng thử lại.');
  });
  publish();
};
</script></body></html>`;

const playerSource = { html: AUDIO_DOCUMENT, baseUrl: API_ORIGIN };

const AudioContext = createContext<{
  state: AudioState;
  command: (command: Command) => void;
  stopIfOwner: (ownerId?: string) => void;
} | null>(null);

export function AudioProvider({ children }: PropsWithChildren) {
  const player = useRef<WebView<object>>(null);
  const ready = useRef(false);
  const queued = useRef<Command | null>(null);
  const activeOwner = useRef<string | undefined>(undefined);
  const [state, setState] = useState<AudioState>(idle);
  const command = useCallback((value: Command) => {
    if (value.type === 'toggle') activeOwner.current = value.ownerId;
    else if (value.type === 'stop') activeOwner.current = undefined;
    if (!ready.current) {
      queued.current = value;
      return;
    }
    player.current?.injectJavaScript(
      `window.audioCommand(${JSON.stringify(value)});true;`,
    );
  }, []);
  const stopIfOwner = useCallback(
    (ownerId?: string) => {
      if (!ownerId || activeOwner.current === ownerId) {
        command({ type: 'stop' });
        setState(idle);
      }
    },
    [command],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) => {
      if (status !== 'active') stopIfOwner();
    });
    const unsubscribe = subscribeAuthSession(() => stopIfOwner());
    return () => {
      subscription.remove();
      unsubscribe();
    };
  }, [stopIfOwner]);

  return (
    <AudioContext.Provider value={{ state, command, stopIfOwner }}>
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
            if ((message.ownerId ?? undefined) !== activeOwner.current) return;
            setState({
              ownerId: message.ownerId ?? undefined,
              url: message.url ?? undefined,
              playing: !!message.playing,
              position: Number(message.position) || 0,
              duration: Number(message.duration) || 0,
              loading: !!message.loading,
            });
            if (message.error)
              AppAlert.error('Không thể phát audio', message.error);
          } catch {
            /* Ignore messages that are not player state. */
          }
        }}
        onError={() =>
          AppAlert.error(
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
  const { state, command, stopIfOwner } = context;
  const ownerId = useId();
  const url = resolveMediaUrl(value);
  useFocusEffect(
    useCallback(
      () => () => {
        if (url) stopIfOwner(ownerId);
      },
      [stopIfOwner, ownerId, url],
    ),
  );
  const active = !!url && state.ownerId === ownerId && state.url === url;
  const position = active ? state.position : 0;
  const duration = active ? state.duration : 0;
  return {
    playing: active && state.playing,
    loading: active && state.loading,
    position,
    duration,
    progress: duration ? Math.min(100, (position / duration) * 100) : 0,
    stop: () => {
      if (url) stopIfOwner(ownerId);
    },
    toggle: () => {
      if (!url) {
        AppAlert.warning('Chưa có audio', 'Bài học này chưa có tệp audio.');
        return;
      }
      command({ type: 'toggle', ownerId, url });
    },
    seek: (offset: number) => {
      if (active)
        command({ type: 'seek', ownerId, url, seconds: position + offset });
    },
  };
};
