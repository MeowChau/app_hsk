export const MAX_VOICE_RECORDING_MS = 30000;

// This document stays in one WebView so its private Blob URLs remain playable.
export const VOICE_RECORDING_DOCUMENT = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>
<audio id="voice" playsinline></audio><script>
var player = document.getElementById('voice');
var recordings = Object.create(null);
var currentSession = null;
var playingId = null;
function notify(message) { window.ReactNativeWebView.postMessage(JSON.stringify(message)); }
function playbackState() {
  notify({ type: 'playback', questionId: playingId, playing: !player.paused && !player.ended });
}
['play', 'pause', 'ended'].forEach(function(event) { player.addEventListener(event, playbackState); });
player.addEventListener('error', function() { notify({ type: 'error', operation: 'playback', message: 'Không thể phát lại bản ghi. Vui lòng ghi âm lại.' }); });
function pausePlayback() { player.pause(); }
function stopTracks(stream) { if (stream) stream.getTracks().forEach(function(track) { track.stop(); }); }
function releaseSession(session) {
  clearInterval(session.clock);
  clearTimeout(session.limit);
  stopTracks(session.stream);
  if (currentSession === session) currentSession = null;
}
function failSession(session, error) {
  session.discarded = true;
  releaseSession(session);
  if (session.recorder && session.recorder.state !== 'inactive') {
    try { session.recorder.stop(); } catch (_) {}
  }
  var denied = error && (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError');
  notify({ type: 'error', operation: 'recording', questionId: session.questionId,
    message: denied ? 'Chưa được cấp quyền micro. Vui lòng cho phép ghi âm trong cài đặt.' : 'Không thể ghi âm. Vui lòng kiểm tra micro và thử lại.' });
}
function stopRecording() {
  var session = currentSession;
  if (!session || !session.recorder || session.recorder.state === 'inactive') return;
  session.endedAt = Date.now();
  clearInterval(session.clock);
  clearTimeout(session.limit);
  notify({ type: 'saving', questionId: session.questionId });
  try { session.recorder.stop(); } catch (error) { failSession(session, error); }
}
function cancelRecording() {
  var session = currentSession;
  pausePlayback();
  if (!session) return;
  session.discarded = true;
  releaseSession(session);
  if (session.recorder && session.recorder.state !== 'inactive') {
    try { session.recorder.stop(); } catch (_) {}
  }
  notify({ type: 'cancelled', questionId: session.questionId });
}
function startRecording(questionId) {
  cancelRecording();
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
    notify({ type: 'error', operation: 'recording', questionId: questionId, message: 'Thiết bị chưa hỗ trợ ghi âm trong ứng dụng. Vui lòng cập nhật Android System WebView hoặc hệ điều hành.' });
    return;
  }
  var session = { questionId: questionId, discarded: false, chunks: [] };
  currentSession = session;
  navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true }, video: false }).then(function(stream) {
    if (session.discarded || currentSession !== session) { stopTracks(stream); return; }
    session.stream = stream;
    try {
      var formats = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
      var mime = formats.find(function(value) { return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(value); });
      var options = { audioBitsPerSecond: 64000 };
      if (mime) options.mimeType = mime;
      session.recorder = new MediaRecorder(stream, options);
      session.recorder.ondataavailable = function(event) { if (event.data && event.data.size) session.chunks.push(event.data); };
      session.recorder.onerror = function(event) { failSession(session, event.error); };
      session.recorder.onstop = function() {
        releaseSession(session);
        if (session.discarded) return;
        var blob = new Blob(session.chunks, { type: session.recorder.mimeType || mime || '' });
        if (!blob.size) {
          notify({ type: 'error', operation: 'recording', questionId: questionId, message: 'Bản ghi chưa có âm thanh. Vui lòng ghi âm lại.' });
          return;
        }
        if (recordings[questionId]) URL.revokeObjectURL(recordings[questionId].url);
        recordings[questionId] = { url: URL.createObjectURL(blob), blob: blob };
        notify({ type: 'saved', questionId: questionId, bytes: blob.size,
          durationMs: Math.max(0, Math.min(${MAX_VOICE_RECORDING_MS}, (session.endedAt || Date.now()) - session.startedAt)) });
      };
      session.recorder.start(200);
      session.startedAt = Date.now();
      notify({ type: 'started', questionId: questionId });
      session.clock = setInterval(function() { notify({ type: 'progress', questionId: questionId, durationMs: Date.now() - session.startedAt }); }, 250);
      session.limit = setTimeout(stopRecording, ${MAX_VOICE_RECORDING_MS});
    } catch (error) { failSession(session, error); }
  }).catch(function(error) { if (!session.discarded) failSession(session, error); });
}
function playRecording(questionId) {
  if (currentSession) return;
  var recording = recordings[questionId];
  if (!recording) { notify({ type: 'error', operation: 'playback', message: 'Chưa có bản ghi cho câu này. Vui lòng ghi âm trước.' }); return; }
  if (playingId === questionId && !player.paused) { pausePlayback(); return; }
  pausePlayback();
  if (playingId !== questionId || player.src !== recording.url) { playingId = questionId; player.src = recording.url; }
  if (player.ended) player.currentTime = 0;
  var playback = player.play();
  if (playback) playback.catch(function() { notify({ type: 'error', operation: 'playback', message: 'Không thể phát lại bản ghi. Vui lòng thử lại.' }); });
}
function readBlob(blob, dataUrl) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function() { resolve(reader.result); };
    reader.onerror = function() { reject(new Error('Không đọc được bản ghi.')); };
    if (dataUrl) reader.readAsDataURL(blob); else reader.readAsArrayBuffer(blob);
  });
}
async function exportRecording(command) {
  try {
    var recording = recordings[command.questionId];
    if (!recording) throw new Error('Chưa có bản ghi cho câu này.');
    var Decoder = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!Decoder) throw new Error('Thiết bị chưa hỗ trợ chuẩn bị âm thanh để chấm.');
    // Decode and resample the saved recording locally. No additional microphone
    // access is needed, and the original Blob remains available for replay.
    var decoder = new Decoder(1, 1, 16000);
    var decoded = await decoder.decodeAudioData(await readBlob(recording.blob, false));
    var length = Math.min(decoded.length, 480000);
    if (length < 3200) throw new Error('Bản ghi quá ngắn. Hãy ghi âm ít nhất 0,2 giây.');
    var samples = new Float32Array(length);
    for (var channel = 0; channel < decoded.numberOfChannels; channel++) {
      var input = decoded.getChannelData(channel);
      for (var i = 0; i < length; i++) samples[i] += input[i] / decoded.numberOfChannels;
    }
    var wav = new ArrayBuffer(44 + length * 2);
    var view = new DataView(wav);
    function textAt(offset, text) { for (var j = 0; j < text.length; j++) view.setUint8(offset + j, text.charCodeAt(j)); }
    textAt(0, 'RIFF'); view.setUint32(4, wav.byteLength - 8, true); textAt(8, 'WAVE');
    textAt(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, 1, true); view.setUint32(24, 16000, true); view.setUint32(28, 32000, true);
    view.setUint16(32, 2, true); view.setUint16(34, 16, true); textAt(36, 'data'); view.setUint32(40, length * 2, true);
    for (var k = 0; k < length; k++) {
      var sample = Math.max(-1, Math.min(1, samples[k]));
      view.setInt16(44 + k * 2, sample < 0 ? sample * 32768 : sample * 32767, true);
    }
    notify({ type: 'exported', requestId: command.requestId, questionId: command.questionId,
      dataUri: await readBlob(new Blob([wav], { type: 'audio/wav' }), true),
      bytes: wav.byteLength, durationMs: length / 16 });
  } catch (error) {
    notify({ type: 'error', operation: 'export', requestId: command.requestId, questionId: command.questionId,
      message: error.message || 'Không thể chuẩn bị bản ghi để chấm. Hãy ghi âm lại.' });
  }
}
function destroy() {
  cancelRecording();
  player.removeAttribute('src');
  player.load();
  playingId = null;
  Object.keys(recordings).forEach(function(id) { URL.revokeObjectURL(recordings[id].url); });
  recordings = Object.create(null);
}
window.voiceCommand = function(command) {
  if (command.type === 'start') startRecording(command.questionId);
  else if (command.type === 'stop') stopRecording();
  else if (command.type === 'cancel') cancelRecording();
  else if (command.type === 'play') playRecording(command.questionId);
  else if (command.type === 'pause') pausePlayback();
  else if (command.type === 'export') exportRecording(command);
  else if (command.type === 'destroy') destroy();
};
window.addEventListener('pagehide', destroy);
document.addEventListener('visibilitychange', function() { if (document.hidden) cancelRecording(); });
</script></body></html>`;
