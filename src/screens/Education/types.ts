export type SkillType = 'NGHE' | 'NÓI' | 'ĐỌC' | 'VIẾT';

export type EducationViewMode = 'main' | 'examList' | 'examTest' | 'examResult' | 'examReview';

export type QuestionType = 'LISTENING' | 'READING';

export interface QuestionOption {
  id: string;
  label: string;
  text?: string;
  imageUrl?: any;
}

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  index: number;
  audioUrl?: any;
  imageUrl?: any;
  text?: string;
  options: QuestionOption[];
  correctOptionId: string;
}

export interface HskExam {
  id: string;
  level: number;
  name: string;
  timeLimit: number;
  listeningCount: number;
  readingCount: number;
  questions?: ExamQuestion[];
  bestScore?: number;
  lastAttemptDate?: string;
}

export interface ExamResult {
  examId: string;
  score: number;
  correctCount: number;
  totalCount: number;
  listeningCorrect: number;
  readingCorrect: number;
  date: string;
  answers: Record<string, string>;
}
