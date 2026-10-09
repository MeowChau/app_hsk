import { instance } from '../instance';
import {
  BackendPracticeSet,
  BackendTopicSummary,
  PaginatedResponse,
  PracticeSetQueryParams,
  BackendQuestionSkill,
} from './types';

export const educationApi = {
  getPracticeSets: async (
    params?: PracticeSetQueryParams,
  ): Promise<PaginatedResponse<BackendPracticeSet>> => {
    const searchParams: Record<string, any> = {};
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;
    if (params?.skill) searchParams.skill = params.skill;
    if (params?.hskLevel) searchParams.hskLevel = params.hskLevel;
    if (params?.topic) searchParams.topic = params.topic;
    if (params?.search) searchParams.search = params.search;

    return instance
      .get('practice-sets', {
        searchParams,
      })
      .json<PaginatedResponse<BackendPracticeSet>>();
  },

  getPracticeSetById: async (id: number): Promise<BackendPracticeSet> => {
    return instance.get(`practice-sets/${id}`).json<BackendPracticeSet>();
  },

  getTopics: async (hskLevel?: number): Promise<BackendTopicSummary[]> => {
    const searchParams = hskLevel ? { hskLevel } : undefined;
    return instance
      .get('practice-sets/topics', {
        searchParams,
      })
      .json<BackendTopicSummary[]>();
  },

  getSummary: async (
    skill?: BackendQuestionSkill,
  ): Promise<{
    totalSets: number;
    totalQuestions: number;
    bySkill?: Record<string, number>;
  }> => {
    const searchParams = skill ? { skill } : undefined;
    return instance
      .get('practice-sets/summary', {
        searchParams,
      })
      .json<{
        totalSets: number;
        totalQuestions: number;
        bySkill?: Record<string, number>;
      }>();
  },
};
