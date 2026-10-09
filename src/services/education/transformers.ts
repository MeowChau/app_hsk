import {
  SkillType,
  ListeningPracticeQuestion,
  ListeningPracticeOption,
  ListeningQuestionType,
  ReadingPracticeQuestion,
  ReadingPracticeOption,
  ReadingQuestionType,
  SpeakingPracticeQuestion,
} from '@/screens/Education/types';
import { BackendQuestion, BackendQuestionSkill } from './types';

export const toBackendSkill = (skill: SkillType): BackendQuestionSkill => {
  switch (skill) {
    case 'NGHE':
      return 'LISTENING';
    case 'DOC':
      return 'READING';
    case 'VIET':
      return 'WRITING';
    case 'NOI':
      return 'SPEAKING';
    default:
      return 'LISTENING';
  }
};

export const toAppSkill = (skill: BackendQuestionSkill): SkillType => {
  switch (skill) {
    case 'LISTENING':
      return 'NGHE';
    case 'READING':
      return 'DOC';
    case 'WRITING':
      return 'VIET';
    case 'SPEAKING':
      return 'NOI';
    default:
      return 'NGHE';
  }
};

export const transformQuestionToListening = (
  backendQ: BackendQuestion,
  fallbackIndex: number,
): ListeningPracticeQuestion => {
  const payload = backendQ.payload || {};
  const correctAnswer = backendQ.correctAnswer || {};

  let mappedType: ListeningQuestionType = 'IMAGE_SELECT';
  if (payload.type) {
    mappedType = payload.type;
  } else if (backendQ.type === 'TRUE_FALSE') {
    mappedType = 'TRUE_FALSE';
  } else if (backendQ.type === 'MATCHING') {
    mappedType = 'GROUP_SELECT';
  } else if (payload.options && payload.options.some((o: any) => o.text && !o.imageUrl)) {
    mappedType = 'VOCAB_SELECT';
  }

  const options: ListeningPracticeOption[] = Array.isArray(payload.options)
    ? payload.options.map((opt: any, idx: number) => ({
        id: String(opt.id ?? String.fromCharCode(65 + idx)),
        label: String(opt.label ?? String.fromCharCode(65 + idx)),
        text: opt.text,
        pinyin: opt.pinyin,
        imageUrl: opt.imageUrl,
      }))
    : [];

  const correctOptionId = String(
    correctAnswer.optionId ?? correctAnswer.id ?? payload.correctOptionId ?? (options[0]?.id || 'A'),
  );

  return {
    id: String(backendQ.id),
    index: payload.index ?? fallbackIndex,
    type: mappedType,
    starred: payload.starred ?? false,
    sentence: payload.sentence,
    dialogue: payload.dialogue,
    groupImages: payload.groupImages,
    options,
    correctOptionId,
  };
};

export const transformQuestionToReading = (
  backendQ: BackendQuestion,
  fallbackIndex: number,
): ReadingPracticeQuestion => {
  const payload = backendQ.payload || {};
  const correctAnswer = backendQ.correctAnswer || {};

  let mappedType: ReadingQuestionType = 'MULTIPLE_CHOICE';
  if (payload.type) {
    mappedType = payload.type;
  } else if (backendQ.type === 'TRUE_FALSE') {
    mappedType = 'TRUE_FALSE';
  } else if (backendQ.type === 'MATCHING') {
    mappedType = payload.groupImages ? 'GROUP_IMAGE' : 'GROUP_VOCAB';
  }

  const options: ReadingPracticeOption[] = Array.isArray(payload.options)
    ? payload.options.map((opt: any, idx: number) => ({
        id: String(opt.id ?? String.fromCharCode(65 + idx)),
        label: String(opt.label ?? String.fromCharCode(65 + idx)),
        text: opt.text,
        imageUrl: opt.imageUrl,
      }))
    : [];

  const correctOptionId = String(
    correctAnswer.optionId ?? correctAnswer.id ?? payload.correctOptionId ?? (options[0]?.id || 'A'),
  );

  return {
    id: String(backendQ.id),
    index: payload.index ?? fallbackIndex,
    type: mappedType,
    sentence: payload.sentence,
    pinyin: payload.pinyin,
    character: payload.character,
    imageUrl: payload.imageUrl,
    options,
    correctOptionId,
    groupImages: payload.groupImages,
    groupVocabs: payload.groupVocabs,
    example: payload.example,
  };
};

export const transformQuestionToSpeaking = (
  backendQ: BackendQuestion,
): SpeakingPracticeQuestion => {
  const payload = backendQ.payload || {};
  return {
    id: String(backendQ.id),
    character: payload.character || payload.hanzi || '',
    pinyin: payload.pinyin || '',
    meaning: payload.meaning || '',
  };
};
