export interface WritingPracticeTopic {
  id: string;
  title: string;
  wordCount: number;
}

export interface WritingPracticeWord {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
}

export const WRITING_PRACTICE_TOPICS: Record<number, WritingPracticeTopic[]> = {
  1: [
    { id: 'hsk1_topic1', title: 'Đại từ nhân xưng', wordCount: 5 },
    { id: 'hsk1_topic2', title: 'Số đếm cơ bản', wordCount: 10 },
    { id: 'hsk1_topic3', title: 'Giao tiếp hàng ngày', wordCount: 8 },
  ],
  2: [
    { id: 'hsk2_topic1', title: 'Du lịch và phương hướng', wordCount: 12 },
    { id: 'hsk2_topic2', title: 'Mua sắm', wordCount: 15 },
  ],
  // Thêm các cấp độ khác nếu cần
};

export const generateWritingWords = (level: number, topicId: string): WritingPracticeWord[] => {
  // Dữ liệu giả lập cho phần luyện viết, tuỳ thuộc vào topic
  if (topicId === 'hsk1_topic1') {
    return [
      { id: 'w1', character: '我', pinyin: 'wǒ', meaning: 'Tôi' },
      { id: 'w2', character: '你', pinyin: 'nǐ', meaning: 'Bạn' },
      { id: 'w3', character: '他', pinyin: 'tā', meaning: 'Anh ấy' },
      { id: 'w4', character: '她', pinyin: 'tā', meaning: 'Cô ấy' },
      { id: 'w5', character: '们', pinyin: 'men', meaning: 'Hậu tố số nhiều' },
    ];
  }
  
  if (topicId === 'hsk1_topic2') {
    return [
      { id: 'w6', character: '一', pinyin: 'yī', meaning: 'Một' },
      { id: 'w7', character: '二', pinyin: 'èr', meaning: 'Hai' },
      { id: 'w8', character: '三', pinyin: 'sān', meaning: 'Ba' },
      { id: 'w9', character: '四', pinyin: 'sì', meaning: 'Bốn' },
      { id: 'w10', character: '五', pinyin: 'wǔ', meaning: 'Năm' },
      { id: 'w11', character: '六', pinyin: 'liù', meaning: 'Sáu' },
      { id: 'w12', character: '七', pinyin: 'qī', meaning: 'Bảy' },
      { id: 'w13', character: '八', pinyin: 'bā', meaning: 'Tám' },
      { id: 'w14', character: '九', pinyin: 'jiǔ', meaning: 'Chín' },
      { id: 'w15', character: '十', pinyin: 'shí', meaning: 'Mười' },
    ];
  }

  // Default fallback
  return [
    { id: 'w_df1', character: '好', pinyin: 'hǎo', meaning: 'Tốt, khoẻ' },
    { id: 'w_df2', character: '是', pinyin: 'shì', meaning: 'Là' },
    { id: 'w_df3', character: '人', pinyin: 'rén', meaning: 'Người' },
  ];
};
