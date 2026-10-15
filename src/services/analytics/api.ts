import { instance } from '../instance';
import { DashboardStatsResponse, PingSessionDto, PingSessionResponse } from './types';

export const analyticsApi = {
  getDashboard: async (): Promise<DashboardStatsResponse> => {
    return instance.get('analytics/dashboard').json<DashboardStatsResponse>();
  },

  pingSession: async (dto: PingSessionDto): Promise<PingSessionResponse> => {
    return instance
      .post('analytics/ping', {
        json: dto,
      })
      .json<PingSessionResponse>();
  },
};
