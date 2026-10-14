import { io } from 'socket.io-client';
import { API_ORIGIN } from '../config';
import { getToken, getAuthSessionVersion, subscribeAuthSession } from '../storage';

export interface PkPlayer { id: number; name: string; photoUrl: string | null; hskLevel: number }
export interface PkQuestion { id: number; hanzi: string; pinyin: string; prompt: string; options: { id: string; text: string }[] }
export interface PkScore { userId: number; score: number; correctCount: number; combo: number; totalQuestions: number }
export interface PkRoomState {
  roomId: string; users: [number, number]; players: PkPlayer[]; readyUserIds: number[];
  index: number; stage: 'waiting' | 'playing' | 'reveal' | 'finished'; turnUserId: number;
  deadline: number; scores: PkScore[]; serverNow: number;
}
export interface PkMatch extends PkRoomState { questions: PkQuestion[] }
export interface PkAnswer extends PkRoomState { userId: number; questionId: number; optionId: string | null; correct: boolean; correctOptionId: string }
export interface PkResult extends PkRoomState { winnerId: number | null; reason: 'completed' | 'forfeit'; durationInSeconds: number }
export interface PkMatchingState {
  phase: 'connecting' | 'searching' | 'matched' | 'playing' | 'finished' | 'error';
  hskLevel?: number; onlineCount?: number; match?: PkMatch; room?: PkRoomState;
  lastAnswer?: PkAnswer; result?: PkResult; clockOffsetMs?: number; message?: string;
}
export interface PkSession { ready: () => Promise<void>; answer: (questionId: number, optionId: string) => Promise<void>; close: () => void }

export const validatePkMatch = (payload: unknown, userId: number): PkMatch => {
  const m = payload as Partial<PkMatch> | null;
  if (!m || typeof m.roomId !== 'string' || !m.roomId.trim() ||
    !Array.isArray(m.users) || m.users.length !== 2 || !m.users.every(id => Number.isInteger(id) && id > 0) ||
    m.users[0] === m.users[1] || !m.users.includes(userId) ||
    !Array.isArray(m.players) || m.players.length !== 2 || !m.users.every(id => m.players!.some(p => p.id === id && typeof p.name === 'string')) ||
    !Array.isArray(m.questions) || m.questions.length < 2 || m.questions.length % 2 !== 0 ||
    new Set(m.questions.map(q => q.id)).size !== m.questions.length ||
    !m.questions.every(q => Number.isInteger(q.id) && Array.isArray(q.options) && q.options.length >= 2 && q.options.length <= 4 && new Set(q.options.map(o => o.id)).size === q.options.length && q.options.every(o => typeof o.id === 'string' && !!o.id && typeof o.text === 'string' && !!o.text.trim()))) {
    throw new Error('Máy chủ trả về trận đấu không hợp lệ. Vui lòng tìm lại trận.');
  }
  return m as PkMatch;
};

