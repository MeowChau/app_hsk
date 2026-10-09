export type BackendQuestionSkill = 'LISTENING' | 'READING' | 'WRITING' | 'SPEAKING';

export type BackendQuestionType =
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'MATCHING'
  | 'FILL_IN_BLANK'
  | 'SHORT_ANSWER'
  | 'ESSAY';

export interface BackendQuestion {
  id: number;
  type: BackendQuestionType;
  skill: BackendQuestionSkill;
  difficulty: number;
  hskLevel: number;
  payload: Record<string, any>;
  correctAnswer: Record<string, any> | null;
  isGameQuestion: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendPracticeSetQuestion {
  practiceSetId: number;
  questionId: number;
  order: number;
  question: BackendQuestion;
}

export interface BackendPracticeSet {
  id: number;
  title: string;
  topic: string;
  skill: BackendQuestionSkill;
  hskLevel: number;
  audioUrl?: string | null;
  practiceSetQuestions?: BackendPracticeSetQuestion[];
  totalQuestions?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendTopicSummary {
  id: string;
  topicKey: string;
  titleVi: string;
  titleCn: string;
  pinyin: string;
  icon: string;
  hskLevel: number;
  vocabularyCount: number;
  totalSets: number;
  totalQuestions: number;
  listeningCount: number;
  speakingCount: number;
  readingCount: number;
  writingCount: number;
}

export interface PracticeSetQueryParams {
  page?: number;
  limit?: number;
  skill?: BackendQuestionSkill;
  hskLevel?: number;
  topic?: string;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
