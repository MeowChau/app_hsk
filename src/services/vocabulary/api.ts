import { instance } from '../instance';
import {
  Vocabulary,
  VocabularyQueryParams,
  PaginatedVocabulary,
  TopicCounts,
} from './types';

export const vocabularyApi = {
  getVocabularies: async (
    params?: VocabularyQueryParams,
  ): Promise<PaginatedVocabulary> => {
    const searchParams: Record<string, any> = {};
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;
    if (params?.hskLevel) searchParams.hskLevel = params.hskLevel;
    if (params?.topic) searchParams.topic = params.topic;
    if (params?.search) searchParams.search = params.search;

    return instance
      .get('vocabulary', {
        searchParams,
      })
      .json<PaginatedVocabulary>();
  },

  getTopicCounts: async (): Promise<TopicCounts> => {
    return instance.get('vocabulary/topic-counts').json<TopicCounts>();
  },

  getById: async (id: number): Promise<Vocabulary> => {
    return instance.get(`vocabulary/${id}`).json<Vocabulary>();
  },
};
