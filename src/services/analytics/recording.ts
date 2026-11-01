
import { AppAlert } from '@/services/feedback/appAlert';
import { analyticsApi } from './api';
import { getAuthSessionVersion, getUser, isAuthenticated } from '../storage';
import type { VocabularyProgressDto } from './types';

const listeners = new Set<() => void>();
const activeRequests = new Map<number, number>();
const remainingMilliseconds = new Map<string, number>();
const errorShown = new Set<number>();
const vocabularyRequests = new Map<string, Promise<void>>();
const vocabularyErrorShown = new Set<number>();
const notify = () => listeners.forEach(listener => listener());

export const subscribeStudyEvents = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export const getPendingStudyCount = () => {
  const userId = getUser<{ id: number }>()?.id;
  return userId ? activeRequests.get(userId) ?? 0 : 0;
};

export const recordStudyInterval = (userId: number, module: string, startedAt: number, endedAt: number) => {
  if (!isAuthenticated() || getUser<{ id: number }>()?.id !== userId) return;
  const key = userId + ':' + module;
  const elapsed = Math.max(0, endedAt - startedAt) + (remainingMilliseconds.get(key) ?? 0);
  const durationInSeconds = Math.floor(elapsed / 1000);
  remainingMilliseconds.set(key, elapsed % 1000);
  if (durationInSeconds <= 0) return;
  const version = getAuthSessionVersion();
  activeRequests.set(userId, (activeRequests.get(userId) ?? 0) + 1);
  notify();
  // The existing endpoint cannot deduplicate retries after a lost acknowledgement.
  void analyticsApi.pingSession({ durationInSeconds, module }).then(() => {
    errorShown.delete(userId);
  }).catch(() => {
    if (version === getAuthSessionVersion() && !errorShown.has(userId)) {
      errorShown.add(userId);
      AppAlert.error('Chưa lưu được thời gian học', 'Không thể xác nhận phiên học đã được lưu. Vui lòng kiểm tra kết nối.');
    }
  }).finally(() => {
    activeRequests.set(userId, Math.max(0, (activeRequests.get(userId) ?? 1) - 1));
    notify();
  });
};

export const recordVocabularyProgress = (vocabularyId: number, action: VocabularyProgressDto['action']) => {
  const userId = getUser<{ id: number }>()?.id;
  if (!userId || !isAuthenticated() || !Number.isSafeInteger(vocabularyId) || vocabularyId < 1) return;
  const version = getAuthSessionVersion();
  const key = `${version}:${userId}:${vocabularyId}`;
  // Keep rapid unknown/remembered ratings of the same word in tap order.
  const previous = vocabularyRequests.get(key) ?? Promise.resolve();
  const request = previous.then(async () => {
    if (version !== getAuthSessionVersion() || userId !== getUser<{ id: number }>()?.id || !isAuthenticated()) return;
    try {
      await analyticsApi.recordVocabularyProgress({ vocabularyId, action });
      vocabularyErrorShown.delete(userId);
    } catch {
      if (version === getAuthSessionVersion() && !vocabularyErrorShown.has(userId)) {
        vocabularyErrorShown.add(userId);
        AppAlert.error('Chưa lưu được tiến độ từ vựng', 'Lựa chọn vừa rồi chưa được xác nhận lưu. Vui lòng kiểm tra kết nối và ôn lại từ đó.');
      }
    } finally {
      notify();
    }
  });
  vocabularyRequests.set(key, request);
  void request.finally(() => {
    if (vocabularyRequests.get(key) === request) vocabularyRequests.delete(key);
  });
};
