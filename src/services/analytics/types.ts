export interface DashboardStatsResponse {
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
