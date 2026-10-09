import { HskExam, ExamQuestion, QuestionOption } from '@/screens/Education/types';
import { BackendExam, BackendExamSectionQuestion } from './types';

export const transformSectionQuestionToExamQuestion = (
  sq: BackendExamSectionQuestion,
  fallbackIndex: number,
  fallbackAudioUrl?: string | null,
): ExamQuestion => {
  const q = sq.question;
  const payload = q.payload || {};
  const correctAnswer = q.correctAnswer || {};

  const type = q.skill === 'LISTENING' ? 'LISTENING' : 'READING';

  const options: QuestionOption[] = Array.isArray(payload.options)
    ? payload.options.map((opt: any, idx: number) => ({
        id: String(opt.id ?? String.fromCharCode(65 + idx)),
        label: String(opt.label ?? String.fromCharCode(65 + idx)),
        text: opt.text,
        imageUrl: opt.imageUrl,
      }))
    : [];

  const correctOptionId = String(
    correctAnswer.optionId ??
      correctAnswer.id ??
      payload.correctOptionId ??
      (options[0]?.id || 'A'),
  );

  return {
    id: String(q.id),
    type,
    index: payload.index ?? fallbackIndex,
    audioUrl: payload.audioUrl || fallbackAudioUrl,
    imageUrl: payload.imageUrl,
    text: payload.text || payload.sentence || payload.questionText,
    options,
    correctOptionId,
  };
};

export const transformBackendExamToApp = (backendExam: BackendExam): HskExam => {
  const sections = backendExam.sections || [];

  let listeningCount = 0;
  let readingCount = 0;
  const questions: ExamQuestion[] = [];

  let questionIndex = 1;
  sections.forEach((sec) => {
    const secQuestions = sec.sectionQuestions || [];
    secQuestions.forEach((sq) => {
      if (sq.question.skill === 'LISTENING') {
        listeningCount++;
      } else {
        readingCount++;
      }

      questions.push(
        transformSectionQuestionToExamQuestion(
          sq,
          questionIndex++,
          sec.audioUrl,
        ),
      );
    });
  });

  // Standard exam time limits based on HSK level
  const standardTimeLimits: Record<number, number> = {
    1: 40,
    2: 55,
    3: 90,
    4: 105,
    5: 125,
    6: 140,
  };

  return {
    id: String(backendExam.id),
    level: backendExam.hskLevel,
    name: backendExam.title,
    timeLimit: standardTimeLimits[backendExam.hskLevel] ?? 40,
    listeningCount,
    readingCount,
    questions,
  };
};
