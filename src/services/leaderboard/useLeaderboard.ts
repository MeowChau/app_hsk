import { useQuery } from '@tanstack/react-query';
import { leaderboardApi } from './api';
import { StreakLeaderboardParams } from './types';
import { isAuthenticated } from '../storage';
import { buildExperienceLeaderboard } from './experience';

export const LEADERBOARD_QUERY_KEYS = {
  streak: (params?: StreakLeaderboardParams) =>
    ['leaderboard', 'streak', params] as const,
  experience: ['leaderboard', 'experience'] as const,
};

export const useExperienceLeaderboard = () => useQuery({
  queryKey: LEADERBOARD_QUERY_KEYS.experience,
  queryFn: async () => buildExperienceLeaderboard(
    await leaderboardApi.getStreakLeaderboard({ metric: 'exp', timeframe: 'all', limit: 100 }),
  ),
  enabled: isAuthenticated(),
  staleTime: 2 * 60 * 1000,
});

export const useStreakLeaderboard = (params?: StreakLeaderboardParams) => {
  const isAuth = isAuthenticated();

  return useQuery({
    queryKey: LEADERBOARD_QUERY_KEYS.streak(params),
    queryFn: () => leaderboardApi.getStreakLeaderboard(params),
    enabled: isAuth,
    staleTime: 2 * 60 * 1000,
  });
};
