import { instance } from '../instance';
import { BackendExam, ExamQueryParams, PaginatedExams } from './types';
import type { BackendQuestion, PaginatedResponse } from '../education/types';

export class ExamResponseMismatchError extends Error {
  constructor() {
    super('Máy chủ trả về đề thi khác với đề đã chọn. Vui lòng thử lại sau.');
    this.name = 'ExamResponseMismatchError';
  }
}

const hydrateExamQuestions = async (exam: BackendExam): Promise<BackendExam> => {
  const links = (exam.sections ?? []).flatMap((section) => section.sectionQuestions ?? []);
  const missing = new Set(links.filter((link) => !link.question || link.question.id !== link.questionId).map((link) => link.questionId));
  if (!missing.size) return exam;

  const questions = new Map<number, BackendQuestion>();
  let page = 1;
  let totalPages = 1;
  do {
    const response = await instance.get('questions', {
      searchParams: { hskLevel: exam.hskLevel, page, limit: 100 },
    }).json<PaginatedResponse<BackendQuestion>>();
    for (const question of response.data) {
      if (missing.has(question.id)) {
        questions.set(question.id, question);
        missing.delete(question.id);
      }
    }
    totalPages = response.totalPages;
    page += 1;
  } while (missing.size && page <= totalPages);

  if (missing.size) {
    throw new Error('Đề thi đang thiếu nội dung câu hỏi trên máy chủ. Vui lòng thử lại sau.');
  }

  return {
    ...exam,
    sections: exam.sections?.map((section) => ({
      ...section,
      sectionQuestions: section.sectionQuestions?.map((link) => ({
        ...link,
        question: questions.get(link.questionId) ?? link.question,
      })),
    })),
  };
};

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

  getExamById: async (id: number, listedExam?: BackendExam): Promise<BackendExam> => {
    const exam = await instance.get(`exams/${id}`).json<BackendExam>();
    if (Number(exam.id) === id) return hydrateExamQuestions(exam);

    // The backend currently caches all exam IDs under one key. Recover from
    // the uncached list and join its exact question IDs to the real question API.
    if (listedExam?.id === id) return hydrateExamQuestions(listedExam);

    let page = 1;
    let totalPages = 1;
    do {
      const response = await examsApi.getExams({ page, limit: 100 });
      const matching = response.data.find((item) => item.id === id);
      if (matching) return hydrateExamQuestions(matching);
      totalPages = response.totalPages;
      page += 1;
    } while (page <= totalPages);
    throw new ExamResponseMismatchError();
  },
};
