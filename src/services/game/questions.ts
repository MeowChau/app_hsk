import type { OfflineGameWord } from './types';

export interface BattleQuestion {
  id: number;
  hanzi: string;
  pinyin: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export const battleQuestions = (
  words: OfflineGameWord[],
  limit: number,
): BattleQuestion[] => {
  const seenIds = new Set<number>();
  const seenMeanings = new Set<string>();
  const available = words.filter((word) => {
    const meaning = word.meaning?.trim();
    if (
      !word.hanzi?.trim() ||
      !meaning ||
      seenIds.has(word.id) ||
      seenMeanings.has(meaning)
    )
      return false;
    seenIds.add(word.id);
    seenMeanings.add(meaning);
    return true;
  });
  if (available.length < limit * 4) {
    throw new Error(
      'Cấp HSK này chưa có đủ từ vựng để tạo một lượt chơi. Vui lòng chọn cấp khác trong Tài khoản.',
    );
  }
  return Array.from({ length: limit }, (_, index) => {
    const options = available.slice(index * 4, index * 4 + 4);
    const correctIndex = Math.floor(Math.random() * options.length);
    const correct = options[correctIndex];
    return {
      id: correct.id,
      hanzi: correct.hanzi,
      pinyin: correct.pinyin,
      prompt: 'CHỌN NGHĨA ĐÚNG CỦA TỪ',
      options: options.map((word) => word.meaning),
      correctIndex,
    };
  });
};
