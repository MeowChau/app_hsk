import { instance } from '../instance';
import { DashboardStatsResponse, PingSessionDto } from './types';

export const analyticsApi = {
  getDashboard: async (): Promise<DashboardStatsResponse> => {
    return instance.get('analytics/dashboard').json<DashboardStatsResponse>();
  },

  pingSession: async (dto: PingSessionDto): Promise<any> => {
    return instance
      .post('analytics/ping', {
        json: dto,
      })
      .json();
  },
};
