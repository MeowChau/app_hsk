import { SpeakingPracticeQuestion } from '../../types';

export const generateSpeakingQuestions = (topic: string): SpeakingPracticeQuestion[] => {
  // Simplified mock data based on topics
  const data: SpeakingPracticeQuestion[] = [
    { id: 's1', character: '几', pinyin: 'jǐ', meaning: 'bao nhiêu' },
    { id: 's2', character: '那', pinyin: 'nà', meaning: 'đó' },
    { id: 's3', character: '什么', pinyin: 'shénme', meaning: 'gì' },
    { id: 's4', character: '怎么', pinyin: 'zěnme', meaning: 'thế nào' },
    { id: 's5', character: '谁', pinyin: 'shéi', meaning: 'ai' },
    { id: 's6', character: '多', pinyin: 'duō', meaning: 'nhiều' },
    { id: 's7', character: '少', pinyin: 'shǎo', meaning: 'ít' },
    { id: 's8', character: '为什么', pinyin: 'wèishénme', meaning: 'tại sao' },
  ];

  return data;
};
