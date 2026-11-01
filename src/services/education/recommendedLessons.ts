import { educationApi } from './api';
import type {
  BackendQuestionSkill,
  BackendTopicSummary,
  RecommendedLessonTarget,
} from './types';

export interface RecommendedLesson extends RecommendedLessonTarget {
  title: string;
  count: number;
  unit: 'mục' | 'câu' | 'từ';
  authored: boolean;
}
export interface LessonRecommendation {
  skill: BackendQuestionSkill;
  lesson: RecommendedLesson | null;
  failed: boolean;
}
export const RECOMMENDED_SKILLS: BackendQuestionSkill[] = [
  'LISTENING',
  'SPEAKING',
  'READING',
  'WRITING',
];
const topicCounts = {
  LISTENING: 'listeningCount',
  SPEAKING: 'speakingCount',
  READING: 'readingCount',
} as const;
const textbookTopic = (topic: BackendTopicSummary) =>
  /^HSK\d+-L\d+$/i.test(topic.topicKey);

function compactTitle(title: string) {
  return title
    .replace(/^HSK\s*\d+\s*[·:–-]\s*/i, '')
    .replace(/\s*·\s*(Nghe|Nói|Đọc|Viết)(?:\s*\(biên soạn\))?$/i, '')
    .trim();
}
async function recommend(
  skill: BackendQuestionSkill,
  level: number,
  topics: BackendTopicSummary[],
): Promise<RecommendedLesson | null> {
  if (skill === 'WRITING') {
    // Writing in the app traces vocabulary, so recommend a topic that actually
    // contains words rather than a workbook's written-answer exercise set.
    const topic = topics.find(
      (item) =>
        item.vocabularyCount > 0 &&
        (textbookTopic(item) || /^\s*Bài\s*\d+/i.test(item.titleVi)),
    );
    if (!topic) return null;
    const lessonNumber = topic.titleVi.match(
      /^\s*Bài\s*(\d+):\s*Ôn từ vựng/i,
    )?.[1];
    return {
      skill,
      hskLevel: level,
      topic: topic.topicKey,
      title: lessonNumber
        ? `Ôn từ vựng ${lessonNumber.padStart(2, '0')}`
        : topic.titleVi,
      count: topic.vocabularyCount,
      unit: 'từ',
      authored: /biên soạn/i.test(topic.titleVi),
    };
  }
  const candidates = topics
    .filter((topic) => topic[topicCounts[skill]] > 0)
    .sort((left, right) =>
      skill === 'SPEAKING'
        ? Number(right.vocabularyCount > 0) - Number(left.vocabularyCount > 0)
        : Number(textbookTopic(right)) - Number(textbookTopic(left)),
    );
  for (const topic of candidates) {
    const response = await educationApi.getPracticeSets({
      skill,
      hskLevel: level,
      topic: topic.topicKey,
      page: 1,
      limit: 1,
    });
    const set = response.data.find(
      (item) =>
        item.skill === skill &&
        item.hskLevel === level &&
        (item.totalQuestions ?? item.practiceSetQuestions?.length ?? 0) > 0,
    );
    if (!set) continue;
    const authored = /biên soạn/i.test(set.title);
    return {
      skill,
      hskLevel: level,
      topic: set.topic,
      practiceSetId: set.id,
      title: compactTitle(set.title) || set.title,
      count: set.totalQuestions ?? set.practiceSetQuestions?.length ?? 0,
      unit: authored ? 'câu' : 'mục',
      authored,
    };
  }
  return null;
}
export async function getRecommendedLessons(
  level: number,
): Promise<LessonRecommendation[]> {
  const topics = (await educationApi.getTopics(level)).filter(
    (topic) => topic.hskLevel === level,
  );
  const results = await Promise.allSettled(
    RECOMMENDED_SKILLS.map((skill) => recommend(skill, level, topics)),
  );
  return results.map((result, index) => ({
    skill: RECOMMENDED_SKILLS[index],
    lesson: result.status === 'fulfilled' ? result.value : null,
    failed: result.status === 'rejected',
  }));
}
