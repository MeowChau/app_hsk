import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getUser } from '@/services/storage';
import { recordStudyInterval } from '@/services/analytics/recording';

const IDLE_LIMIT_MS = 60000;
export const createStudyTimer = (now: () => number = Date.now) => {
  let startedAt: number | null = null;
  let lastActivity = now();
  let elapsed = 0;
  let intervals: Array<{ startedAt: number; endedAt: number }> = [];
  const pause = () => {
    if (startedAt !== null) {
      const end = Math.max(startedAt, Math.min(now(), lastActivity + IDLE_LIMIT_MS));
      elapsed += end - startedAt;
      if (end > startedAt) intervals.push({ startedAt, endedAt: end });
    }
    startedAt = null;
  };
  return {
    resume(activity = true) {
      if (activity) lastActivity = now();
      if (startedAt === null && now() < lastActivity + IDLE_LIMIT_MS) startedAt = now();
    },
    pause,
    activity() {
      if (now() >= lastActivity + IDLE_LIMIT_MS) pause();
      lastActivity = now();
      if (startedAt === null) startedAt = now();
    },
    drainIntervals() {
      const active = startedAt !== null;
      pause();
      const drained = intervals;
      intervals = [];
      if (active && now() < lastActivity + IDLE_LIMIT_MS) startedAt = now();
      return drained;
    },
    takeSeconds() {
      pause();
      const seconds = Math.floor(elapsed / 1000);
      elapsed = 0;
      return seconds;
    },
    reset() { startedAt = null; elapsed = 0; intervals = []; lastActivity = now(); },
  };
};

export const useStudyTimer = (enabled: boolean, module?: string) => {
  const focused = useIsFocused();
  const timer = useRef(createStudyTimer()).current;
  const userId = useRef(getUser<{ id: number }>()?.id).current;
  const finished = useRef(false);
  const persist = useCallback(() => {
    if (!module || !userId) return;
    for (const interval of timer.drainIntervals()) {
      recordStudyInterval(userId, module, interval.startedAt, interval.endedAt);
    }
  }, [module, userId, timer]);

  useEffect(() => {
    const sync = () => {
      if (enabled && focused && !finished.current && AppState.currentState === 'active') timer.resume();
      else { timer.pause(); persist(); }
    };
    sync();
    const subscription = AppState.addEventListener('change', sync);
    const heartbeat = setInterval(() => { if (AppState.currentState === 'active') persist(); }, 15000);
    return () => { clearInterval(heartbeat); subscription.remove(); timer.pause(); persist(); };
  }, [enabled, focused, timer, persist]);

  return {
    markActivity: useCallback(() => {
      if (enabled && focused && !finished.current && AppState.currentState === 'active') timer.activity();
    }, [enabled, focused, timer]),
    takeSeconds: useCallback(() => {
      finished.current = true;
      timer.pause();
      persist();
      return timer.takeSeconds();
    }, [persist, timer]),
    reset: useCallback(() => {
      timer.pause(); persist(); timer.reset(); finished.current = false;
      if (enabled && focused && AppState.currentState === 'active') timer.resume();
    }, [enabled, focused, persist, timer]),
  };
};
