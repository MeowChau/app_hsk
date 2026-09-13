import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, FlatList, BackHandler } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { ReadingPracticeQuestion } from '../../types';
import { generateReadingQuestions } from './readingMockData';
import { ms, hs, vs } from '@/theme';
import { SubmitConfirmModal, QuestionGridModal } from '@/screens/Education/components';

interface Props {
  hskLevel: number;
  topic: string;
  onBack: () => void;
  onSubmit?: (result: { score: number, correctCount: number, totalCount: number, answers: Record<string, string> }) => void;
}

import { Image } from 'react-native';

const ReadingQuestionCard = React.memo(({ question, selectedOptionId, onSelectOption, bookmarked, onToggleBookmark }: {
  question: ReadingPracticeQuestion;
  selectedOptionId?: string;
  onSelectOption: (qId: string, oId: string) => void;
  bookmarked?: boolean;
  onToggleBookmark: (qId: string) => void;
}) => {

  const renderFlag = () => (
    <TouchableOpacity onPress={() => onToggleBookmark(question.id)} style={{ padding: ms(2) }}>
      <Svg height="16" viewBox="0 0 24 24" width="16">
        <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"
          fill={bookmarked ? '#D97706' : 'none'}
          stroke={bookmarked ? '#D97706' : '#9CA3AF'}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </TouchableOpacity>
  );

  const renderNumber = (index: number) => (
    <View style={{ backgroundColor: '#E5E7EB', borderRadius: ms(12), width: ms(24), height: ms(24), justifyContent: 'center', alignItems: 'center', marginRight: hs(12) }}>
      <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#374151' }}>{index}</Text>
    </View>
  );

  const renderGroupHeader = () => {
    if (!question.groupImages && !question.groupVocabs) return null;
    return (
      <View style={{ marginBottom: vs(16) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(12) }}>
          <View style={{ width: 4, height: 16, backgroundColor: '#1E3A8A', marginRight: 8, borderRadius: 2 }} />
          <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827' }}>第 {question.index}-{question.index + 4} 题</Text>
        </View>

        {question.groupImages && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: hs(8), marginBottom: vs(16) }}>
            {question.groupImages.map(img => (
              <View key={img.id} style={{ width: '31%', aspectRatio: 1, backgroundColor: '#FFFFFF', borderRadius: ms(8), borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' }}>
                <View style={{ position: 'absolute', top: 4, left: 4, zIndex: 10, backgroundColor: '#1E3A8A', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#FFF', fontSize: 10, fontWeight: 'bold' }}>{img.label}</Text>
                </View>
                {img.imageUrl && <Image source={{ uri: img.imageUrl }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />}
              </View>
            ))}
          </View>
        )}

        {question.groupVocabs && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: hs(8), marginBottom: vs(16) }}>
            {question.groupVocabs.map(voc => (
              <View key={voc.id} style={{ width: '48%', backgroundColor: '#FFFFFF', borderRadius: ms(8), borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: vs(12), paddingHorizontal: hs(12), flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#1E3A8A', borderRadius: 12, width: 24, height: 24, justifyContent: 'center', alignItems: 'center', marginRight: hs(8) }}>
                  <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold' }}>{voc.label}</Text>
                </View>
                <Text style={{ fontSize: ms(14), color: '#374151', fontWeight: '500' }}>{voc.text}</Text>
              </View>
            ))}
          </View>
        )}

        {question.example && (
          <View style={{ backgroundColor: '#F3F4F6', borderRadius: ms(8), padding: ms(12), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ backgroundColor: '#E5E7EB', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginRight: 8, alignSelf: 'flex-start' }}>
                <Text style={{ fontSize: 10, color: '#6B7280', fontWeight: 'bold' }}>例如</Text>
              </View>
              <Text style={{ fontSize: ms(14), color: '#4B5563', flex: 1 }}>{question.example.sentence}</Text>
            </View>
            <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#1E3A8A', borderRadius: 6, width: 28, height: 28, justifyContent: 'center', alignItems: 'center', marginLeft: 12 }}>
              <Text style={{ color: '#1E3A8A', fontWeight: 'bold', fontSize: 14 }}>{question.example.answer}</Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderInlineOptions = () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: hs(8), marginTop: vs(16), marginLeft: hs(36) }}>
      {question.options.map(opt => {
        const isSelected = selectedOptionId === opt.id;
        const isExample = question.example && question.example.answer === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            disabled={isExample}
            onPress={() => onSelectOption(question.id, opt.id)}
            style={{
              width: ms(36), height: ms(36), borderRadius: ms(18),
              backgroundColor: isSelected ? '#1E3A8A' : '#FFFFFF',
              borderWidth: 1, borderColor: isSelected ? '#1E3A8A' : (isExample ? '#E5E7EB' : '#D1D5DB'),
              borderStyle: isExample ? 'dashed' : 'solid',
              justifyContent: 'center', alignItems: 'center',
            }}
          >
            <Text style={{ color: isSelected ? '#FFFFFF' : (isExample ? '#D1D5DB' : '#374151'), fontWeight: '700', fontSize: ms(14) }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View>
      {renderGroupHeader()}
      <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: ms(12),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: ms(16),
        marginBottom: vs(16),
      }}>
        {question.type === 'TRUE_FALSE' && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flexDirection: 'row' }}>
                {renderNumber(question.index)}
                <View>
                  <Text style={{ fontSize: ms(14), color: '#6B7280', marginBottom: 2 }}>{question.pinyin}</Text>
                  <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827' }}>{question.character}</Text>
                </View>
              </View>
              {renderFlag()}
            </View>
            <View style={{ flexDirection: 'row', marginTop: vs(12) }}>
              <View style={{ width: ms(100), height: ms(100), backgroundColor: '#FFFFFF', borderRadius: ms(8), borderWidth: 1, borderColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', padding: ms(8) }}>
                {question.imageUrl && <Image source={{ uri: question.imageUrl }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />}
              </View>
              <View style={{ flex: 1, marginLeft: hs(16), justifyContent: 'space-evenly' }}>
                {question.options.map(opt => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <TouchableOpacity key={opt.id} onPress={() => onSelectOption(question.id, opt.id)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF', borderWidth: 1, borderColor: isSelected ? '#1E3A8A' : '#E5E7EB', borderRadius: ms(8), paddingVertical: vs(8), paddingHorizontal: hs(12) }}>
                      <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: isSelected ? '#1E3A8A' : '#9CA3AF', justifyContent: 'center', alignItems: 'center', marginRight: hs(8), backgroundColor: isSelected ? '#1E3A8A' : 'transparent' }}>
                         {isSelected && <Svg width="12" height="12" viewBox="0 0 24 24"><Path d="M5 13l4 4L19 7" stroke="#FFFFFF" strokeWidth="3" fill="none" strokeLinecap="round" /></Svg>}
                      </View>
                      <Text style={{ fontSize: ms(14), color: isSelected ? '#1E3A8A' : '#4B5563', fontWeight: '500' }}>{opt.text}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {(question.type === 'GROUP_IMAGE' || question.type === 'GROUP_VOCAB') && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flexDirection: 'row', flex: 1, marginRight: hs(12) }}>
                {renderNumber(question.index)}
                <Text style={{ fontSize: ms(16), color: '#374151', lineHeight: vs(24), flex: 1 }}>{question.sentence}</Text>
              </View>
              {renderFlag()}
            </View>
            {renderInlineOptions()}
          </View>
        )}

        {(question.type === 'MULTIPLE_CHOICE' || question.type === 'FILL_BLANK' || question.type === 'MATCH_IMAGE') && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(16) }}>
              <View style={{ flexDirection: 'row', flex: 1, marginRight: hs(12) }}>
                {renderNumber(question.index)}
                <Text style={{ fontSize: ms(16), color: '#111827', fontWeight: '500', lineHeight: vs(24), flex: 1 }}>{question.sentence}</Text>
              </View>
              {renderFlag()}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: hs(8) }}>
              {question.options.map(opt => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <TouchableOpacity key={opt.id} onPress={() => onSelectOption(question.id, opt.id)} style={{ width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF', borderWidth: 1, borderColor: isSelected ? '#1E3A8A' : '#E5E7EB', borderRadius: ms(8), paddingVertical: vs(12), paddingHorizontal: hs(12), marginBottom: vs(8) }}>
                    <View style={{ width: ms(24), height: ms(24), borderRadius: ms(12), backgroundColor: isSelected ? '#1E3A8A' : '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: hs(8) }}>
                      <Text style={{ color: isSelected ? '#FFFFFF' : '#6B7280', fontWeight: '700', fontSize: ms(14) }}>{opt.label}</Text>
                    </View>
                    <Text style={{ flex: 1, fontSize: ms(14), color: isSelected ? '#1E3A8A' : '#4B5563', fontWeight: isSelected ? '700' : '500' }}>{opt.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </View>
  );
});

export const ReadingPracticeView = ({ hskLevel, topic, onBack, onSubmit }: Props) => {
  const questions = useMemo(() => generateReadingQuestions(hskLevel.toString(), topic), [hskLevel, topic]);
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const handleSelectOption = useCallback((questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  }, []);

  const handleToggleBookmark = useCallback((questionId: string) => {
    setBookmarks(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  }, []);

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctOptionId) correct++;
    });
    if (onSubmit) {
      onSubmit({ score: Math.round((correct / questions.length) * 100), correctCount: correct, totalCount: questions.length, answers });
    } else {
      onBack();
    }
  };

  const handleGridPress = useCallback((index: number) => {
    setShowGridModal(false);
    flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 });
  }, []);

  const handleExitPress = useCallback(() => {
    Alert.alert(
      'Thoát bài luyện tập',
      'Bạn có chắc chắn muốn thoát? Kết quả hiện tại sẽ không được lưu.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Thoát', style: 'destructive', onPress: onBack },
      ]
    );
  }, [onBack]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleExitPress();
      return true;
    });
    return () => backHandler.remove();
  }, [handleExitPress]);

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const remainingCount = totalCount - answeredCount;

  const gridItems = useMemo(() => questions.map((q, idx) => ({
    id: q.id,
    index: q.index,
    isAnswered: !!answers[q.id],
    isBookmarked: !!bookmarks[q.id],
    isCurrent: idx === currentIndex,
  })), [questions, answers, bookmarks, currentIndex]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      {/* Sticky Header */}
      <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: hs(16), paddingTop: vs(8), paddingBottom: vs(12), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={handleExitPress} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={{ marginRight: hs(8), padding: ms(8), marginLeft: hs(-6) }}>
            <Svg height="24" viewBox="0 0 24 24" width="24">
              <Path d="M20 12H4M10 18l-6-6 6-6" fill="none" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827' }} numberOfLines={1}>
              Luyện tập kỹ năng đọc
            </Text>
            <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>
              {answeredCount}/{totalCount} số lượng câu
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(12) }}>
          <TouchableOpacity onPress={() => setShowGridModal(true)}>
            <Svg height="24" viewBox="0 0 24 24" width="24">
              <Rect x="3" y="3" width="7" height="7" rx="1" fill="none" stroke="#4B5563" strokeWidth="2" />
              <Rect x="14" y="3" width="7" height="7" rx="1" fill="none" stroke="#4B5563" strokeWidth="2" />
              <Rect x="3" y="14" width="7" height="7" rx="1" fill="none" stroke="#4B5563" strokeWidth="2" />
              <Rect x="14" y="14" width="7" height="7" rx="1" fill="none" stroke="#4B5563" strokeWidth="2" />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSubmitModal(true)} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(6), paddingHorizontal: hs(14), paddingVertical: vs(7) }}>
            <Text style={{ color: '#FFFFFF', fontSize: ms(14), fontWeight: '700' }}>Nộp bài</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={questions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ReadingQuestionCard
            question={item}
            selectedOptionId={answers[item.id]}
            onSelectOption={handleSelectOption}
            bookmarked={bookmarks[item.id]}
            onToggleBookmark={handleToggleBookmark}
          />
        )}
        contentContainerStyle={{ padding: ms(16) }}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          }, 500);
        }}
        ListFooterComponent={
          <View style={{ backgroundColor: '#FAF9F6', borderRadius: ms(12), padding: ms(24), alignItems: 'center', marginTop: vs(8), marginBottom: vs(24) }}>
            <Text style={{ fontSize: ms(14), color: '#6B7280', marginBottom: vs(16), fontWeight: '500' }}>
              Đã trả lời <Text style={{ fontWeight: '800', color: '#111827' }}>{answeredCount}</Text>/{totalCount} câu. Còn {remainingCount} chưa trả lời
            </Text>
            <TouchableOpacity onPress={() => setShowSubmitModal(true)} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(8), paddingHorizontal: hs(32), paddingVertical: vs(12) }}>
              <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Nộp bài</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Submit Confirm Modal */}
      <SubmitConfirmModal
        visible={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
        remainingCount={remainingCount}
      />

      {/* Grid Modal */}
      <QuestionGridModal
        visible={showGridModal}
        onClose={() => setShowGridModal(false)}
        items={gridItems}
        onSelectItem={(_item, idx) => handleGridPress(idx)}
      />
    </SafeAreaView>
  );
};
