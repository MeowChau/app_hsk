import { HANZI_WRITER_JS } from './hanziWriterBundle';

export const WRITING_DOCUMENT = `<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no" />
<style>
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden;
  background: #FFFFFF;
  user-select: none; -webkit-user-select: none; touch-action: none; }
#writing-grid { display: grid; width: 100%; grid-template-columns: minmax(0, 1fr); gap: 12px; }
.writing-cell { position: relative; min-width: 0; aspect-ratio: 1;
  background: #FAF9F6; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; }
.writing-cell[data-complete="true"] { border-color: #22C55E; }
.grid-bg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.character-target { position: absolute; inset: 0; touch-action: none; }
.character-target svg { width: 100% !important; height: 100% !important; touch-action: none; }
</style>
<script>${HANZI_WRITER_JS}</script>
</head><body>
<div id="writing-grid"></div>
<script>
var characterData = {};
var activeWord = null;
var characters = [];
var slots = [];
var renderVersion = 0;
var commandVersion = 0;
var wordComplete = false;
var lastError = null;

function notify(data) {
  if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(data));
}
function reportError(message) {
  if (message === lastError) return;
  lastError = message;
  notify({ type: 'error', wordId: activeWord && activeWord.id, error: message });
}
function validData(data) {
  return data && Array.isArray(data.strokes) && data.strokes.length > 0
    && Array.isArray(data.medians) && data.medians.length === data.strokes.length;
}
function loadCharacter(character, onComplete, onError) {
  if (validData(characterData[character])) { onComplete(characterData[character]); return; }
  var sources = [
    'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/',
    'https://unpkg.com/hanzi-writer-data@2.0.1/'
  ];
  function attempt(index) {
    if (index >= sources.length) {
      onError(new Error('Không thể tải dữ liệu nét cho chữ ' + character + '. Vui lòng kiểm tra kết nối.'));
      return;
    }
    var request = new XMLHttpRequest();
    var settled = false;
    function fail() { if (!settled) { settled = true; attempt(index + 1); } }
    request.open('GET', sources[index] + encodeURIComponent(character) + '.json', true);
    request.timeout = 8000;
    request.onload = function() {
      if (settled) return;
      if (request.status !== 200) { fail(); return; }
      try {
        var data = JSON.parse(request.responseText);
        if (!validData(data)) { fail(); return; }
        settled = true;
        characterData[character] = data;
        onComplete(data);
      } catch (error) { fail(); }
    };
    request.onerror = fail;
    request.ontimeout = fail;
    request.onabort = fail;
    request.send(null);
  }
  attempt(0);
}
function createSlot(index) {
  var cell = document.createElement('div');
  cell.className = 'writing-cell';
  cell.setAttribute('data-character-index', String(index));
  cell.innerHTML = '<svg class="grid-bg" viewBox="0 0 1024 1024">'
    + '<path d="M0 0L1024 1024M1024 0L0 1024" fill="none" stroke="#E5E7EB" stroke-width="2" />'
    + '<path d="M512 0V1024M0 512H1024" fill="none" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="10,10" />'
    + '<rect x="2" y="2" width="1020" height="1020" fill="none" stroke="#E5E7EB" stroke-width="4" /></svg>';
  var target = document.createElement('div');
  target.className = 'character-target';
  cell.appendChild(target);
  document.getElementById('writing-grid').appendChild(cell);
  var slot = { cell: cell, target: target, writer: null, complete: false, ready: false, quizVersion: 0 };
  slots.push(slot);
  return slot;
}
function startQuiz(slot) {
  if (!slot.ready || slot.complete) return;
  var version = renderVersion;
  var quiz = ++slot.quizVersion;
  var finished = false;
  slot.writer.quiz({
    onComplete: function() {
      if (finished || version !== renderVersion || quiz !== slot.quizVersion || slot.complete) return;
      finished = true;
      slot.complete = true;
      slot.cell.setAttribute('data-complete', 'true');
      if (!wordComplete && slots.slice(0, characters.length).every(function(item) { return item.complete; })) {
        wordComplete = true;
        notify({ type: 'quizComplete', wordId: activeWord.id, characterCount: characters.length });
      }
    }
  });
}
function renderCharacter(slot, character, version) {
  var rect = slot.target.getBoundingClientRect();
  var size = Math.max(1, Math.floor(Math.min(rect.width || 300, rect.height || 300)));
  slot.ready = false;
  slot.complete = false;
  slot.cell.setAttribute('data-complete', 'false');
  slot.target.style.opacity = '0';
  try {
    if (!slot.writer) {
      slot.writer = new HanziWriter(slot.target, {
        width: size, height: size, padding: size < 200 ? 10 : 16,
        showOutline: true, showCharacter: false,
        outlineColor: '#9CA3AF', strokeColor: '#38BDF8', drawingColor: '#1E3A8A',
        drawingWidth: 12,
        strokeAnimationSpeed: 1, delayBetweenStrokes: 150,
        showHintAfterMisses: 1, highlightOnComplete: true,
        charDataLoader: loadCharacter,
        onLoadCharDataError: function(error) {
          reportError(error && error.message ? error.message : 'Không thể tải dữ liệu nét chữ.');
        }
      });
    }
    slot.writer.setCharacter(character).then(function() {
      if (version !== renderVersion || !validData(characterData[character])) return;
      return slot.writer.updateDimensions({ width: size, height: size, padding: size < 200 ? 10 : 16 });
    }).then(function() {
      if (version !== renderVersion || !validData(characterData[character])) return;
      slot.ready = true;
      slot.target.style.opacity = '1';
      startQuiz(slot);
    }).catch(function(error) {
      if (version === renderVersion) reportError(error.message);
    });
  } catch (error) { reportError('Lỗi khởi tạo nét chữ: ' + error.message); }
}
window.setWritingWord = function(payload) {
  if (!payload || !Array.isArray(payload.characters)) return;
  if (activeWord && activeWord.id === payload.wordId && activeWord.text === payload.word) return;
  var version = ++renderVersion;
  ++commandVersion;
  slots.forEach(function(slot) {
    ++slot.quizVersion;
    if (slot.writer) slot.writer.cancelQuiz();
  });
  activeWord = { id: payload.wordId, text: payload.word };
  characters = payload.characters;
  wordComplete = false;
  lastError = null;
  Object.keys(payload.data || {}).forEach(function(character) { characterData[character] = payload.data[character]; });
  var grid = document.getElementById('writing-grid');
  var columns = characters.length > 1 ? 2 : 1;
  grid.style.gridTemplateColumns = 'repeat(' + columns + ', minmax(0, 1fr))';
  grid.style.gap = (payload.gap || 12) + 'px';
  if (characters.length === 0) { reportError('Từ này chưa có chữ Hán để luyện viết.'); return; }
  characters.forEach(function(character, index) {
    var slot = slots[index] || createSlot(index);
    slot.cell.style.display = '';
  });
  slots.slice(characters.length).forEach(function(slot) { slot.cell.style.display = 'none'; });
  characters.forEach(function(character, index) { renderCharacter(slots[index], character, version); });
};
window.animateChar = function() {
  if (!activeWord) return;
  var version = renderVersion;
  var command = ++commandVersion;
  var visible = slots.slice(0, characters.length);
  visible.forEach(function(slot) {
    ++slot.quizVersion;
    if (slot.writer) slot.writer.cancelQuiz();
  });
  var animation = Promise.resolve();
  visible.forEach(function(slot) {
    animation = animation.then(function() {
      if (version !== renderVersion || command !== commandVersion || !slot.ready) return;
      return slot.writer.animateCharacter();
    });
  });
  function resume() {
    if (version !== renderVersion || command !== commandVersion) return;
    visible.forEach(function(slot) { if (!slot.complete) startQuiz(slot); });
  }
  animation.then(resume).catch(function(error) {
    if (version !== renderVersion || command !== commandVersion) return;
    reportError(error.message);
    resume();
  });
};
window.clearCanvas = function() {
  if (!activeWord) return;
  ++commandVersion;
  wordComplete = false;
  notify({ type: 'wordReset', wordId: activeWord.id });
  slots.slice(0, characters.length).forEach(function(slot) {
    ++slot.quizVersion;
    slot.complete = false;
    slot.cell.setAttribute('data-complete', 'false');
    if (slot.writer) slot.writer.cancelQuiz();
    startQuiz(slot);
  });
};
window.onerror = function(message) { reportError('Lỗi hiển thị nét chữ: ' + message); };
notify({ type: 'ready' });
</script></body></html>`;

export const WRITING_WEBVIEW_SOURCE = {
  html: WRITING_DOCUMENT,
  baseUrl: 'https://cdn.jsdelivr.net',
};
