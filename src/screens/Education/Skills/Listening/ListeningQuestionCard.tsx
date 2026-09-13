import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ListeningPracticeQuestion, ListeningPracticeOption } from '../../types';
import { ms, hs, vs } from '@/theme';

interface Props {
  question: ListeningPracticeQuestion;
  selectedOptionId?: string;
  onSelectOption: (questionId: string, optionId: string) => void;
  bookmarked?: boolean;
  onToggleBookmark: (questionId: string) => void;
}

// ============================================================
// Audio Row - dùng chung cho tất cả loại
// Layout: [index] [🔊] [▶ 0:00/0:00 ——————] [🔉] [⋮] [🚩]
// ============================================================
const AudioRow = ({ question, bookmarked, onToggleBookmark }: {
  question: ListeningPracticeQuestion;
  bookmarked?: boolean;
  onToggleBookmark: (id: string) => void;
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(12) }}>
    {/* Index badge - grey circle, left */}
    <View style={{ width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginRight: hs(8) }}>
      <Text style={{ color: '#374151', fontWeight: '800', fontSize: ms(14) }}>{question.index}</Text>
    </View>

    {/* Spacer */}
    <View style={{ flex: 1 }} />

    {/* Audio controls - right side */}
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(6) }}>
      {/* Volume icon */}
      <Svg height="16" viewBox="0 0 24 24" width="16">
        <Path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>

      {/* Play button */}
      <TouchableOpacity>
        <Svg height="12" viewBox="0 0 24 24" width="12">
          <Path d="M5 3l14 9-14 9V3z" fill="#374151" />
        </Svg>
      </TouchableOpacity>

      {/* Time */}
      <Text style={{ fontSize: ms(13), color: '#9CA3AF' }}>0:00 / 0:00</Text>

      {/* Progress bar */}
      <View style={{ width: hs(60), height: vs(3), backgroundColor: '#D1D5DB', borderRadius: ms(2) }}>
        <View style={{ width: '0%', height: '100%', backgroundColor: '#374151', borderRadius: ms(2) }} />
      </View>

      {/* Volume small */}
      <Svg height="13" viewBox="0 0 24 24" width="13">
        <Path d="M11 5L6 9H2v6h4l5 4V5z" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
      </Svg>

      {/* Three dots */}
      <TouchableOpacity>
        <Svg height="14" viewBox="0 0 24 24" width="14">
          <Path d="M12 5v.01M12 12v.01M12 19v.01" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      </TouchableOpacity>

      {/* Bookmark - flag icon */}
      <TouchableOpacity onPress={() => onToggleBookmark(question.id)} style={{ padding: ms(2) }}>
        <Svg height="16" viewBox="0 0 24 24" width="16">
          <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"
            fill={bookmarked ? '#D97706' : 'none'}
            stroke={bookmarked ? '#D97706' : '#9CA3AF'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      </TouchableOpacity>
    </View>
  </View>
);

