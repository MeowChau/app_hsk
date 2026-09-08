export interface BattleQuestion {
  id: number;
  hanzi: string;
  pinyin: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export const MOCK_QUESTIONS: BattleQuestion[] = [
  {
    id: 1,
    prompt: 'CÂU NÀY NGHĨA LÀ GÌ?',
    hanzi: '这是我最喜欢的颜色。',
    pinyin: 'zhè shì wǒ zuì xǐ huan de yán sè .',
    options: [
      'Tôi đã nhận được một món quà.',
      'Tôi ăn cơm.',
      'Đây là màu sắc tôi thích nhất.',
      'Cái này quá đắt.',
    ],
    correctIndex: 2,
  },
  {
    id: 2,
    prompt: 'CÂU NÀY NGHĨA LÀ GÌ?',
    hanzi: '今天下雨。',
    pinyin: 'jīn tiān xià yǔ .',
    options: [
      'Hôm nay trời mưa.',
      'Mẹ nấu ăn rất ngon.',
      'Trong vườn hoa có rất nhiều hoa.',
      'Tôi ăn cơm.',
    ],
    correctIndex: 0,
  },
  {
    id: 3,
    prompt: 'CHỌN TỪ THÍCH HỢP ĐIỀN VÀO CHỖ TRỐNG',
    hanzi: '很高兴___到你。',
    pinyin: 'hěn gāo xìng ___ dào nǐ .',
    options: [
      '听 (nghe)',
      '看 (nhìn / gặp)',
      '吃 (ăn)',
      '走 (đi)',
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    prompt: 'CÂU NÀY NGHĨA LÀ GÌ?',
    hanzi: '明天见！',
    pinyin: 'míng tiān jiàn !',
    options: [
      'Chào buổi sáng!',
      'Hẹn gặp lại ngày mai!',
      'Cảm ơn bạn nhiều.',
      'Chúc ngủ ngon.',
    ],
    correctIndex: 1,
  },
  {
    id: 5,
    prompt: 'CÂU NÀY NGHĨA LÀ GÌ?',
    hanzi: '你在做什么？',
    pinyin: 'nǐ zài zuò shén me ?',
    options: [
      'Bạn đang đi đâu đấy?',
      'Bạn đang làm gì vậy?',
      'Bạn tên là gì?',
      'Bao nhiêu tiền một cái?',
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    prompt: 'CÂU NÀY NGHĨA LÀ GÌ?',
    hanzi: '我想喝一杯水。',
    pinyin: 'wǒ xiǎng hē yì bēi shuǐ .',
    options: [
      'Tôi muốn ăn một bát cơm.',
      'Tôi muốn đi ngủ sớm.',
      'Tôi muốn uống một cốc nước.',
      'Trời hôm nay rất nóng.',
    ],
    correctIndex: 2,
  },
  {
    id: 7,
    prompt: 'CÂU NÀY NGHĨA LÀ GÌ?',
    hanzi: '这家饭馆的菜很好吃。',
    pinyin: 'zhè jiā fàn guǎn de cài hěn hǎo chī .',
    options: [
      'Món ăn của nhà hàng này rất ngon.',
      'Nhà hàng này mở cửa mấy giờ?',
      'Tôi thích đi du lịch Bắc Kinh.',
      'Hôm qua tôi đi mua sắm.',
    ],
    correctIndex: 0,
  },
  {
    id: 8,
    prompt: 'CÂU NÀY NGHĨA LÀ GÌ?',
    hanzi: '认识你我也很高兴。',
    pinyin: 'rèn shi nǐ wǒ yě hěn gāo xìng .',
    options: [
      'Rất vui được làm quen với bạn.',
      'Quen biết bạn tôi cũng rất vui.',
      'Hẹn gặp bạn tuần sau nhé.',
      'Bạn làm việc ở đâu?',
    ],
    correctIndex: 1,
  },
];
