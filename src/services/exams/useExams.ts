import { useQuery } from '@tanstack/react-query';
import { examsApi } from './api';
import { ExamQueryParams } from './types';
import { transformBackendExamToApp } from './transformers';

export const EXAMS_QUERY_KEYS = {
  all: ['exams'] as const,
  list: (params?: ExamQueryParams) => ['exams', 'list', params] as const,
  detail: (id: number) => ['exams', 'detail', id] as const,
};

export const useExams = (params?: ExamQueryParams) => {
  return useQuery({
    queryKey: EXAMS_QUERY_KEYS.list(params),
    queryFn: () => examsApi.getExams(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useExamDetails = (id: number | string | null | undefined) => {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

  return useQuery({
    queryKey: EXAMS_QUERY_KEYS.detail(numericId as number),
    queryFn: async () => {
      const backendExam = await examsApi.getExamById(numericId as number);
      return {
        raw: backendExam,
        appExam: transformBackendExamToApp(backendExam),
      };
    },
    enabled: Boolean(numericId && numericId > 0),
    staleTime: 5 * 60 * 1000,
  });
};
