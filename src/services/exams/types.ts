import { BackendQuestion, PaginatedResponse } from '../education/types';

export interface BackendExamSectionQuestion {
  sectionId: number;
  questionId: number;
  order: number;
  question: BackendQuestion;
}

export interface BackendExamSection {
  id: number;
  examId: number;
  title: string;
  order: number;
  audioUrl?: string | null;
  sectionQuestions?: BackendExamSectionQuestion[];
}

export interface BackendExam {
  id: number;
  title: string;
  description?: string | null;
  hskLevel: number;
  sections?: BackendExamSection[];
  totalQuestions?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamQueryParams {
  page?: number;
  limit?: number;
  hskLevel?: number;
  search?: string;
}

export type PaginatedExams = PaginatedResponse<BackendExam>;
