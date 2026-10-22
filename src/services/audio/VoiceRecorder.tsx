// @refresh reset
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import { VOICE_RECORDING_DOCUMENT } from './voiceRecordingDocument';

export interface VoiceRecorderEvent {
  type: 'started' | 'progress' | 'saving' | 'saved' | 'cancelled' | 'playback' | 'exported' | 'error';
  questionId?: string;
  durationMs?: number;
  bytes?: number;
  playing?: boolean;
  operation?: 'recording' | 'playback' | 'export';
  message?: string;
  requestId?: number;
  dataUri?: string;
}

export interface VoiceRecordingAudio {
  uri: string;
  type: 'audio/wav';
  name: string;
}

export interface VoiceRecorderHandle {
  start: (questionId: string) => void;
  stop: () => void;
  cancel: () => void;
  togglePlayback: (questionId: string) => void;
  pausePlayback: () => void;
  exportAudio: (questionId: string) => Promise<VoiceRecordingAudio>;
}

type Command = { type: 'start' | 'stop' | 'cancel' | 'play' | 'pause' | 'destroy' | 'export'; questionId?: string; requestId?: number };

// A secure origin for static, local HTML enables microphone capture even with a LAN API.
// No request is made to this reserved .invalid domain. A WAV export is sent to
// the app only when it requests pronunciation assessment; replay uses the Blob.
const source = { html: VOICE_RECORDING_DOCUMENT, baseUrl: 'https://recording.trice.invalid/' };

export const VoiceRecorder = forwardRef<VoiceRecorderHandle, { onEvent: (event: VoiceRecorderEvent) => void }>(function VoiceRecorder({ onEvent }, ref) {
  const player = useRef<WebView<object>>(null);
  const ready = useRef(false);
  const queue = useRef<Command[]>([]);
  const eventHandler = useRef(onEvent);
  const nextRequest = useRef(0);
  const exports = useRef(new Map<number, { resolve: (audio: VoiceRecordingAudio) => void; reject: (error: Error) => void; timeout: ReturnType<typeof setTimeout> }>());
  eventHandler.current = onEvent;
  const send = useCallback((command: Command) => {
    if (!ready.current) {
      if (command.type === 'cancel' || command.type === 'destroy') {
        const pendingStart = queue.current.find(item => item.type === 'start');
        queue.current = [];
        if (pendingStart) eventHandler.current({ type: 'cancelled', questionId: pendingStart.questionId });
      } else queue.current.push(command);
      return;
    }
    player.current?.injectJavaScript(`window.voiceCommand(${JSON.stringify(command)});true;`);
  }, []);

  useImperativeHandle(ref, () => ({
    start: questionId => send({ type: 'start', questionId }),
    stop: () => send({ type: 'stop' }),
    cancel: () => send({ type: 'cancel' }),
    togglePlayback: questionId => send({ type: 'play', questionId }),
    pausePlayback: () => send({ type: 'pause' }),
    exportAudio: questionId => new Promise<VoiceRecordingAudio>((resolve, reject) => {
      const requestId = ++nextRequest.current;
      const timeout = setTimeout(() => {
        exports.current.delete(requestId);
        reject(new Error('Chuẩn bị bản ghi quá lâu. Vui lòng thử chấm lại.'));
      }, 15000);
      exports.current.set(requestId, { resolve, reject, timeout });
      send({ type: 'export', questionId, requestId });
    }),
  }), [send]);

  useFocusEffect(useCallback(() => () => send({ type: 'cancel' }), [send]));
  useEffect(() => {
    const listener = AppState.addEventListener('change', status => {
      if (status !== 'active') send({ type: 'cancel' });
    });
    const pendingExports = exports.current;
    return () => {
      listener.remove(); send({ type: 'destroy' });
      pendingExports.forEach(pending => { clearTimeout(pending.timeout); pending.reject(new Error('Đã đóng bộ ghi âm.')); });
      pendingExports.clear();
    };
  }, [send]);

  return (
    <WebView<object>
      ref={player}
      source={source}
      originWhitelist={['https://recording.trice.invalid']}
      mediaPlaybackRequiresUserAction={false}
      allowsInlineMediaPlayback
      mediaCapturePermissionGrantType="grantIfSameHostElseDeny"
      style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      containerStyle={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      onLoadStart={() => { ready.current = false; }}
      onLoadEnd={() => {
        ready.current = true;
        const pending = queue.current;
        queue.current = [];
        pending.forEach(send);
      }}
      onMessage={event => {
        try {
          const message: VoiceRecorderEvent = JSON.parse(event.nativeEvent.data);
          if (message.requestId !== undefined) {
            const pending = exports.current.get(message.requestId);
            if (!pending) return;
            clearTimeout(pending.timeout);
            exports.current.delete(message.requestId);
            if (message.type === 'exported' && message.dataUri?.startsWith('data:audio/wav;base64,') && Number(message.bytes) > 44) {
              pending.resolve({ uri: message.dataUri, type: 'audio/wav', name: 'pronunciation.wav' });
            } else pending.reject(new Error(message.message || 'Không thể chuẩn bị bản ghi để chấm.'));
            return;
          }
          if (typeof message.type === 'string') eventHandler.current(message);
        } catch { /* Ignore messages outside the recorder protocol. */ }
      }}
      onError={() => onEvent({ type: 'error', operation: 'recording', message: 'Không thể mở bộ ghi âm. Vui lòng mở lại bài luyện.' })}
    />
  );
});
