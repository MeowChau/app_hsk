import { createContext, useCallback, useContext, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export type TabLeaveGuard = (proceed: () => void) => void;
export const TabLeaveGuardContext = createContext<
  (guard: TabLeaveGuard) => () => void
>(() => () => {});

export function useTabLeaveGuard(guard: TabLeaveGuard, enabled: boolean) {
  const register = useContext(TabLeaveGuardContext);
  const latestGuard = useRef(guard);
  latestGuard.current = guard;
  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;
      return register((proceed) => latestGuard.current(proceed));
    }, [enabled, register]),
  );
}
