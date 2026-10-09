export interface StreakLeaderboardItem {
  id: number;
  fullName: string;
  email?: string;
  studentCode?: number | null;
  avatarFrame?: string | null;
  level: number;
  currentExp?: number;
  targetHskLevel?: number | null;
  currentHskLevel?: number | null;
  photo?: { id?: string; path: string } | null;
  currentStreak: number;
  longestStreak?: number;
  totalDays?: number;
  totalHours?: number;
  lastStudyDate?: string | null;
  streakStatus?: string;
}

export interface StreakRankingStudent {
  userId: number;
  userName: string;
  avatar?: string | null;
  currentStreak: number;
  hskLevel: number;
  totalStudyDays?: number;
  totalStudySeconds?: number;
  rank: number;
}

export interface StreakLeaderboardResponse {
  summary: {
    topStreak?: number;
    topStreakUser?: string | null;
    allTimeRecord?: number;
    activeStreaksCount?: number;
    totalStudents?: number;
    totalStudyHours?: number;
  };
  leaderboard?: StreakLeaderboardItem[];
  rankings?: StreakRankingStudent[];
}

export interface StreakLeaderboardParams {
  hskLevel?: number;
  timeframe?: 'all' | 'month' | 'week';
  limit?: number;
}
