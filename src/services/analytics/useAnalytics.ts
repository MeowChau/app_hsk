import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { analyticsApi } from './api';
import {
  getAuthSessionVersion,
  getUser,
  isAuthenticated,
  saveLastCheckInDate,
} from '../storage';
import { AUTH_QUERY_KEYS } from '../auth/useAuth';
import { useEffect } from 'react';
import type { QueryClient } from '@tanstack/react-query';
import { subscribeStudyEvents } from './recording';
import type { DashboardStatsResponse } from './types';
import { applyExperienceSnapshot } from '../auth/experience';

export const useSyncStudyEvents = (queryClient: QueryClient) => {
  useEffect(() => subscribeStudyEvents(() => {
    void queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.dashboard });
    void queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
  }), [queryClient]);
};

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
    mutationFn: async () => {
      const userId = getUser<{ id: number }>()?.id;
      if (!userId || !isAuthenticated()) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      const version = getAuthSessionVersion();
      const response = await analyticsApi.checkIn();
      if (version !== getAuthSessionVersion() || userId !== getUser<{ id: number }>()?.id) {
        throw new Error('Phiên đăng nhập đã thay đổi. Vui lòng thử lại.');
      }
      saveLastCheckInDate(userId, response.studyDate);
      applyExperienceSnapshot(queryClient, userId, response);
      return response;
    },
    onSuccess: async (response) => {
      queryClient.setQueryData<DashboardStatsResponse>(ANALYTICS_QUERY_KEYS.dashboard, previous => previous?.studyDate === response.studyDate ? {
        ...previous,
        checkedInToday: true,
      } : previous);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ANALYTICS_QUERY_KEYS.dashboard }),
        queryClient.invalidateQueries({ queryKey: ['leaderboard'] }),
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile }),
      ]);
    },
  });
};
