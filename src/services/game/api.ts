import { instance } from '../instance';
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

  getBattleQuestions: async (limit: number = 8): Promise<any[]> => {
    const res = await instance
      .get('vocabulary', {
        searchParams: {
          limit: limit * 4,
        },
      })
      .json<any>();
    
    const words = res.data || [];
    const questions: any[] = [];
    
    // Group words into chunks of 4 to create options
    for (let i = 0; i < limit && i * 4 + 3 < words.length; i++) {
      const chunk = words.slice(i * 4, i * 4 + 4);
      const correctIdx = Math.floor(Math.random() * 4);
      const correctWord = chunk[correctIdx];
      
      questions.push({
        id: correctWord.id,
        hanzi: correctWord.hanzi,
        pinyin: correctWord.pinyin,
        prompt: 'CHỌN NGHĨA ĐÚNG CỦA TỪ',
        options: chunk.map((w: any) => w.meaning),
        correctIndex: correctIdx,
      });
    }
    
    return questions;
  },

  getOfflineTopScores: async (): Promise<OfflineTopScore[]> => {
    return instance.get('game/offline/top-scores').json<OfflineTopScore[]>();
  },
};
