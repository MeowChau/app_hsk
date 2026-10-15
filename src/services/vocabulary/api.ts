import { instance } from '../instance';
import { educationApi } from '../education/api';
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

  getAllForPractice: async (
    params: Pick<VocabularyQueryParams, 'hskLevel' | 'topic'>,
  ): Promise<Vocabulary[]> => {
    const words: Vocabulary[] = [];
    let page = 1;
    let totalPages = 1;
    do {
      const response = await vocabularyApi.getVocabularies({
        ...params,
        page,
        limit: 100,
      });
      words.push(...response.data);
      totalPages = response.totalPages;
      page += 1;
    } while (page <= totalPages);
    return words;
  },

  getTopicsForWriting: async (
    hskLevel: number,
  ): Promise<Array<{ id: string; title: string; wordCount: number }>> => {
    const [metadata, words] = await Promise.all([
      educationApi.getTopics(hskLevel),
      vocabularyApi.getAllForPractice({ hskLevel }),
    ]);
    const counts = new Map<string, number>();
    words.forEach((word) => {
      if (word.topic) counts.set(word.topic, (counts.get(word.topic) ?? 0) + 1);
    });
    return metadata
      .filter(
        (topic) =>
          /^HSK\d+-L\d+$/i.test(topic.topicKey) ||
          /^\s*Bài\s*\d+/i.test(topic.titleVi),
      )
      .flatMap((topic) => {
        const wordCount = counts.get(topic.topicKey) ?? 0;
        return wordCount > 0
          ? [{ id: topic.topicKey, title: topic.titleVi, wordCount }]
          : [];
      });
  },

  getById: async (id: number): Promise<Vocabulary> => {
    return instance.get(`vocabulary/${id}`).json<Vocabulary>();
  },
};
