import { HskExam, ExamQuestion, QuestionOption } from '@/screens/Education/types';
import { BackendExam, BackendExamSectionQuestion } from './types';
import { resolveMediaUrl } from '../media';

export const transformSectionQuestionToExamQuestion = (
  sq: BackendExamSectionQuestion,
  fallbackIndex: number,
  fallbackAudioUrl?: string | null,
): ExamQuestion => {
  const q = sq.question;
  if (!q) throw new Error('Đề thi có câu hỏi chưa được tải đầy đủ.');
  if (q.skill !== 'LISTENING' && q.skill !== 'READING' && q.skill !== 'WRITING') {
    throw new Error(`Kỹ năng ${q.skill} chưa được hỗ trợ trong đề thi này.`);
  }
  const payload = q.payload || {};
  const correctAnswer = q.correctAnswer || {};

  const type = q.skill;

  const options: QuestionOption[] = Array.isArray(payload.options)
    ? payload.options.map((opt: any, idx: number) => ({
        id: String(opt.id ?? String.fromCharCode(65 + idx)),
        label: String(opt.label ?? String.fromCharCode(65 + idx)),
        text: opt.text,
        imageUrl: resolveMediaUrl(opt.imageUrl),
      }))
    : [];

  const correctOptionId = String(
    correctAnswer.optionId ??
      correctAnswer.id ??
      correctAnswer.correctOptionId ??
      payload.correctOptionId ??
      '',
  );

  return {
    id: String(q.id),
    type,
    index: payload.index ?? fallbackIndex,
    audioUrl: resolveMediaUrl(payload.audioUrl || fallbackAudioUrl),
    imageUrl: resolveMediaUrl(payload.imageUrl),
    text: payload.text || payload.sentence || payload.questionText,
    options,
    correctOptionId,
    ...(type === 'WRITING' ? { writing: {
      instruction: typeof payload.instruction === 'string' ? payload.instruction : undefined,
      // Some seed prompts include the solution after an arrow or inside pinyin parentheses.
      pinyin: typeof payload.pinyin === 'string'
        ? payload.pinyin.replace(/\s*[（(][^）)]*[\u3400-\u9fff][^）)]*[）)]/g, '').trim() : undefined,
      hint: typeof payload.hint === 'string' ? payload.hint.split(/\s*(?:->|→|=>)\s*/)[0].trim() : undefined,
      words: Array.isArray(payload.words) ? payload.words.filter((word: unknown): word is string => typeof word === 'string') : [],
      keyword: typeof payload.keyword === 'string' ? payload.keyword : undefined,
      correctAnswers: [correctAnswer.answer, ...(Array.isArray(correctAnswer.answers) ? correctAnswer.answers : [])]
        .filter((answer: unknown): answer is string => typeof answer === 'string' && answer.trim().length > 0),
    } } : {}),
  };
};

export const transformBackendExamToApp = (backendExam: BackendExam): HskExam => {
  const sections = backendExam.sections || [];

  let listeningCount = 0;
  let readingCount = 0;
  let writingCount = 0;
  const questions: ExamQuestion[] = [];
  const unsupportedSkills = new Set<string>();

  let questionIndex = 1;
  [...sections].sort((a, b) => a.order - b.order).forEach((sec) => {
    const secQuestions = [...(sec.sectionQuestions || [])].sort((a, b) => a.order - b.order);
    secQuestions.forEach((sq) => {
      if (!sq.question) throw new Error('Đề thi có câu hỏi chưa được tải đầy đủ.');
      if (sq.question.skill !== 'LISTENING' && sq.question.skill !== 'READING' && sq.question.skill !== 'WRITING') {
        unsupportedSkills.add(sq.question.skill);
        return;
      }
      if (sq.question.skill === 'LISTENING') {
        listeningCount++;
      } else if (sq.question.skill === 'READING') {
        readingCount++;
      } else {
        writingCount++;
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
    writingCount,
    questions,
    unsupportedSkills: [...unsupportedSkills],
  };
};
