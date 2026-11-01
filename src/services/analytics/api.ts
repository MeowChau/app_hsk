import { instance } from '../instance';
import { CheckInResponse, DashboardStatsResponse, PingSessionDto, PingSessionResponse, VocabularyProgressDto, VocabularyProgressResponse } from './types';

const pingSession = async <T extends PingSessionResponse = PingSessionResponse>(dto: PingSessionDto): Promise<T> => {
  return instance
    .post('analytics/ping', {
      json: dto,
    })
    .json<T>();
};

export const analyticsApi = {
  getDashboard: async (): Promise<DashboardStatsResponse> => {
    return instance.get('analytics/dashboard').json<DashboardStatsResponse>();
  },

  pingSession,

  recordVocabularyProgress: (dto: VocabularyProgressDto): Promise<VocabularyProgressResponse> =>
    instance.post('analytics/vocabulary-progress', { json: dto }).json<VocabularyProgressResponse>(),

  // The existing endpoint records attendance as a session and requires >= 1 second.
  checkIn: (): Promise<CheckInResponse> =>
    pingSession<CheckInResponse>({ durationInSeconds: 1, module: 'daily_checkin' }),
};
