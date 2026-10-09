import { instance } from '../instance';
import {
  StreakLeaderboardParams,
  StreakLeaderboardResponse,
} from './types';

export const leaderboardApi = {
  getStreakLeaderboard: async (
    params?: StreakLeaderboardParams,
  ): Promise<StreakLeaderboardResponse> => {
    const searchParams: Record<string, any> = {};
    if (params?.hskLevel) searchParams.hskLevel = params.hskLevel;
    if (params?.timeframe) searchParams.timeframe = params.timeframe;
    if (params?.limit) searchParams.limit = params.limit;

    return instance
      .get('leaderboard/streak', {
        searchParams,
      })
      .json<StreakLeaderboardResponse>();
  },
};
