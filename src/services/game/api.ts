import { instance } from '../instance';
import { battleQuestions, type BattleQuestion } from './questions';
import { OfflineGameWord, OfflineTopScore } from './types';

export const gameApi = {
  getOfflineWords: async (
    hskLevel: number,
    limit: number = 30,
  ): Promise<OfflineGameWord[]> => {
    return instance
      .get('game/offline/words', {
        searchParams: {
          hskLevel,
          limit,
        },
      })
      .json<OfflineGameWord[]>();
  },

  submitOfflineScore: async (score: number): Promise<OfflineTopScore> => {
    return instance
      .post('game/offline/submit', {
        json: { score },
      })
      .json<OfflineTopScore>();
  },

  getBattleQuestions: async (hskLevel: number, limit: number = 8): Promise<BattleQuestion[]> => {
    const words = await gameApi.getOfflineWords(hskLevel, limit * 4);
    return battleQuestions(words, limit);
  },

  getOfflineTopScores: async (): Promise<OfflineTopScore[]> => {
    return instance.get('game/offline/top-scores').json<OfflineTopScore[]>();
  },
};
