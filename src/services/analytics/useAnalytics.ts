import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from './api';
import { PingSessionDto } from './types';
import { isAuthenticated } from '../storage';
import { AUTH_QUERY_KEYS } from '../auth/useAuth';

export const ANALYTICS_QUERY_KEYS = {
  dashboard: ['analytics', 'dashboard'] as const,
};

export const useDashboardStats = () => {
  const isAuth = isAuthenticated();

  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.dashboard,
    queryFn: () => analyticsApi.getDashboard(),
    enabled: isAuth,
    staleTime: 60 * 1000,
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto?: Partial<PingSessionDto>) =>
      analyticsApi.pingSession({
        durationInSeconds: dto?.durationInSeconds ?? 60,
        module: dto?.module ?? 'daily_checkin',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.dashboard });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile });
    },
  });
};
