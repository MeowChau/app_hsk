import type { SurveyData } from '../storage';
import {
  getSurveyData,
  hasPendingSurvey,
  setCompletedSurvey,
  setPendingSurvey,
  getAuthSessionVersion,
} from '../storage';
import type { UpdateStudyGoalsDto, User } from './types';
import { authApi } from './api';

export const surveyStudyGoals = (answers: SurveyData): UpdateStudyGoalsDto => {
  const goals: UpdateStudyGoalsDto = {};
  const level = (text: string) => {
    if (text === 'Người mới bắt đầu') return 1;
    const match = /^HSK\s*([1-9])$/.exec(text);
    return match ? Number(match[1]) : undefined;
  };
  const current = level(answers.currentLevel);
  const target = level(answers.targetLevel);
  if (current !== undefined) goals.currentHskLevel = current;
  if (target !== undefined) goals.targetHskLevel = target;
  if (answers.dailyTime) {
    const hours = /(?:^|\s)(\d+)\s*giờ/.exec(answers.dailyTime);
    const minutes = /(?:^|\s)(\d+)\s*phút/.exec(answers.dailyTime);
    if (hours || minutes)
      goals.dailyStudyTime =
        Number(hours?.[1] ?? 0) * 60 + Number(minutes?.[1] ?? 0);
  }
  return goals;
};

export const syncPendingSurvey = async (user: User): Promise<User> => {
  const answers = getSurveyData(user.id);
  if (!hasPendingSurvey(user.id) || !answers) return user;
  const version = getAuthSessionVersion();
  try {
    const goals = surveyStudyGoals(answers);
    const updated = Object.keys(goals).length
      ? await authApi.updateStudyGoals(goals)
      : user;
    if (getAuthSessionVersion() !== version) return user;
    setPendingSurvey(user.id, false);
    setCompletedSurvey(user.id);
    return updated;
  } catch {
    // An unsuccessful sync leaves this account's survey available to retry.
    return user;
  }
};
