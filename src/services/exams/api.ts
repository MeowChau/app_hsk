import { instance } from '../instance';
import { BackendExam, ExamQueryParams, PaginatedExams } from './types';

export const examsApi = {
  getExams: async (params?: ExamQueryParams): Promise<PaginatedExams> => {
    const searchParams: Record<string, any> = {};
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;
    if (params?.hskLevel) searchParams.hskLevel = params.hskLevel;
    if (params?.search) searchParams.search = params.search;

    return instance
      .get('exams', {
        searchParams,
      })
      .json<PaginatedExams>();
  },

  getExamById: async (id: number): Promise<BackendExam> => {
    return instance.get(`exams/${id}`).json<BackendExam>();
  },
};
