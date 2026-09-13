import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
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
              {selectedOptionId ? (
                selectedOptionId === question.correctOptionId ? (
                  <>
                    <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginRight: hs(4) }}>
                      <Circle cx="12" cy="12" r="10" fill="none" stroke="#22C55E" strokeWidth="2" />
                      <Path d="M8 12l3 3 5-5" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ fontSize: ms(14), color: '#22C55E', fontWeight: '700' }}>Đúng</Text>
                  </>
                ) : (
                  <>
                    <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginRight: hs(4) }}>
                      <Circle cx="12" cy="12" r="10" fill="none" stroke="#EF4444" strokeWidth="2" />
                      <Path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ fontSize: ms(14), color: '#EF4444', fontWeight: '700' }}>Sai</Text>
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
            <TouchableOpacity style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(12), paddingHorizontal: hs(8), paddingVertical: vs(2) }}>
              <Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '600' }}>-5s</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Svg height="24" viewBox="0 0 24 24" width="24">
                <Circle cx="12" cy="12" r="12" fill="#1E3A8A" />
                <Path d="M10 8l6 4-6 4V8z" fill="#FFFFFF" />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(12), paddingHorizontal: hs(8), paddingVertical: vs(2) }}>
              <Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '600' }}>+5s</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: ms(14), color: '#6B7280', fontWeight: '500' }}>0:00</Text>
        </View>
      )}

      {/* Question Image */}
      {question.imageUrl && (
        <Image source={question.imageUrl} style={{ width: hs(120), height: vs(120), borderRadius: ms(8), marginBottom: vs(16), alignSelf: question.type === 'LISTENING' ? 'flex-start' : 'center' }} resizeMode="cover" />
      )}

      {/* Options */}
      <View style={{ gap: vs(8) }}>
        {question.options.map((opt) => {
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
              
              {opt.imageUrl && <Image source={opt.imageUrl} style={{ width: hs(80), height: vs(80), borderRadius: ms(8), marginLeft: hs(8) }} resizeMode="contain" />}

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
  return prev.question.id === next.question.id &&
         prev.selectedOptionId === next.selectedOptionId &&
         prev.bookmarked === next.bookmarked &&
         prev.isReviewMode === next.isReviewMode;
});
