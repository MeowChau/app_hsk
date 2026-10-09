import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gameApi } from './api';
import { isAuthenticated } from '../storage';

export const GAME_QUERY_KEYS = {
  words: (hskLevel: number, limit?: number) =>
    ['game', 'offline', 'words', hskLevel, limit] as const,
  topScores: ['game', 'offline', 'top-scores'] as const,
};

export const useOfflineWords = (hskLevel: number = 1, limit: number = 30) => {
  return useQuery({
    queryKey: GAME_QUERY_KEYS.words(hskLevel, limit),
    queryFn: () => gameApi.getOfflineWords(hskLevel, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOfflineTopScores = () => {
  const isAuth = isAuthenticated();

  return useQuery({
    queryKey: GAME_QUERY_KEYS.topScores,
    queryFn: () => gameApi.getOfflineTopScores(),
    enabled: isAuth,
  });
};

export const useSubmitOfflineScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (score: number) => gameApi.submitOfflineScore(score),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEYS.topScores });
    },
  });
};
