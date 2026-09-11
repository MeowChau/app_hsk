import { HskExam, ExamQuestion } from './types';

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

const generateQuestions = (level: number): ExamQuestion[] => {
  const questions: ExamQuestion[] = [];
  
  // 20 Listening Questions
  for (let i = 1; i <= 20; i++) {
    questions.push({
      id: `q_list_${i}`,
      type: 'LISTENING',
      index: i,
      imageUrl: require('@/theme/assets/images/student.png'),
      options: [
        { id: 'opt1', label: '', text: '对' },
        { id: 'opt2', label: '', text: '错' }
      ],
      correctOptionId: 'opt1'
    });
  }

  // 20 Reading Questions
  for (let i = 21; i <= 40; i++) {
    questions.push({
      id: `q_read_${i}`,
      type: 'READING',
      index: i,
      options: [
        { id: 'optA', label: 'A', imageUrl: require('@/theme/assets/images/tom.png') },
        { id: 'optB', label: 'B', imageUrl: require('@/theme/assets/images/student.png') },
        { id: 'optC', label: 'C', imageUrl: require('@/theme/assets/images/tom.png') }
      ],
      correctOptionId: 'optA'
    });
  }

  return questions;
};

// Sinh 50 đề thi HSK cho mỗi level
const generateExams = (level: number, count: number): HskExam[] => {
  return Array.from({ length: count }).map((_, index) => ({
    id: `hsk${level}_exam_${index + 1}`,
    level: level,
    name: `HSK ${level} - Đề ${index + 1}`,
    timeLimit: 30,
    listeningCount: 20,
    readingCount: 20,
    questions: generateQuestions(level),
  }));
};

export const ALL_HSK_EXAMS: Record<number, HskExam[]> = {
  1: generateExams(1, 50),
  2: generateExams(2, 50),
  3: generateExams(3, 50),
  4: generateExams(4, 50),
};
