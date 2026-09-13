export type SkillType = 'NGHE' | 'NOI' | 'DOC' | 'VIET';

export type EducationViewMode = 'main' | 'examList' | 'examTest' | 'examResult' | 'examReview' | 'skillSetup' | 'skillFlashcard' | 'skillPractice' | 'skillPracticeResult' | 'speakingPracticeSetup' | 'speakingPractice' | 'speakingPracticeResult' | 'readingPracticeSetup' | 'readingPractice' | 'readingPracticeResult';

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

// =========================================================
// Speaking Practice
// =========================================================
export interface SpeakingPracticeQuestion {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
}

// =========================================================
// Reading Practice
// =========================================================
export type ReadingQuestionType = 'TRUE_FALSE' | 'GROUP_IMAGE' | 'GROUP_VOCAB' | 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'MATCH_IMAGE';

export interface ReadingPracticeOption {
  id: string;
  label: string; // A, B, C, D
  text?: string;
  imageUrl?: any;
}

export interface ReadingPracticeQuestion {
  id: string;
  index: number;
  type: ReadingQuestionType;
  sentence?: string;    // Câu hỏi hoặc đoạn văn
  pinyin?: string;      // Pinyin (đối với True/False hoặc câu lẻ)
  character?: string;   // Chữ Hán to (đối với True/False)
  imageUrl?: any;       // Hình ảnh (đối với True/False)
  options: ReadingPracticeOption[];
  correctOptionId: string;
  groupImages?: ReadingPracticeOption[]; // Danh sách hình A-F cho GROUP_IMAGE
  groupVocabs?: ReadingPracticeOption[]; // Danh sách từ vựng A-F cho GROUP_VOCAB
  example?: {
    sentence: string; // "例如 Wǒ hěn xǐhuan zhè běn shū.\n我很喜欢这本书。"
    answer: string;   // "E"
  };
}

export interface SpeakingPracticeResult {
  score: number;        // Average score
  passedCount: number;  // Items >= 75 points
  totalCount: number;
}
