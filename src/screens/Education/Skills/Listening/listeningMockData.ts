import { ListeningPracticeQuestion } from '../../types';

/**
 * Tạo dữ liệu câu hỏi luyện nghe demo cho 4 loại:
 * 1. IMAGE_SELECT  - Chọn ảnh
 * 2. VOCAB_SELECT  - Chọn từ vựng
 * 3. TRUE_FALSE    - Đúng/Sai
 * 4. GROUP_SELECT  - Chọn từ nhóm ảnh
 */
export const generateListeningQuestions = (
  hskLevel: number,
  topic: string,
): ListeningPracticeQuestion[] => {
  const questions: ListeningPracticeQuestion[] = [];

  const tom = require('@/theme/assets/images/tom.png');
  const student = require('@/theme/assets/images/student.png');

  // --- 5 câu IMAGE_SELECT (1-5) ---
  for (let i = 1; i <= 5; i++) {
    questions.push({
      id: `lp_img_${i}`,
      index: i,
      type: 'IMAGE_SELECT',
      correctOptionId: 'A',
      options: [
        { id: 'A', label: 'A', imageUrl: student },
        { id: 'B', label: 'B', imageUrl: tom },
        { id: 'C', label: 'C', imageUrl: student },
      ],
    });
  }

  // --- 5 câu VOCAB_SELECT (6-10) ---
  const vocabPairs = [
    [
      { id: 'A', label: 'A', text: '后天', pinyin: 'hòutiān' },
      { id: 'B', label: 'B', text: '下个星期', pinyin: 'xià gè xīngqī' },
      { id: 'C', label: 'C', text: '下个月', pinyin: 'xià gè yuè' },
    ],
    [
      { id: 'A', label: 'A', text: '小学', pinyin: 'xiǎoxué' },
      { id: 'B', label: 'B', text: '中学', pinyin: 'zhōngxué' },
      { id: 'C', label: 'C', text: '大学', pinyin: 'dàxué' },
    ],
    [
      { id: 'A', label: 'A', text: '苹果', pinyin: 'píngguǒ' },
      { id: 'B', label: 'B', text: '香蕉', pinyin: 'xiāngjiāo' },
      { id: 'C', label: 'C', text: '西瓜', pinyin: 'xīguā' },
    ],
    [
      { id: 'A', label: 'A', text: '爸爸', pinyin: 'bàba' },
      { id: 'B', label: 'B', text: '妈妈', pinyin: 'māma' },
      { id: 'C', label: 'C', text: '哥哥', pinyin: 'gēge' },
    ],
    [
      { id: 'A', label: 'A', text: '公共汽车', pinyin: 'gōnggòng qìchē' },
      { id: 'B', label: 'B', text: '地铁', pinyin: 'dìtiě' },
      { id: 'C', label: 'C', text: '出租车', pinyin: 'chūzūchē' },
    ],
  ];

  for (let i = 0; i < 5; i++) {
    questions.push({
      id: `lp_vocab_${i + 6}`,
      index: i + 6,
      type: 'VOCAB_SELECT',
      correctOptionId: 'B',
      options: vocabPairs[i],
    });
  }

  // --- 5 câu TRUE_FALSE (11-15) ---
  const trueFalseSentences = [
    '现在老师帮女儿穿衣服。',
    '弟弟正在看电视。',
    '他们在图书馆学习。',
    '她喜欢喝咖啡。',
    '今天天气很好。',
  ];

  for (let i = 0; i < 5; i++) {
    questions.push({
      id: `lp_tf_${i + 11}`,
      index: i + 11,
      type: 'TRUE_FALSE',
      starred: true,
      sentence: trueFalseSentences[i],
      correctOptionId: 'opt_true',
      options: [
        { id: 'opt_true', label: '✓', text: '对' },
        { id: 'opt_false', label: '×', text: '错' },
      ],
    });
  }

  // --- 5 câu GROUP_SELECT (16-20) ---
  const groupImages = [
    { id: 'GA', label: 'A', imageUrl: student },
    { id: 'GB', label: 'B', imageUrl: tom },
    { id: 'GC', label: 'C', imageUrl: student },
    { id: 'GD', label: 'D', imageUrl: tom },
    { id: 'GE', label: 'E', imageUrl: student },
    { id: 'GF', label: 'F', imageUrl: tom },
  ];

  const dialogues = [
    '男：喂，请问张经理在吗？\n女：他正在开会，您半个小时以后再打，好吗？',
    '男：你好，我想订一张明天去上海的机票。\n女：好的，请问您要经济舱还是商务舱？',
    '男：这件衣服多少钱？\n女：这件打八折，原价是两百块。',
    '男：请问，图书馆怎么走？\n女：往前走，过了那个红绿灯就到了。',
    '男：你最近身体怎么样？\n女：还好，就是最近睡眠不太好。',
  ];

  for (let i = 0; i < 5; i++) {
    questions.push({
      id: `lp_group_${i + 16}`,
      index: i + 16,
      type: 'GROUP_SELECT',
      groupImages: i === 0 ? groupImages : undefined, // chỉ nhóm đầu mới có ảnh nhóm chia sẻ
      dialogue: dialogues[i],
      correctOptionId: 'OPT_D',
      options: [
        { id: 'OPT_A', label: 'A' },
        { id: 'OPT_B', label: 'B' },
        { id: 'OPT_C', label: 'C' },
        { id: 'OPT_D', label: 'D' },
        { id: 'OPT_E', label: 'E' },
        { id: 'OPT_F', label: 'F' },
      ],
    });
  }

  return questions;
};
