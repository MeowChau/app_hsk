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
  totalExp?: number;
  rank?: number | null;
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
  metric?: 'exp' | 'streak';
  myRank?: number | null;
  myTotalExp?: number | null;
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
  metric?: 'exp' | 'streak';
  hskLevel?: number;
  timeframe?: 'all' | 'month' | 'week';
  limit?: number;
}

export interface ExperienceLeaderboardItem extends StreakLeaderboardItem {
  totalExp: number;
  rank: number | null;
}

export interface ExperienceLeaderboardResponse {
  leaderboard: ExperienceLeaderboardItem[];
  isComplete: boolean;
  hasAuthoritativeRanks: boolean;
  totalStudents?: number;
  myRank?: number | null;
  myTotalExp?: number | null;
}
