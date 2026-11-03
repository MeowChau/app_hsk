import { QuestionAudioPlayer } from '../../components/QuestionAudioPlayer';
import { PracticeBookmarkButton } from '../../components/PracticeBookmarkButton';
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ListeningPracticeQuestion, ListeningPracticeOption } from '../../types';
import { ms, hs, vs } from '@/theme';
import { ReadingPracticeImage } from '../Reading/ReadingPracticeImage';

interface Props {
  question: ListeningPracticeQuestion;
  showAudio?: boolean;
  selectedOptionId?: string;
  onSelectOption: (questionId: string, optionId: string) => void;
  bookmarked?: boolean;
  onToggleBookmark: (questionId: string) => void;
}

// ============================================================
// Audio Row - dùng chung cho tất cả loại
// Shared tracks live in the pinned section header; this row keeps the question number/flag.
// ============================================================
const AudioRow = ({ question, bookmarked, onToggleBookmark, showAudio }: {
  question: ListeningPracticeQuestion;
  bookmarked?: boolean;
  onToggleBookmark: (id: string) => void;
  showAudio: boolean;
}) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: vs(12) }}>
      <View style={{ width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginRight: 4 }}>
        <Text style={{ color: '#374151', fontWeight: '800', fontSize: ms(14) }}>{question.index}</Text>
      </View>
      {showAudio ? <QuestionAudioPlayer url={question.audioUrl} label={`câu ${question.index}`} /> : <View style={{ flex: 1 }} />}
      <PracticeBookmarkButton index={question.index} selected={bookmarked} onPress={() => onToggleBookmark(question.id)} />
    </View>
  );
};

// ============================================================
// LOẠI 1: Nghe chọn ảnh (IMAGE_SELECT)
// ============================================================
const ImageSelectOptions = ({ question, selectedOptionId, onSelectOption }: any) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(10) }}>
    {question.options.map((opt: ListeningPracticeOption) => {
      const isSelected = selectedOptionId === opt.id;
      return (
        <View
          key={opt.id}
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
          {opt.imageUrl ? (
            <ReadingPracticeImage uri={opt.imageUrl} showHint={false} accessibilityLabel={`Phóng to ảnh đáp án ${opt.label} câu ${question.index}`} style={{ margin: ms(8) }} />
          ) : null}
          <TouchableOpacity
            onPress={() => onSelectOption(question.id, opt.id)}
            accessibilityRole="radio"
            accessibilityLabel={`Đáp án ${opt.label} câu ${question.index}`}
            accessibilityState={{ checked: isSelected }}
            style={{ minHeight: ms(44), padding: ms(8), flexDirection: 'row', alignItems: 'center', gap: ms(8) }}
          >
            <View style={{
              width: ms(24), height: ms(24), borderRadius: ms(12),
              backgroundColor: isSelected ? '#1E3A8A' : '#F3F4F6',
              borderWidth: isSelected ? 0 : 1, borderColor: '#E5E7EB',
              justifyContent: 'center', alignItems: 'center',
            }}>
              <Text style={{ color: isSelected ? '#FFFFFF' : '#4B5563', fontWeight: '700', fontSize: ms(13) }}>{opt.label}</Text>
            </View>
            <Text style={{ color: '#1E3A8A', fontSize: ms(13) }}>{opt.text || 'Chọn đáp án'}</Text>
          </TouchableOpacity>
        </View>
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
              <Svg height={ms(13)} viewBox="0 0 24 24" width={ms(13)}>
                <Path d="M20 6L9 17l-5-5" fill="none" stroke={isSelected ? '#FFFFFF' : '#9CA3AF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            ) : (
              <Svg height={ms(13)} viewBox="0 0 24 24" width={ms(13)}>
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
export const ListeningQuestionCard = memo(({ question, selectedOptionId, onSelectOption, bookmarked, onToggleBookmark, showAudio = true }: Props) => {
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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(8) }}>
          {question.groupImages.map((img: ListeningPracticeOption) => (
            <View key={img.id} style={{ width: '30%', alignItems: 'center' }}>
              <Text style={{ fontSize: ms(10), fontWeight: '700', color: '#4B5563', marginBottom: vs(2) }}>{img.label}</Text>
              {img.imageUrl ? (
                <ReadingPracticeImage uri={img.imageUrl} showHint={false} accessibilityLabel={`Phóng to ảnh ${img.label}`} />
              ) : (
                <View style={{ width: '100%', height: vs(52), backgroundColor: '#F3F4F6', borderRadius: ms(4) }} />
              )}
            </View>
          ))}
        </View>
      )}

      <AudioRow question={question} bookmarked={bookmarked} onToggleBookmark={onToggleBookmark} showAudio={showAudio} />

      {question.instruction && question.type !== 'TRUE_FALSE' ? (
        <Text style={{ fontSize: ms(14), color: '#111827', fontWeight: '600', lineHeight: vs(22), marginBottom: vs(8) }}>
          {question.instruction}
        </Text>
      ) : null}
      {question.sharedAudio && showAudio ? (
        <Text style={{ fontSize: ms(12), color: '#6B7280', lineHeight: vs(18) }}>Audio dùng chung cho các mục trong phần bài tập.</Text>
      ) : null}
      {question.imageUrl ? <ReadingPracticeImage key={question.imageUrl} uri={question.imageUrl} /> : null}

      {question.type === 'LISTEN_REPEAT' ? (
        <View style={{ gap: vs(12) }}>
          <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(22) }}>Nghe audio, đọc lại theo hình rồi đánh dấu khi đã luyện xong.</Text>
          <TouchableOpacity
            accessibilityRole="checkbox"
            accessibilityLabel={`Đã luyện xong mục ${question.index}`}
            accessibilityState={{ checked: Boolean(selectedOptionId) }}
            onPress={() => onSelectOption(question.id, selectedOptionId ? '' : 'completed')}
            style={{ minHeight: vs(44), borderWidth: 1, borderColor: selectedOptionId ? '#1E3A8A' : '#D1D5DB', borderRadius: ms(12), padding: ms(12), backgroundColor: selectedOptionId ? '#EFF6FF' : '#FFFFFF' }}
          >
            <Text style={{ fontSize: ms(14), color: selectedOptionId ? '#1E3A8A' : '#374151', fontWeight: '600' }}>{selectedOptionId ? '✓ Đã luyện xong' : 'Đánh dấu đã luyện xong'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {question.type === 'DICTATION' ? (
        <View style={{ gap: vs(8) }}>
          <Text style={{ fontSize: ms(14), color: '#374151', fontWeight: '600' }}>Câu trả lời của bạn</Text>
          {question.inputHint ? <Text style={{ fontSize: ms(12), color: '#6B7280', lineHeight: vs(18) }}>{question.inputHint}</Text> : null}
          <TextInput
            accessibilityLabel={`Câu trả lời bài nghe ${question.index}`}
            multiline
            textAlignVertical="top"
            value={selectedOptionId || ''}
            onChangeText={value => onSelectOption(question.id, value)}
            placeholder="Ghi câu trả lời theo thứ tự các mục trong hình…"
            placeholderTextColor="#6B7280"
            autoCorrect={false}
            autoCapitalize="none"
            style={{ minHeight: vs(100), borderWidth: 1, borderColor: '#D1D5DB', borderRadius: ms(12), padding: ms(12), color: '#111827', fontSize: ms(15), lineHeight: vs(22), backgroundColor: '#FFFFFF' }}
          />
        </View>
      ) : null}

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
