export interface DashboardStatsResponse {
  timeZone?: string;
  timeTodaySeconds?: number;
  time7DaysSeconds?: number;
  timeTotalSeconds?: number;
  chart7DaysSeconds?: number[];
  chart7Dates?: string[];
  weekDaysStudied?: number;
  weekAverageSeconds?: number;
  weekLongestStreak?: number;
  activityTimes?: Record<'review' | 'practice' | 'exam' | 'pk', number>;
  vocabularyStats?: { learnedCount: number; masteredCount: number; learningCount: number; reviewCount: number };
  timeToday: number;
  time7Days: number;
  timeTotal: number;
  chart7Days: number[];
  totalDaysStudied: number;
  averagePerDay: number;
  longestStreak: number;
}

export interface PingSessionDto {
  durationInSeconds: number;
  module: string;
}

export interface PingSessionResponse {
  id?: number;
}
