import { Alert } from 'react-native';
import { analyticsApi } from './api';
import { getAuthSessionVersion, getUser, isAuthenticated } from '../storage';

const listeners = new Set<() => void>();
const activeRequests = new Map<number, number>();
const remainingMilliseconds = new Map<string, number>();
const errorShown = new Set<number>();
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
      Alert.alert('Chưa lưu được thời gian học', 'Không thể xác nhận phiên học đã được lưu. Vui lòng kiểm tra kết nối.');
    }
  }).finally(() => {
    activeRequests.set(userId, Math.max(0, (activeRequests.get(userId) ?? 1) - 1));
    notify();
  });
};
