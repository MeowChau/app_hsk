import { useCallback, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export function useScreenBackHandler(handler: () => boolean, enabled = true) {
  const latestHandler = useRef(handler);
  latestHandler.current = handler;
  useFocusEffect(
    useCallback(() => {
      if (!enabled || Platform.OS !== 'android') return;
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => latestHandler.current(),
      );
      return () => subscription.remove();
    }, [enabled]),
  );
}
