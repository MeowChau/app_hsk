export interface StreakRankingStudent {
  userId: number;
  userName: string;
  avatar?: string | null;
  currentStreak: number;
  hskLevel: number;
  totalStudyDays: number;
  totalStudySeconds: number;
  rank: number;
}

export interface StreakLeaderboardResponse {
  summary: {
    totalStudents: number;
    averageStreak: number;
    highestStreak: number;
  };
  rankings: StreakRankingStudent[];
}

export interface StreakLeaderboardParams {
  hskLevel?: number;
  timeframe?: 'all' | 'month' | 'week';
  limit?: number;
}
