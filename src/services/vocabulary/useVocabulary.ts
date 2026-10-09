import { useQuery } from '@tanstack/react-query';
import { vocabularyApi } from './api';
import { VocabularyQueryParams } from './types';

export const VOCABULARY_QUERY_KEYS = {
  all: ['vocabulary'] as const,
  list: (params?: VocabularyQueryParams) =>
    ['vocabulary', 'list', params] as const,
  topicCounts: ['vocabulary', 'topic-counts'] as const,
  detail: (id: number) => ['vocabulary', 'detail', id] as const,
};

export const useVocabularies = (params?: VocabularyQueryParams) => {
  return useQuery({
    queryKey: VOCABULARY_QUERY_KEYS.list(params),
    queryFn: () => vocabularyApi.getVocabularies(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopicCounts = () => {
  return useQuery({
    queryKey: VOCABULARY_QUERY_KEYS.topicCounts,
    queryFn: () => vocabularyApi.getTopicCounts(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useVocabularyDetail = (id: number | null | undefined) => {
  return useQuery({
    queryKey: VOCABULARY_QUERY_KEYS.detail(id as number),
    queryFn: () => vocabularyApi.getById(id as number),
    enabled: Boolean(id && id > 0),
  });
};