export const startPkMatchmaking = (userId: number, hskLevel: number, onState: (state: PkMatchingState) => void): PkSession => {
  const token = getToken();
  if (!token) {
    onState({ phase: 'error', message: 'Vui lòng đăng nhập lại để tìm trận PK.' });
    const unavailable = async () => { throw new Error('Vui lòng đăng nhập lại.'); };
    return { ready: unavailable, answer: unavailable, close: () => {} };
  }
  const version = getAuthSessionVersion();
  let active = true;
  let requested = false;
  let state: PkMatchingState = { phase: 'connecting', hskLevel };
  const socket = io(API_ORIGIN + '/game', { transports: ['websocket'], extraHeaders: { Authorization: 'Bearer ' + token }, query: { hskLevel }, autoConnect: false, forceNew: true, reconnection: false, timeout: 10000 });
  const publish = (next: Partial<PkMatchingState>) => {
    if (!active || version !== getAuthSessionVersion()) return;
    state = { ...state, ...next }; onState(state);
  };
  const fail = (message: string) => { publish({ phase: 'error', message }); socket.disconnect(); };
  const unsubscribe = subscribeAuthSession(() => {
    if (version !== getAuthSessionVersion()) {
      onState({ phase: 'error', message: 'Phiên đăng nhập đã thay đổi. Vui lòng quay lại sảnh.' });
      active = false; socket.disconnect();
    }
  });
  socket.on('pk_connected', (data: { userId: number; hskLevel: number; count: number; serverNow: number }) => {
    if (!active || version !== getAuthSessionVersion()) { socket.disconnect(); return; }
    if (data.userId !== userId) { fail('Kết nối không thuộc tài khoản hiện tại.'); return; }
    publish({ phase: 'searching', hskLevel: data.hskLevel, onlineCount: data.count, clockOffsetMs: data.serverNow - Date.now() });
    if (!requested) { requested = true; socket.emit('find_match'); }
  });
  socket.on('online_count_update', (data: { hskLevel?: number; count?: number }) => {
    if (Number(data?.hskLevel) === (state.hskLevel ?? hskLevel) && typeof data.count === 'number' && data.count >= 0) publish({ onlineCount: data.count });
  });
  socket.on('match_found', (payload: unknown) => {
    if (state.phase === 'error') return;
    try { const match = validatePkMatch(payload, userId); publish({ phase: 'matched', match, room: match, clockOffsetMs: match.serverNow - Date.now() }); }
    catch (error) { fail(error instanceof Error ? error.message : 'Không thể nhận trận đấu.'); }
  });
  const updateRoom = (room: PkRoomState) => {
    if (room.roomId !== state.match?.roomId || state.phase === 'error') return;
    publish({ room, clockOffsetMs: room.serverNow - Date.now() });
  };
  socket.on('player_ready_update', updateRoom);
  socket.on('game_started', (room: PkMatch) => {
    if (room.roomId !== state.match?.roomId || state.phase === 'error') return;
    publish({ phase: 'playing', room, match: { ...state.match, ...room }, clockOffsetMs: room.serverNow - Date.now() });
  });
  socket.on('turn_changed', updateRoom);
  socket.on('answer_result', (answer: PkAnswer) => {
    if (answer.roomId !== state.match?.roomId || state.phase === 'error') return;
    publish({ room: answer, lastAnswer: answer, clockOffsetMs: answer.serverNow - Date.now() });
  });
  socket.on('game_finished', (result: PkResult) => {
    if (result.roomId !== state.match?.roomId || state.phase === 'error') return;
    publish({ phase: 'finished', room: result, result, clockOffsetMs: result.serverNow - Date.now() });
  });
  socket.on('match_cancelled', (data: { roomId?: string; message?: string }) => {
    if (!data.roomId || data.roomId === state.match?.roomId) fail(data.message || 'Đối thủ đã rời trận. Vui lòng tìm lại.');
  });
  socket.on('exception', (data: { message?: string }) => fail(typeof data?.message === 'string' ? data.message : 'Máy chủ đang gặp lỗi PK. Vui lòng thử lại sau.'));
  socket.on('connect_error', () => fail('Không thể kết nối máy chủ PK. Vui lòng kiểm tra kết nối và thử lại.'));
  socket.on('disconnect', reason => {
    if (reason !== 'io client disconnect' && state.phase !== 'error' && state.phase !== 'finished') publish({ phase: 'error', message: 'Kết nối PK đã bị ngắt. Vui lòng quay lại sảnh.' });
  });
  const send = (event: string, data: object) => new Promise<void>((resolve, reject) => {
    if (!active || !socket.connected || version !== getAuthSessionVersion()) { reject(new Error('Kết nối PK không còn hoạt động.')); return; }
    socket.timeout(10000).emit(event, data, (error: Error | null, reply: { ok?: boolean; message?: string }) => {
      if (error) reject(new Error('Chưa nhận được xác nhận từ máy chủ. Vui lòng kiểm tra kết nối.'));
      else if (!reply?.ok) reject(new Error(reply?.message || 'Máy chủ chưa chấp nhận thao tác này.'));
      else resolve();
    });
  });
  publish(state); socket.connect();
  return {
    ready: () => send('player_ready', { roomId: state.match?.roomId }),
    answer: (questionId, optionId) => send('submit_answer', { roomId: state.match?.roomId, questionId, optionId }),
    close: () => { active = false; unsubscribe(); socket.removeAllListeners(); socket.disconnect(); },
  };
};
