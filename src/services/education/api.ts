import { instance } from '../instance';
import {
  BackendPracticeSet,
  BackendTopicSummary,
  PaginatedResponse,
  PracticeSetQueryParams,
  BackendQuestionSkill,
  PracticeQuestionEntry,
  SkillTopicSummary,
  SkillPracticeSetSummary,
  BackendQuestion,
} from './types';

const summarizeQuestions = (questions: BackendQuestion[]) => {
  const origins = new Set(questions.map(question => question.payload?.source?.origin ?? 'unknown'));
  const sourceKind: SkillTopicSummary['sourceKind'] = origins.size !== 1
    ? 'other'
    : origins.has('authored-from-source-vocabulary')
      ? 'vocabulary'
      : origins.has('original-workbook')
        ? 'textbook'
        : 'other';
  return {
    questionCount: questions.length,
    groupedExerciseCount: questions.filter(question => question.payload?.templateId === 'read-guided-practice').length,
    sourceKind,
  };
};

const getLessonNumber = (topic: BackendTopicSummary): number => {
  const match =
    topic.topicKey.match(/-L(\d+)$/i) ??
    topic.titleVi.match(/^\s*Bài\s*(\d+)/i);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
};

export const educationApi = {
  getPracticeSets: async (
    params?: PracticeSetQueryParams,
  ): Promise<PaginatedResponse<BackendPracticeSet>> => {
    const searchParams: Record<string, any> = {};
    if (params?.page) searchParams.page = params.page;
    if (params?.limit) searchParams.limit = params.limit;
    if (params?.skill) searchParams.skill = params.skill;
    if (params?.hskLevel) searchParams.hskLevel = params.hskLevel;
    if (params?.topic) searchParams.topic = params.topic;
    if (params?.search) searchParams.search = params.search;

    return instance
      .get('practice-sets', {
        searchParams,
      })
      .json<PaginatedResponse<BackendPracticeSet>>();
  },

  getPracticeSetById: async (id: number): Promise<BackendPracticeSet> => {
    return instance.get(`practice-sets/${id}`).json<BackendPracticeSet>();
  },

  getAllPracticeSets: async (
    params: Pick<PracticeSetQueryParams, 'hskLevel' | 'topic'> & { skill: BackendQuestionSkill },
  ): Promise<BackendPracticeSet[]> => {
    const sets: BackendPracticeSet[] = [];
    let page = 1;
    let totalPages = 1;
    do {
      const response = await educationApi.getPracticeSets({ ...params, page, limit: 100 });
      sets.push(...response.data);
      totalPages = response.totalPages;
      page += 1;
    } while (page <= totalPages);

    return Promise.all(sets.sort((a, b) => a.id - b.id).map(set =>
      set.practiceSetQuestions?.every(link => link.question)
        && set.practiceSetQuestions.length === (set.totalQuestions ?? set.practiceSetQuestions.length)
        ? set
        : educationApi.getPracticeSetById(set.id),
    ));
  },

  getPracticeSetSummaries: async (
    skill: BackendQuestionSkill,
    hskLevel: number,
  ): Promise<SkillPracticeSetSummary[]> => {
    const sets = await educationApi.getAllPracticeSets({ skill, hskLevel });
    const categoryOrder = { textbook: 0, vocabulary: 1, other: 2 };
    const lessonNumber = (set: BackendPracticeSet) => Number(
      set.topic.match(/-L(\d+)$/i)?.[1]
      ?? set.title.match(/(?:Bài|Ôn từ vựng)\s*(\d+)/i)?.[1]
      ?? Number.MAX_SAFE_INTEGER,
    );
    return sets.map(set => ({
      ...set,
      ...summarizeQuestions((set.practiceSetQuestions ?? []).map(link => link.question).filter(Boolean)),
    })).sort((left, right) =>
      left.hskLevel - right.hskLevel
      || categoryOrder[left.sourceKind] - categoryOrder[right.sourceKind]
      || lessonNumber(left) - lessonNumber(right)
      || left.id - right.id);
  },

  getPracticeQuestions: async (
    params: Pick<PracticeSetQueryParams, 'hskLevel' | 'topic'> & { skill: BackendQuestionSkill },
  ): Promise<PracticeQuestionEntry[]> => {
    const details = await educationApi.getAllPracticeSets(params);
    const seen = new Set<string>();
    return details.flatMap(set => [...(set.practiceSetQuestions ?? [])]
      .sort((a, b) => a.order - b.order)
      .flatMap(link => {
        if (!link.question) return [];
        // A question may belong to more than one set/topic. Keep it once per
        // topic, so the count and the actual practice session stay consistent.
        const key = JSON.stringify([set.topic, link.question.id]);
        if (seen.has(key)) return [];
        seen.add(key);
        return [{ question: link.question, topic: set.topic, fallbackAudioUrl: set.audioUrl }];
      }));
  },

  getTopicsForSkill: async (
    skill: BackendQuestionSkill,
    hskLevel?: number,
  ): Promise<SkillTopicSummary[]> => {
    const [topics, questions] = await Promise.all([
      educationApi.getTopics(hskLevel),
      educationApi.getPracticeQuestions({ skill, hskLevel }),
    ]);
    const questionsByTopic = new Map<string, BackendQuestion[]>();
    questions.forEach(({ topic, question }) => {
      const items = questionsByTopic.get(topic) ?? [];
      items.push(question);
      questionsByTopic.set(topic, items);
    });
    return topics.flatMap(topic => {
      const items = questionsByTopic.get(topic.topicKey);
      return items ? [{ ...topic, ...summarizeQuestions(items) }] : [];
    });
  },

  getTopics: async (hskLevel?: number): Promise<BackendTopicSummary[]> => {
    const searchParams = hskLevel ? { hskLevel } : undefined;
    const topics = await instance
      .get('practice-sets/topics', {
        searchParams,
      })
      .json<BackendTopicSummary[]>();

    return topics.sort(
      (left, right) =>
        left.hskLevel - right.hskLevel ||
        getLessonNumber(left) - getLessonNumber(right) ||
        left.titleVi.localeCompare(right.titleVi, 'vi'),
    );
  },

  getSummary: async (
    skill?: BackendQuestionSkill,
  ): Promise<{
    totalSets: number;
    totalQuestions: number;
    bySkill?: Record<string, number>;
  }> => {
    const searchParams = skill ? { skill } : undefined;
    return instance
      .get('practice-sets/summary', {
        searchParams,
      })
      .json<{
        totalSets: number;
        totalQuestions: number;
        bySkill?: Record<string, number>;
      }>();
  },
};
