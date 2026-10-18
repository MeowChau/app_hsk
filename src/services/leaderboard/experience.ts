import type {
  ExperienceLeaderboardResponse,
  StreakLeaderboardResponse,
} from './types';

export const getTotalExperience = (
  user?: { level?: number; currentExp?: number } | null,
): number => {
  const level = Math.max(1, Math.floor(user?.level ?? 1));
  const currentExp = Math.max(0, user?.currentExp ?? 0);

  // The backend spends level * 1000 EXP on each level-up. currentExp is
  // only the remainder, so include EXP spent reaching the current level.
  return currentExp + 500 * level * (level - 1);
};

export const buildExperienceLeaderboard = (
  response: StreakLeaderboardResponse,
): ExperienceLeaderboardResponse => {
  const students = [...new Map(
    (response.leaderboard ?? []).map(student => [student.id, student]),
  ).values()];
  const totalStudents = response.summary.totalStudents;
  const hasAuthoritativeRanks = response.metric === 'exp';
  // Older servers select at most 100 students by streak; the new server
  // ranks by EXP first, so its ranks remain valid for a partial population.
  const isComplete = typeof totalStudents === 'number' &&
    totalStudents >= 0 && students.length >= totalStudents;
  const entries = students.map(student => ({
    ...student,
    totalExp: hasAuthoritativeRanks ? student.totalExp ?? getTotalExperience(student) : getTotalExperience(student),
  }));
  const leaderboard = (hasAuthoritativeRanks ? entries : entries.sort((a, b) => b.totalExp - a.totalExp || a.id - b.id))
    .map((student, index) => ({
      ...student,
      rank: hasAuthoritativeRanks ? student.rank ?? null : isComplete ? index + 1 : null,
    }));

  return {
    leaderboard, isComplete, hasAuthoritativeRanks, totalStudents,
    myRank: hasAuthoritativeRanks ? response.myRank ?? null : null,
    myTotalExp: hasAuthoritativeRanks ? response.myTotalExp ?? null : null,
  };
};
