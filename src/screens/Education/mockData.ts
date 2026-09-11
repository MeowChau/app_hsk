import { HskExam } from './types';

export const SKILLS = [
  { id: 'NGHE', name: 'NGHE' },
  { id: 'NOI', name: 'NÓI' },
  { id: 'DOC', name: 'ĐỌC' },
  { id: 'VIET', name: 'VIẾT' },
];

export const HSK_LEVELS = [
  { level: 1, title: 'HSK 1', subtitle: '“Số lượng”' },
  { level: 2, title: 'HSK 2', subtitle: '“Số lượng”' },
  { level: 3, title: 'HSK 3', subtitle: '“Số lượng”' },
  { level: 4, title: 'HSK 4', subtitle: '“Số lượng”' },
];

// Sinh 50 đề thi HSK cho mỗi level
const generateExams = (level: number, count: number): HskExam[] => {
  return Array.from({ length: count }).map((_, index) => ({
    id: `hsk${level}_exam_${index + 1}`,
    level: level,
    name: `HSK ${level} - Đề ${index + 1}`,
    timeLimit: 30,
    listeningCount: 20,
    readingCount: 20,
  }));
};

export const ALL_HSK_EXAMS: Record<number, HskExam[]> = {
  1: generateExams(1, 50),
  2: generateExams(2, 50),
  3: generateExams(3, 50),
  4: generateExams(4, 50),
};
