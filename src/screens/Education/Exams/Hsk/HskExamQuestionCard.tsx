import { QuestionAudioPlayer } from '../../components/QuestionAudioPlayer';
import { PracticeBookmarkButton } from '../../components/PracticeBookmarkButton';
import { ReadingPracticeImage } from '../../Skills/Reading/ReadingPracticeImage';
import { hasExamAnswer, isExamAnswerCorrect } from '@/services/exams/answers';
import React, { memo } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { ExamQuestion } from '../../types';
import { ms, hs, vs } from '@/theme';

interface Props {
  question: ExamQuestion;
  showAudio?: boolean;
  selectedOptionId?: string;
  onSelectOption: (questionId: string, optionId: string) => void;
  bookmarked?: boolean;
  onToggleBookmark: (questionId: string) => void;
  isReviewMode?: boolean;
}

export const HskExamQuestionCard = memo(({ question, selectedOptionId, onSelectOption, bookmarked, onToggleBookmark, isReviewMode, showAudio = true }: Props) => {
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
              {question.requiresManualReview ? <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '700' }}>Tự đối chiếu</Text> : hasExamAnswer(selectedOptionId) ? (
                isExamAnswerCorrect(question, selectedOptionId) ? (
                  <>
                    <Svg height={ms(16)} viewBox="0 0 24 24" width={ms(16)} style={{ marginRight: hs(4) }}>
                      <Circle cx="12" cy="12" r="10" fill="none" stroke="#22C55E" strokeWidth="2" />
                      <Path d="M8 12l3 3 5-5" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ fontSize: ms(14), color: '#22C55E', fontWeight: '700' }}>{question.type === 'WRITING' ? 'Khớp đáp án mẫu' : 'Đúng'}</Text>
                  </>
                ) : (
                  <>
                    <Svg height={ms(16)} viewBox="0 0 24 24" width={ms(16)} style={{ marginRight: hs(4) }}>
                      <Circle cx="12" cy="12" r="10" fill="none" stroke="#EF4444" strokeWidth="2" />
                      <Path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ fontSize: ms(14), color: '#EF4444', fontWeight: '700' }}>{question.type === 'WRITING' ? 'Chưa khớp đáp án mẫu' : 'Sai'}</Text>
                  </>
                )
              ) : (
                <>
                  <Svg height={ms(16)} viewBox="0 0 24 24" width={ms(16)} style={{ marginRight: hs(4) }}>
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
              <PracticeBookmarkButton index={question.index} selected={bookmarked} onPress={() => onToggleBookmark(question.id)} />
            </>
          )}
        </View>
      </View>

      {question.type === 'LISTENING' && showAudio && (
        <View style={{ marginBottom: vs(16) }}>
          <QuestionAudioPlayer url={question.audioUrl} label={`câu ${question.index}`} seekable />
        </View>
      )}

      {/* Question Image */}
      {question.imageUrl && (
        <ReadingPracticeImage key={question.imageUrl} uri={question.imageUrl} />
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
              <Text style={{ fontSize: ms(12), color: '#4B5563' }}>{question.requiresManualReview ? 'Câu này cần tự đối chiếu, không tính vào điểm chấm tự động.' : 'Phần Viết được đối chiếu với đáp án mẫu, bỏ qua khoảng trắng và dấu câu cuối. Câu khác đáp án mẫu chưa được chấm theo ý nghĩa.'}</Text>
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
            <View
              key={opt.id}
              style={{
                borderWidth: 1.5,
                borderColor,
                backgroundColor: bgColor,
                borderRadius: ms(8),
              }}
            >
              {opt.imageUrl ? <ReadingPracticeImage uri={opt.imageUrl} showHint={false} accessibilityLabel={`Phóng to ảnh đáp án ${opt.label || ''} câu ${question.index}`} style={{ margin: ms(12) }} /> : null}
              <TouchableOpacity
                disabled={isReviewMode}
                onPress={() => onSelectOption(question.id, opt.id)}
                activeOpacity={isReviewMode ? 1 : 0.7}
                accessibilityRole="radio"
                accessibilityLabel={`Đáp án ${opt.label || opt.text || ''} câu ${question.index}`}
                accessibilityState={{ checked: isSelected, disabled: isReviewMode }}
                style={{ flexDirection: 'row', alignItems: 'center', padding: ms(12), minHeight: ms(44) }}
              >
              {opt.label ? (
                <View style={{ width: ms(24), height: ms(24), borderRadius: ms(12), backgroundColor: (!isReviewMode && isSelected) ? '#1E3A8A' : (isReviewMode ? bgColor : '#F3F4F6'), borderWidth: isReviewMode ? 1.5 : 0, borderColor: isReviewMode ? iconColor : 'transparent', justifyContent: 'center', alignItems: 'center', marginRight: hs(12) }}>
                  <Text style={{ color: (!isReviewMode && isSelected) ? '#FFFFFF' : iconColor, fontWeight: '700', fontSize: ms(14) }}>{opt.label}</Text>
                </View>
              ) : (
                <View style={{ width: ms(24), height: ms(24), borderRadius: ms(12), borderWidth: 1.5, borderColor: (!isReviewMode && isSelected) ? '#1E3A8A' : (isReviewMode ? iconColor : '#D1D5DB'), backgroundColor: (!isReviewMode && isSelected) ? '#1E3A8A' : '#FFFFFF', justifyContent: 'center', alignItems: 'center', marginRight: hs(12) }}>
                  {isSelected && !isReviewMode && <Svg height={ms(14)} viewBox="0 0 24 24" width={ms(14)}><Path d="M20 6L9 17l-5-5" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></Svg>}
                  {isReviewMode && isCorrectAnswer && <Svg height={ms(14)} viewBox="0 0 24 24" width={ms(14)}><Path d="M20 6L9 17l-5-5" fill="none" stroke={iconColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></Svg>}
                  {isReviewMode && isSelected && !isCorrectAnswer && <Svg height={ms(14)} viewBox="0 0 24 24" width={ms(14)}><Path d="M18 6L6 18M6 6l12 12" fill="none" stroke={iconColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></Svg>}
                </View>
              )}
              {opt.text && <Text style={{ fontSize: ms(16), color: textColor, fontWeight: '600', flex: 1 }}>{opt.text}</Text>}
              

              {isReviewMode && isCorrectAnswer && (
                 <Text style={{ fontSize: ms(14), color: '#15803D', fontWeight: '700', marginLeft: 'auto', paddingLeft: hs(8) }}>Đáp án đúng</Text>
              )}
              </TouchableOpacity>
            </View>
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
