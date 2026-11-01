import { useCallback, useEffect, useRef } from 'react';
import { FlatList } from 'react-native';
import type { FlatListProps } from 'react-native';
import { ms } from '@/theme';

// Grid jumps account for the pinned player so it does not cover the target question.
export function useAudioListScroll<T>(rows: readonly T[]) {
  const listRef = useRef<FlatList<T>>(null);
  const heights = useRef(new Map<string, number>());
  const pending = useRef<{ index: number; headerId?: string } | null>(null);
  const retries = useRef(0);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rememberHeaderHeight = useCallback((id: string, height: number) => {
    heights.current.set(id, height);
  }, []);
  const jump = useCallback((animated: boolean) => {
    if (!pending.current) return;
    const { index, headerId } = pending.current;
    listRef.current?.scrollToIndex({
      index,
      animated,
      viewPosition: 0,
      viewOffset: headerId ? (heights.current.get(headerId) ?? ms(104)) : 0,
    });
  }, []);
  const scrollToQuestion = useCallback(
    (index: number, headerId?: string) => {
      if (index < 0) return;
      if (retryTimer.current) clearTimeout(retryTimer.current);
      retries.current = 0;
      pending.current = { index, headerId };
      jump(true);
    },
    [jump],
  );
  const onScrollToIndexFailed = useCallback<
    NonNullable<FlatListProps<T>['onScrollToIndexFailed']>
  >(
    (info) => {
      if (!pending.current || retries.current >= 3) return;
      retries.current++;
      listRef.current?.scrollToOffset({
        offset: Math.max(0, info.averageItemLength * info.index),
        animated: false,
      });
      if (retryTimer.current) clearTimeout(retryTimer.current);
      retryTimer.current = setTimeout(() => jump(false), 250);
    },
    [jump],
  );
  useEffect(() => {
    heights.current.clear();
    pending.current = null;
    retries.current = 0;
    return () => {
      if (retryTimer.current) clearTimeout(retryTimer.current);
    };
  }, [rows]);
  return {
    listRef,
    scrollToQuestion,
    rememberHeaderHeight,
    onScrollToIndexFailed,
  };
}
