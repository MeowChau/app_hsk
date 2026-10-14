import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export const createStudyTimer = (now: () => number = Date.now) => {
  let startedAt: number | null = null;
  let elapsed = 0;
  return {
    resume() {
      if (startedAt === null) startedAt = now();
    },
    pause() {
      if (startedAt !== null) elapsed += Math.max(0, now() - startedAt);
      startedAt = null;
    },
    takeSeconds() {
      this.pause();
      const seconds = Math.ceil(elapsed / 1000);
      elapsed = 0;
      return seconds;
    },
    reset() {
      startedAt = null;
      elapsed = 0;
    },
  };
};

export const useStudyTimer = (enabled: boolean) => {
  const focused = useIsFocused();
  const timer = useRef(createStudyTimer()).current;
  useEffect(() => {
    const sync = () => {
      if (enabled && focused && AppState.currentState === 'active')
        timer.resume();
      else timer.pause();
    };
    sync();
    const subscription = AppState.addEventListener('change', sync);
    return () => {
      subscription.remove();
      timer.pause();
    };
  }, [enabled, focused, timer]);
  return {
    takeSeconds: useCallback(() => timer.takeSeconds(), [timer]),
    reset: useCallback(() => {
      timer.reset();
      if (enabled && focused && AppState.currentState === 'active')
        timer.resume();
    }, [enabled, focused, timer]),
  };
};
