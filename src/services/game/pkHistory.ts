import { useInfiniteQuery } from '@tanstack/react-query';
import { instance } from '../instance';

export interface PkHistoryItem {
  id: string;
  matchIndex: number;
  hskLevel: number;
  opponentName: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  isWin: boolean;
  isDraw: boolean;
  xpEarned: number;
  reason: 'completed' | 'forfeit';
  completedAt: string | null;
}

export interface PkHistoryPage {
  data: PkHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const PK_HISTORY_QUERY_KEYS = {
  user: (userId: number | undefined) =>
    ['game', 'pk', 'history', userId] as const,
};

export const getPkHistory = (page: number = 1): Promise<PkHistoryPage> =>
  instance
    .get('game/pk/history', { searchParams: { page, limit: 10 } })
    .json<PkHistoryPage>();

export const usePkHistory = (userId: number | undefined, enabled: boolean) =>
  useInfiniteQuery({
    queryKey: PK_HISTORY_QUERY_KEYS.user(userId),
    queryFn: ({ pageParam }) => getPkHistory(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    enabled: enabled && Boolean(userId),
    staleTime: 0,
    retry: 1,
  });
