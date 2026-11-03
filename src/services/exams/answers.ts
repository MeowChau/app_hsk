import type { ExamQuestion } from '@/screens/Education/types';

export const hasExamAnswer = (answer?: string): boolean => !!answer?.trim();

// Match the server's model answer; spaces and final punctuation do not change a Chinese answer.
export const normalizeWritingAnswer = (answer: string): string => answer
  .normalize('NFKC')
  .replace(/[\s\u200B-\u200D\uFEFF]+/g, '')
  .replace(/[。.!！?？]+$/, '');

export const isExamAnswerCorrect = (question: ExamQuestion, answer?: string): boolean => {
  if (question.requiresManualReview) return false;
  if (!hasExamAnswer(answer)) return false;
  if (question.type !== 'WRITING') return answer === question.correctOptionId;
  const normalized = normalizeWritingAnswer(answer!);
  return !!normalized && !!question.writing?.correctAnswers.some(model => normalizeWritingAnswer(model) === normalized);
};

export const hasExamAnswerKey = (question: ExamQuestion): boolean => question.type === 'WRITING'
  ? Boolean(question.writing?.correctAnswers.some(answer => normalizeWritingAnswer(answer)))
  : Boolean(question.correctOptionId && question.options.some(option => option.id === question.correctOptionId));
