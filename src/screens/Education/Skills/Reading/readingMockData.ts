import { ReadingPracticeQuestion } from '../../types';

export const generateReadingQuestions = (hskLevel: string, topic: string): ReadingPracticeQuestion[] => {
  return [
    // TRUE / FALSE
    {
      id: 'r_tf_21',
      index: 21,
      type: 'TRUE_FALSE',
      pinyin: 'shuǐ',
      character: '水',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/114/114963.png', // Mock image
      options: [
        { id: 'T', label: 'T', text: '对' },
        { id: 'F', label: 'F', text: '错' },
      ],
      correctOptionId: 'T',
    },
    {
      id: 'r_tf_22',
      index: 22,
      type: 'TRUE_FALSE',
      pinyin: 'dú',
      character: '读',
      imageUrl: 'https://cdn-icons-png.flaticon.com/512/3048/3048509.png', // Mock image
      options: [
        { id: 'T', label: 'T', text: '对' },
        { id: 'F', label: 'F', text: '错' },
      ],
      correctOptionId: 'T',
    },
    // GROUP IMAGE
    {
      id: 'r_gi_26',
      index: 26,
      type: 'GROUP_IMAGE',
      sentence: 'Zhèxiē dōu shì Zhāng xiǎojiě de.\n这些都是张小姐的。',
      groupImages: [
        { id: 'A', label: 'A', imageUrl: 'https://cdn-icons-png.flaticon.com/512/2806/2806148.png' },
        { id: 'B', label: 'B', imageUrl: 'https://cdn-icons-png.flaticon.com/512/3358/3358055.png' },
        { id: 'C', label: 'C', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1000/1000854.png' },
        { id: 'D', label: 'D', imageUrl: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png' },
        { id: 'E', label: 'E', imageUrl: 'https://cdn-icons-png.flaticon.com/512/1984/1984180.png' },
        { id: 'F', label: 'F', imageUrl: 'https://cdn-icons-png.flaticon.com/512/3048/3048509.png' },
      ],
      example: {
        sentence: '例如 Wǒ hěn xǐhuan zhè běn shū.\n我很喜欢这本书。',
        answer: 'E',
      },
      options: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' },
        { id: 'D', label: 'D' },
        { id: 'E', label: 'E' },
        { id: 'F', label: 'F' },
      ],
      correctOptionId: 'A',
    },
    {
      id: 'r_gi_27',
      index: 27,
      type: 'GROUP_IMAGE',
      sentence: 'Méi guānxi, bú huì zuò méi guānxi.\n没关系，不会做没关系。',
      options: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' },
        { id: 'D', label: 'D' },
        { id: 'E', label: 'E' },
        { id: 'F', label: 'F' },
      ],
      correctOptionId: 'B',
    },
    // GROUP VOCAB
    {
      id: 'r_gv_36',
      index: 36,
      type: 'GROUP_VOCAB',
      sentence: '我(wǒ) 在(zài) 中国(Zhōngguó) （  ）了(le) 4年(nián) 了(le)。',
      groupVocabs: [
        { id: 'A', label: 'A', text: '能 (néng)' },
        { id: 'B', label: 'B', text: '住 (zhù)' },
        { id: 'C', label: 'C', text: '认识 (rènshi)' },
        { id: 'D', label: 'D', text: '名字 (míngzi)' },
        { id: 'E', label: 'E', text: '坐 (zuò)' },
        { id: 'F', label: 'F', text: '谢谢 (xièxie)' },
      ],
      example: {
        sentence: '例如 你(nǐ) 叫(jiào) 什么(shénme) ( D ) ?',
        answer: 'D',
      },
      options: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' },
        { id: 'D', label: 'D' },
        { id: 'E', label: 'E' },
        { id: 'F', label: 'F' },
      ],
      correctOptionId: 'B',
    },
    {
      id: 'r_gv_37',
      index: 37,
      type: 'GROUP_VOCAB',
      sentence: '爸爸(Bàba)，下雨(xiàyǔ) 了(le)，我们(wǒmen) 怎么(zěnme) 回家(huíjiā)？ （  ） 出租车(chūzūchē) 吗(ma)？',
      options: [
        { id: 'A', label: 'A' },
        { id: 'B', label: 'B' },
        { id: 'C', label: 'C' },
        { id: 'D', label: 'D' },
        { id: 'E', label: 'E' },
        { id: 'F', label: 'F' },
      ],
      correctOptionId: 'E',
    },
    // MULTIPLE CHOICE
    {
      id: 'r_mc_61',
      index: 61,
      type: 'MULTIPLE_CHOICE',
      sentence: '中国人经常说：早饭要吃好，午饭要吃饱，晚饭要吃少。\n★ 根据这句话，可以知道：',
      options: [
        { id: 'A', label: 'A', text: '早饭要少吃' },
        { id: 'B', label: 'B', text: '午饭要多吃' },
        { id: 'C', label: 'C', text: '不要吃晚饭' },
      ],
      correctOptionId: 'B',
    },
    {
      id: 'r_mc_62',
      index: 62,
      type: 'MULTIPLE_CHOICE',
      sentence: '公司来了一位新同事，长得跟我有点儿像，而且我们都姓王，很多人总是笑着问我：“新来的同事是不是你哥哥？”\n★ 新来的同事：',
      options: [
        { id: 'A', label: 'A', text: '是我哥' },
        { id: 'B', label: 'B', text: '长得像我' },
        { id: 'C', label: 'C', text: '长得像我弟弟' },
      ],
      correctOptionId: 'B',
    },
  ];
};
