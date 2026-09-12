export type SkillType = 'NGHE' | 'NÓI' | 'ĐỌC' | 'VIẾT';

export type EducationViewMode = 'main' | 'examList' | 'examTest' | 'examResult' | 'examReview' | 'skillSetup' | 'skillPractice';

export type QuestionType = 'LISTENING' | 'READING';

// =========================================================
// Listening Practice - 4 loại câu hỏi
// =========================================================
export type ListeningQuestionType = 'IMAGE_SELECT' | 'VOCAB_SELECT' | 'TRUE_FALSE' | 'GROUP_SELECT';

export interface ListeningPracticeOption {
  id: string;
  label: string; // A, B, C, D, E, F
  imageUrl?: any;
  text?: string;        // Chinese text e.g. 后天
  pinyin?: string;      // Pinyin e.g. hòutiān
}

export interface ListeningPracticeQuestion {
  id: string;
  index: number;
  type: ListeningQuestionType;
  starred?: boolean;     // True/False type: has ★
  sentence?: string;     // True/False sentence displayed in card
  dialogue?: string;     // Group select: dialogue text
  groupImages?: ListeningPracticeOption[];  // Group select: shared image set A-F
  options: ListeningPracticeOption[];
  correctOptionId: string;
}

// =========================================================
// Exam types
// =========================================================
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
