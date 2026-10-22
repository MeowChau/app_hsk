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
import { resolveMediaUrl } from '../media';

const mediaOptions = (options?: any[]) => options?.map(option => ({
  ...option, imageUrl: resolveMediaUrl(option.imageUrl),
}));

const practiceOptions = (payload: BackendQuestion['payload']) =>
  (Array.isArray(payload.options) ? payload.options : []).map((option: any, index: number) => {
    const value = typeof option === 'string' ? { text: option } : (option ?? {});
    return {
      id: String(value.id ?? String.fromCharCode(65 + index)),
      label: String(value.label ?? String.fromCharCode(65 + index)),
      text: value.text,
      pinyin: value.pinyin || payload.optionPinyin?.[index],
      imageUrl: resolveMediaUrl(value.imageUrl || payload.optionImages?.[index]),
    };
  });

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
  fallbackAudioUrl?: string | null,
): ListeningPracticeQuestion => {
  const payload = backendQ.payload || {};
  const correctAnswer = backendQ.correctAnswer || {};
  const options: ListeningPracticeOption[] = practiceOptions(payload);

  let mappedType: ListeningQuestionType = 'IMAGE_SELECT';
  if (payload.type) {
    mappedType = payload.type;
  } else if (backendQ.type === 'TRUE_FALSE') {
    mappedType = 'TRUE_FALSE';
  } else if (backendQ.type === 'MATCHING') {
    mappedType = 'GROUP_SELECT';
  } else if (options.some(option => option.text && !option.imageUrl)) {
    mappedType = 'VOCAB_SELECT';
  }

  const correctOptionId = String(
    correctAnswer.optionId ?? correctAnswer.id ?? correctAnswer.correctOptionId ?? correctAnswer.answer ?? payload.correctOptionId ?? '',
  );

  return {
    id: String(backendQ.id),
    index: payload.index ?? fallbackIndex,
    type: mappedType,
    starred: payload.starred ?? false,
    sentence: payload.sentence || payload.text,
    dialogue: payload.dialogue,
    audioUrl: resolveMediaUrl(payload.audioUrl || fallbackAudioUrl),
    groupImages: mediaOptions(payload.groupImages),
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
  const sentence = payload.sentence || payload.text;
  const text = typeof payload.text === 'string' ? payload.text.trim() : '';
  const instruction = typeof payload.instruction === 'string' && payload.instruction.trim()
    ? payload.instruction.trim()
    : typeof payload.sentence === 'string' && text !== payload.sentence
      ? (text.endsWith(payload.sentence) ? text.slice(0, -payload.sentence.length) : text).trim().replace(/[:：]\s*$/, '')
      : undefined;

  let mappedType: ReadingQuestionType = 'MULTIPLE_CHOICE';
  if (payload.templateId === 'read-guided-practice') {
    mappedType = 'GUIDED_PRACTICE';
  } else if (payload.type) {
    mappedType = payload.type;
  } else if (backendQ.type === 'TRUE_FALSE') {
    mappedType = 'TRUE_FALSE';
  } else if (backendQ.type === 'MATCHING') {
    mappedType = payload.groupImages ? 'GROUP_IMAGE' : 'GROUP_VOCAB';
  }

  const options: ReadingPracticeOption[] = practiceOptions(payload);

  const correctOptionId = String(
    correctAnswer.optionId ?? correctAnswer.id ?? correctAnswer.correctOptionId ?? correctAnswer.answer ?? payload.correctOptionId ?? '',
  );

  const bbox = payload.source?.bbox;
  const hasVerifiedTranscription = payload.source?.readingReview?.transcriptionVerified === true
    && typeof payload.sentence === 'string' && payload.sentence.trim().length > 0;
  const scanUrl = resolveMediaUrl(payload.imageUrl || payload.source?.scanUrl);
  const imageAspectRatio = Array.isArray(bbox) && bbox.length === 4 && bbox[2] > bbox[0] && bbox[3] > bbox[1]
    ? (bbox[2] - bbox[0]) / (bbox[3] - bbox[1])
    : undefined;

  return {
    id: String(backendQ.id),
    index: payload.index ?? fallbackIndex,
    type: mappedType,
    sentence,
    instruction: instruction?.replace(/\s*Hình A đã dùng cho ví dụ[.!]?/gi, '').trim() || undefined,
    pinyin: payload.pinyin,
    character: payload.character,
    imageUrl: hasVerifiedTranscription ? undefined : scanUrl,
    imageAspectRatio,
    contextImageUrl: !hasVerifiedTranscription || payload.templateId === 'read-image-matching'
      ? resolveMediaUrl(payload.contextImageUrl) : undefined,
    requiresManualReview: Boolean(payload.manualGrading) || !correctOptionId,
    options,
    correctOptionId,
    groupImages: mediaOptions(payload.groupImages),
    groupVocabs: payload.groupVocabs,
    example: payload.example,
  };
};

export const transformQuestionToSpeaking = (
  backendQ: BackendQuestion,
  fallbackAudioUrl?: string | null,
): SpeakingPracticeQuestion => {
  const payload = backendQ.payload || {};
  return {
    id: String(backendQ.id),
    character: payload.character || payload.hanzi || payload.source?.sourceWord || '',
    pinyin: payload.pinyin || '',
    meaning: payload.meaning || payload.translation || '',
    audioUrl: resolveMediaUrl(payload.audioUrl || fallbackAudioUrl),
  };
};
