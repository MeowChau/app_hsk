import { useQuery } from '@tanstack/react-query';
import { leaderboardApi } from './api';
import { StreakLeaderboardParams } from './types';
import { isAuthenticated } from '../storage';

export const LEADERBOARD_QUERY_KEYS = {
  streak: (params?: StreakLeaderboardParams) =>
    ['leaderboard', 'streak', params] as const,
};

export const useStreakLeaderboard = (params?: StreakLeaderboardParams) => {
  const isAuth = isAuthenticated();

  return useQuery({
    queryKey: LEADERBOARD_QUERY_KEYS.streak(params),
    queryFn: () => leaderboardApi.getStreakLeaderboard(params),
    enabled: isAuth,
    staleTime: 2 * 60 * 1000,
  });
};
