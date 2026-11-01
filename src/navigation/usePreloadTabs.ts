import { useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from './types';
import { Paths } from './paths';

const idleScheduler = globalThis as typeof globalThis & {
  requestIdleCallback?: (callback: () => void) => number;
  cancelIdleCallback?: (id: number) => void;
};

// Warm one tab at a time after Home settles. Never navigate or change Back history.
export function usePreloadTabs(
  navigation: BottomTabNavigationProp<RootTabParamList, Paths.Home>,
) {
  const started = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (started.current) return;
      started.current = true;
      let cancelled = false;
      let idle: number | undefined;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const remaining = [
        Paths.Learn,
        Paths.Game,
        Paths.Statistics,
        Paths.Profile,
      ] as const;
      let index = 0;
      const schedule = (delay: number) => {
        timer = setTimeout(() => {
          const preload = () => {
            if (
              cancelled ||
              !navigation.isFocused() ||
              AppState.currentState !== 'active'
            )
              return;
            const name = remaining[index++];
            const state = navigation.getState();
            const route = state.routes.find((item) => item.name === name);
            if (route)
              navigation.dispatch({
                ...CommonActions.preload(route.name, route.params),
                target: state.key,
              });
            if (index < remaining.length) schedule(250);
          };
          if (idleScheduler.requestIdleCallback)
            idle = idleScheduler.requestIdleCallback(preload);
          else timer = setTimeout(preload, 0);
        }, delay);
      };
      schedule(1000);
      return () => {
        cancelled = true;
        if (timer !== undefined) clearTimeout(timer);
        if (idle !== undefined) idleScheduler.cancelIdleCallback?.(idle);
      };
    }, [navigation]),
  );
}
