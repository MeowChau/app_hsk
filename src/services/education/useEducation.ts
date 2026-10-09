import { useQuery } from '@tanstack/react-query';
import { educationApi } from './api';
import { PracticeSetQueryParams, BackendQuestionSkill } from './types';

export const EDUCATION_QUERY_KEYS = {
  all: ['education'] as const,
  practiceSets: (params?: PracticeSetQueryParams) =>
    ['education', 'practice-sets', params] as const,
  practiceSetDetails: (id: number) =>
    ['education', 'practice-set', id] as const,
  topics: (hskLevel?: number) =>
    ['education', 'topics', hskLevel] as const,
  summary: (skill?: BackendQuestionSkill) =>
    ['education', 'summary', skill] as const,
};

export const usePracticeSets = (params?: PracticeSetQueryParams) => {
  return useQuery({
    queryKey: EDUCATION_QUERY_KEYS.practiceSets(params),
    queryFn: () => educationApi.getPracticeSets(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePracticeSetDetails = (id: number | null | undefined) => {
  return useQuery({
    queryKey: EDUCATION_QUERY_KEYS.practiceSetDetails(id as number),
    queryFn: () => educationApi.getPracticeSetById(id as number),
    enabled: Boolean(id && id > 0),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopics = (hskLevel?: number) => {
  return useQuery({
    queryKey: EDUCATION_QUERY_KEYS.topics(hskLevel),
    queryFn: () => educationApi.getTopics(hskLevel),
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
};

export const useEducationSummary = (skill?: BackendQuestionSkill) => {
  return useQuery({
    queryKey: EDUCATION_QUERY_KEYS.summary(skill),
    queryFn: () => educationApi.getSummary(skill),
    staleTime: 5 * 60 * 1000,
  });
};