// ============================================================
// LOẠI 1: Nghe chọn ảnh (IMAGE_SELECT)
// ============================================================
const ImageSelectOptions = ({ question, selectedOptionId, onSelectOption }: any) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(10) }}>
    {question.options.map((opt: ListeningPracticeOption) => {
      const isSelected = selectedOptionId === opt.id;
      return (
        <TouchableOpacity
          key={opt.id}
          onPress={() => onSelectOption(question.id, opt.id)}
          activeOpacity={0.8}
          style={{
            width: '48%',
            borderWidth: 1,
            borderColor: isSelected ? '#1E3A8A' : '#E5E7EB',
            borderRadius: ms(10),
            backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
            overflow: 'hidden',
            minHeight: vs(100),
          }}
        >
          {/* Label tag - top left corner */}
          <View style={{ position: 'absolute', top: ms(8), left: ms(8), zIndex: 1 }}>
            <View style={{
              width: ms(24), height: ms(24), borderRadius: ms(12),
              backgroundColor: isSelected ? '#1E3A8A' : '#F3F4F6',
              borderWidth: isSelected ? 0 : 1, borderColor: '#E5E7EB',
              justifyContent: 'center', alignItems: 'center',
            }}>
              <Text style={{ color: isSelected ? '#FFFFFF' : '#4B5563', fontWeight: '700', fontSize: ms(13) }}>{opt.label}</Text>
            </View>
          </View>
          {/* Image fills card */}
          {opt.imageUrl ? (
            <Image
              source={opt.imageUrl}
              style={{ width: '100%', height: vs(110) }}
              resizeMode="contain"
            />
          ) : (
            <View style={{ height: vs(110), justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#9CA3AF', fontSize: ms(12) }}>Ảnh</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    })}
  </View>
);

// ============================================================
// LOẠI 2: Nghe chọn từ vựng (VOCAB_SELECT)
// ============================================================
const VocabSelectOptions = ({ question, selectedOptionId, onSelectOption }: any) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(8) }}>
    {question.options.map((opt: ListeningPracticeOption) => {
      const isSelected = selectedOptionId === opt.id;
      return (
        <TouchableOpacity
          key={opt.id}
          onPress={() => onSelectOption(question.id, opt.id)}
          style={{
            width: '48%',
            borderWidth: 1.5,
            borderColor: isSelected ? '#1E3A8A' : '#E5E7EB',
            borderRadius: ms(8),
            backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
            padding: ms(12),
            minHeight: vs(60),
            justifyContent: 'flex-start',
          }}
        >
          <Text style={{ fontSize: ms(13), color: '#9CA3AF', fontWeight: '600', marginBottom: vs(2) }}>{opt.label}</Text>
          {opt.pinyin && (
            <Text style={{ fontSize: ms(13), color: '#9CA3AF', marginBottom: vs(2) }}>{opt.pinyin}</Text>
          )}
          <Text style={{ fontSize: ms(18), color: isSelected ? '#1E3A8A' : '#111827', fontWeight: '600' }}>{opt.text}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ============================================================
// LOẠI 3: True/False (TRUE_FALSE)
// ============================================================
const TrueFalseOptions = ({ question, selectedOptionId, onSelectOption }: any) => (
  <View style={{ gap: vs(8) }}>
    {question.options.map((opt: ListeningPracticeOption) => {
      const isSelected = selectedOptionId === opt.id;
      const isTrue = opt.text === '对';
      const selectedColor = isTrue ? '#22C55E' : '#EF4444';
      return (
        <TouchableOpacity
          key={opt.id}
          onPress={() => onSelectOption(question.id, opt.id)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: isSelected ? selectedColor : '#E5E7EB',
            borderRadius: ms(8),
            paddingVertical: vs(10),
            paddingHorizontal: hs(16),
            backgroundColor: isSelected ? (isTrue ? '#F0FDF4' : '#FEF2F2') : '#FFFFFF',
            gap: hs(12),
          }}
        >
          {/* Checkbox */}
          <View style={{
            width: ms(26), height: ms(26), borderRadius: ms(4),
            borderWidth: 1.5,
            borderColor: isSelected ? selectedColor : '#D1D5DB',
            backgroundColor: isSelected ? selectedColor : 'transparent',
            justifyContent: 'center', alignItems: 'center',
          }}>
            {isTrue ? (
              <Svg height="13" viewBox="0 0 24 24" width="13">
                <Path d="M20 6L9 17l-5-5" fill="none" stroke={isSelected ? '#FFFFFF' : '#9CA3AF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            ) : (
              <Svg height="13" viewBox="0 0 24 24" width="13">
                <Path d="M18 6L6 18M6 6l12 12" fill="none" stroke={isSelected ? '#FFFFFF' : '#9CA3AF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            )}
          </View>
          <Text style={{ fontSize: ms(16), fontWeight: '700', color: isSelected ? (isTrue ? '#15803D' : '#B91C1C') : '#374151' }}>
            {opt.text}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ============================================================
// LOẠI 4: Chọn từ nhóm ảnh (GROUP_SELECT)
// ============================================================
const GroupSelectOptions = ({ question, selectedOptionId, onSelectOption }: any) => {
  const allLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  return (
    <View>
      {/* Dialogue box */}
      {question.dialogue && (
        <View style={{ backgroundColor: '#F9F5EB', borderRadius: ms(8), padding: ms(10), marginBottom: vs(10), flexDirection: 'row', alignItems: 'flex-start', gap: hs(8) }}>
          <View style={{ backgroundColor: '#6B7280', borderRadius: ms(4), paddingHorizontal: hs(6), paddingVertical: vs(2) }}>
            <Text style={{ color: '#FFFFFF', fontSize: ms(12), fontWeight: '700' }}>问</Text>
          </View>
          <Text style={{ flex: 1, fontSize: ms(14), color: '#374151', lineHeight: vs(22) }}>{question.dialogue}</Text>
        </View>
      )}

      {/* Letter buttons row */}
      <View style={{ flexDirection: 'row', gap: hs(8), flexWrap: 'wrap' }}>
        {allLetters.map(letter => {
          const opt = question.options.find((o: ListeningPracticeOption) => o.label === letter);
          if (!opt) return null;
          const isSelected = selectedOptionId === opt.id;
          return (
            <TouchableOpacity
              key={letter}
              onPress={() => onSelectOption(question.id, opt.id)}
              style={{
                width: ms(38), height: ms(38),
                borderRadius: ms(19),
                backgroundColor: isSelected ? '#1E3A8A' : '#E5E7EB',
                justifyContent: 'center', alignItems: 'center',
              }}
            >
              <Text style={{ color: isSelected ? '#FFFFFF' : '#4B5563', fontWeight: '700', fontSize: ms(15) }}>{letter}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ============================================================
// MAIN CARD COMPONENT
// ============================================================
export const ListeningQuestionCard = memo(({ question, selectedOptionId, onSelectOption, bookmarked, onToggleBookmark }: Props) => {
  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      borderRadius: ms(10),
      borderWidth: 1,
      borderColor: '#E5E7EB',
      padding: ms(14),
      marginBottom: vs(14),
    }}>

      {/* Group images (chỉ loại GROUP_SELECT có groupImages) */}
      {question.type === 'GROUP_SELECT' && question.groupImages && (
        <View style={{ flexDirection: 'row', gap: ms(4), marginBottom: vs(8) }}>
          {question.groupImages.map((img: ListeningPracticeOption) => (
            <View key={img.id} style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: ms(10), fontWeight: '700', color: '#4B5563', marginBottom: vs(2) }}>{img.label}</Text>
              {img.imageUrl ? (
                <Image source={img.imageUrl} style={{ width: '100%', height: vs(52), borderRadius: ms(4) }} resizeMode="cover" />
              ) : (
                <View style={{ width: '100%', height: vs(52), backgroundColor: '#F3F4F6', borderRadius: ms(4) }} />
              )}
            </View>
          ))}
        </View>
      )}

      {/* Audio Row: [index] [🔊 ▶ 0:00/0:00 ——] [🔉] [⋮] [🚩] */}
      <AudioRow question={question} bookmarked={bookmarked} onToggleBookmark={onToggleBookmark} />

      {/* True/False sentence - hiển thị sau audio row */}
      {question.type === 'TRUE_FALSE' && question.sentence && (
        <Text style={{ fontSize: ms(15), color: '#111827', fontWeight: '500', marginBottom: vs(12) }}>
          {question.starred ? '★ ' : ''}{question.sentence}
        </Text>
      )}

      {/* Options */}
      {question.type === 'IMAGE_SELECT' && (
        <ImageSelectOptions question={question} selectedOptionId={selectedOptionId} onSelectOption={onSelectOption} />
      )}
      {question.type === 'VOCAB_SELECT' && (
        <VocabSelectOptions question={question} selectedOptionId={selectedOptionId} onSelectOption={onSelectOption} />
      )}
      {question.type === 'TRUE_FALSE' && (
        <TrueFalseOptions question={question} selectedOptionId={selectedOptionId} onSelectOption={onSelectOption} />
      )}
      {question.type === 'GROUP_SELECT' && (
        <GroupSelectOptions question={question} selectedOptionId={selectedOptionId} onSelectOption={onSelectOption} />
      )}
    </View>
  );
});
