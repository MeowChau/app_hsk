import { PaginatedResponse } from '../education/types';

export interface Vocabulary {
  id: number;
  hanzi: string;
  pinyin: string;
  meaning: string;
  hskLevel: number;
  topic?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface VocabularyQueryParams {
  page?: number;
  limit?: number;
  hskLevel?: number;
  topic?: string;
  search?: string;
}

export type PaginatedVocabulary = PaginatedResponse<Vocabulary>;
export type TopicCounts = Record<string, number>;
