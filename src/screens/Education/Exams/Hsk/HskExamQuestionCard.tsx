import { useAudioPlayback, audioTime } from '@/services/audio/AudioProvider';
import { imageSource } from '@/services/media';
import { hasExamAnswer, isExamAnswerCorrect } from '@/services/exams/answers';
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { ExamQuestion } from '../../types';
import { ms, hs, vs } from '@/theme';

interface Props {
  question: ExamQuestion;
  selectedOptionId?: string;
  onSelectOption: (questionId: string, optionId: string) => void;
  bookmarked?: boolean;
  onToggleBookmark: (questionId: string) => void;
  isReviewMode?: boolean;
}

export const HskExamQuestionCard = memo(({ question, selectedOptionId, onSelectOption, bookmarked, onToggleBookmark, isReviewMode }: Props) => {
  const audio = useAudioPlayback(question.audioUrl);
  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      borderRadius: ms(8),
      borderWidth: 1,
      borderColor: '#E5E7EB',
      padding: ms(16),
      marginBottom: vs(16),
    }}>
      {/* Header Row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(16) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(12) }}>
          <View style={{ backgroundColor: '#DBEAFE', borderRadius: ms(12), paddingHorizontal: hs(10), paddingVertical: vs(4) }}>
            <Text style={{ color: '#1E3A8A', fontWeight: '800', fontSize: ms(16) }}>{question.index}</Text>
          </View>
          {isReviewMode && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {hasExamAnswer(selectedOptionId) ? (
                isExamAnswerCorrect(question, selectedOptionId) ? (
                  <>
                    <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginRight: hs(4) }}>
                      <Circle cx="12" cy="12" r="10" fill="none" stroke="#22C55E" strokeWidth="2" />
                      <Path d="M8 12l3 3 5-5" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ fontSize: ms(14), color: '#22C55E', fontWeight: '700' }}>{question.type === 'WRITING' ? 'Khớp đáp án mẫu' : 'Đúng'}</Text>
                  </>
                ) : (
                  <>
                    <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginRight: hs(4) }}>
                      <Circle cx="12" cy="12" r="10" fill="none" stroke="#EF4444" strokeWidth="2" />
                      <Path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ fontSize: ms(14), color: '#EF4444', fontWeight: '700' }}>{question.type === 'WRITING' ? 'Chưa khớp đáp án mẫu' : 'Sai'}</Text>
                  </>
                )
              ) : (
                <>
                  <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginRight: hs(4) }}>
                    <Circle cx="12" cy="12" r="10" fill="none" stroke="#EF4444" strokeWidth="2" />
                    <Path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <Text style={{ fontSize: ms(14), color: '#EF4444', fontWeight: '700' }}>Chưa trả lời</Text>
                </>
              )}
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', gap: hs(8) }}>
          {!isReviewMode && (
            <>
              <TouchableOpacity onPress={() => onToggleBookmark(question.id)} style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(8), padding: ms(6), backgroundColor: bookmarked ? '#FEF3C7' : '#FFFFFF' }}>
                <Svg height="16" viewBox="0 0 24 24" width="16">
                  <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" fill={bookmarked ? "#D97706" : "none"} stroke={bookmarked ? "#D97706" : "#6B7280"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Audio Player (If Listening) */}
      {question.type === 'LISTENING' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(16), justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}>
            <Svg height="16" viewBox="0 0 24 24" width="16">
              <Path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" fill="none" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <TouchableOpacity onPress={() => audio.seek(-5)} style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(12), paddingHorizontal: hs(8), paddingVertical: vs(2) }}>
              <Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '600' }}>-5s</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={audio.toggle}>
              <Svg height="24" viewBox="0 0 24 24" width="24">
                <Circle cx="12" cy="12" r="12" fill="#1E3A8A" />
                <Path d={audio.playing ? "M8 8h3v8H8zM13 8h3v8h-3z" : "M10 8l6 4-6 4V8z"} fill="#FFFFFF" />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => audio.seek(5)} style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(12), paddingHorizontal: hs(8), paddingVertical: vs(2) }}>
              <Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '600' }}>+5s</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: ms(14), color: '#6B7280', fontWeight: '500' }}>{audioTime(audio.position)}</Text>
        </View>
      )}

      {/* Question Image */}
      {question.imageUrl && (
        <Image source={imageSource(question.imageUrl)} style={{ width: hs(120), height: vs(120), borderRadius: ms(8), marginBottom: vs(16), alignSelf: question.type === 'LISTENING' ? 'flex-start' : 'center' }} resizeMode="cover" />
      )}

      {question.text ? <Text style={{ fontSize: ms(16), color: '#111827', marginBottom: vs(12) }}>{question.text}</Text> : null}

      {question.type === 'WRITING' && (
        <View style={{ gap: vs(12) }}>
          <Text style={{ fontSize: ms(16), fontWeight: '700', color: '#1E3A8A' }}>{question.writing?.instruction || 'Viết câu trả lời bằng chữ Hán'}</Text>
          {!!question.writing?.pinyin && <Text style={{ fontSize: ms(18), color: '#374151' }}>Phiên âm: {question.writing.pinyin}</Text>}
          {!!question.writing?.hint && <Text style={{ fontSize: ms(18), color: '#374151' }}>Gợi ý: {question.writing.hint}</Text>}
          {!!question.writing?.keyword && <Text style={{ fontSize: ms(18), color: '#374151' }}>Từ khóa: {question.writing.keyword}</Text>}
          {!!question.writing?.words.length && (
            <View style={{ gap: vs(8) }}>
              <Text style={{ fontSize: ms(14), color: '#6B7280' }}>Từ gợi ý{isReviewMode ? '' : ' (chạm để thêm)'}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(8) }}>
                {question.writing.words.map((word, index) => (
                  <TouchableOpacity key={`${index}-${word}`} disabled={isReviewMode} onPress={() => onSelectOption(question.id, `${selectedOptionId?.trim() ? `${selectedOptionId.trim()} ` : ''}${word}`)}
                    style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE', borderWidth: 1, paddingHorizontal: hs(12), paddingVertical: vs(8), borderRadius: ms(8) }}>
                    <Text style={{ fontSize: ms(18), color: '#1E3A8A' }}>{word}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          <Text style={{ fontSize: ms(14), color: '#374151', fontWeight: '600' }}>Câu trả lời của bạn</Text>
          {isReviewMode ? (
            <Text selectable style={{ fontSize: ms(20), color: '#111827', padding: ms(12), backgroundColor: '#F3F4F6', borderRadius: ms(8) }}>{hasExamAnswer(selectedOptionId) ? selectedOptionId : 'Chưa trả lời'}</Text>
          ) : (
            <TextInput
              accessibilityLabel={`Câu trả lời viết câu ${question.index}`}
              value={selectedOptionId || ''}
              onChangeText={text => onSelectOption(question.id, text)}
              placeholder="Nhập chữ Hán hoặc câu trả lời…"
              placeholderTextColor="#9CA3AF"
              multiline
              autoCorrect={false}
              autoCapitalize="none"
              textAlignVertical="top"
              style={{ minHeight: vs(100), fontSize: ms(20), color: '#111827', borderWidth: 1.5, borderColor: hasExamAnswer(selectedOptionId) ? '#1E3A8A' : '#D1D5DB', borderRadius: ms(8), padding: ms(12) }}
            />
          )}
          {isReviewMode && (
            <View style={{ backgroundColor: '#F0FDF4', padding: ms(12), borderRadius: ms(8), gap: vs(6) }}>
              <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#15803D' }}>Đáp án mẫu</Text>
              <Text selectable style={{ fontSize: ms(20), color: '#15803D' }}>{question.writing?.correctAnswers.join(' / ') || 'Chưa có đáp án mẫu'}</Text>
              <Text style={{ fontSize: ms(12), color: '#4B5563' }}>Phần Viết được đối chiếu với đáp án mẫu, bỏ qua khoảng trắng và dấu câu cuối. Câu khác đáp án mẫu chưa được chấm theo ý nghĩa.</Text>
            </View>
          )}
        </View>
      )}

      {/* Options */}
      <View style={{ gap: vs(8) }}>
        {(question.type === 'WRITING' ? [] : question.options).map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isCorrectAnswer = opt.id === question.correctOptionId;
          
          let borderColor = '#E5E7EB';
          let bgColor = '#FFFFFF';
          let iconColor = '#4B5563';
          let textColor = '#374151';

          if (isReviewMode) {
            if (isCorrectAnswer) {
              borderColor = '#22C55E'; // Green
              bgColor = '#F0FDF4';
              iconColor = '#22C55E';
              textColor = '#15803D';
            } else if (isSelected) {
              borderColor = '#EF4444'; // Red
              bgColor = '#FEF2F2';
              iconColor = '#EF4444';
              textColor = '#B91C1C';
            }
          } else {
            if (isSelected) {
              borderColor = '#1E3A8A';
              bgColor = '#EFF6FF';
              iconColor = '#FFFFFF';
              textColor = '#1E3A8A';
            }
          }

          return (
            <TouchableOpacity
              key={opt.id}
              disabled={isReviewMode}
              onPress={() => onSelectOption(question.id, opt.id)}
              activeOpacity={isReviewMode ? 1 : 0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1.5,
                borderColor,
                backgroundColor: bgColor,
                borderRadius: ms(8),
                padding: ms(12),
              }}
            >
              {opt.label ? (
                <View style={{ width: ms(24), height: ms(24), borderRadius: ms(12), backgroundColor: (!isReviewMode && isSelected) ? '#1E3A8A' : (isReviewMode ? bgColor : '#F3F4F6'), borderWidth: isReviewMode ? 1.5 : 0, borderColor: isReviewMode ? iconColor : 'transparent', justifyContent: 'center', alignItems: 'center', marginRight: hs(12) }}>
                  <Text style={{ color: (!isReviewMode && isSelected) ? '#FFFFFF' : iconColor, fontWeight: '700', fontSize: ms(14) }}>{opt.label}</Text>
                </View>
              ) : (
                <View style={{ width: ms(24), height: ms(24), borderRadius: ms(12), borderWidth: 1.5, borderColor: (!isReviewMode && isSelected) ? '#1E3A8A' : (isReviewMode ? iconColor : '#D1D5DB'), backgroundColor: (!isReviewMode && isSelected) ? '#1E3A8A' : '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginRight: hs(12) }}>
                  {isSelected && !isReviewMode && <Svg height="14" viewBox="0 0 24 24" width="14"><Path d="M20 6L9 17l-5-5" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></Svg>}
                  {isReviewMode && isCorrectAnswer && <Svg height="14" viewBox="0 0 24 24" width="14"><Path d="M20 6L9 17l-5-5" fill="none" stroke={iconColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></Svg>}
                  {isReviewMode && isSelected && !isCorrectAnswer && <Svg height="14" viewBox="0 0 24 24" width="14"><Path d="M18 6L6 18M6 6l12 12" fill="none" stroke={iconColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></Svg>}
                </View>
              )}
              {opt.text && <Text style={{ fontSize: ms(16), color: textColor, fontWeight: '600', flex: 1 }}>{opt.text}</Text>}
              
              {opt.imageUrl && <Image source={imageSource(opt.imageUrl)} style={{ width: hs(80), height: vs(80), borderRadius: ms(8), marginLeft: hs(8) }} resizeMode="contain" />}

              {isReviewMode && isCorrectAnswer && (
                 <Text style={{ fontSize: ms(14), color: '#15803D', fontWeight: '700', marginLeft: 'auto', paddingLeft: hs(8) }}>Đáp án đúng</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}, (prev, next) => {
  return prev.question === next.question &&
         prev.selectedOptionId === next.selectedOptionId &&
         prev.bookmarked === next.bookmarked &&
         prev.isReviewMode === next.isReviewMode &&
         prev.onSelectOption === next.onSelectOption &&
         prev.onToggleBookmark === next.onToggleBookmark;
});
