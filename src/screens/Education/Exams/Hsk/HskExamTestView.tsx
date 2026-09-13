import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { BackButton } from '@/components/atoms';
import { ALL_HSK_EXAMS } from '../../mockData';
import { HskExamQuestionCard } from './HskExamQuestionCard';
import { ms, hs, vs } from '@/theme';
import { SubmitConfirmModal, QuestionGridModal, QuestionGridSection } from '@/screens/Education/components';

interface Props {
  examId: string;
  durationMin: number;
  onBack: () => void;
  onSubmit?: (result: any) => void;
  isReviewMode?: boolean;
  reviewAnswers?: Record<string, string>;
}

const ExamTimer = ({ durationMin }: { durationMin: number }) => {
  const [timeLeft, setTimeLeft] = useState(durationMin * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  
  return (
    <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#111827' }}>
      {`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`}
    </Text>
  );
};

export const HskExamTestView = ({ examId, durationMin, onBack, onSubmit, isReviewMode, reviewAnswers }: Props) => {
  // Find exam data
  const examLevel = parseInt(examId.match(/hsk(\d)/)?.[1] || '1');
  const fullExam = ALL_HSK_EXAMS[examLevel]?.find(e => e.id === examId);
  const questions = fullExam?.questions || [];

  const [answers, setAnswers] = useState<Record<string, string>>(reviewAnswers || {});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  
  const [showGridModal, setShowGridModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  
  const flatListRef = React.useRef<FlatList>(null);

  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentQuestionId(viewableItems[0].item?.id || null);
    }
  }).current;
  const viewabilityConfig = React.useRef({ itemVisiblePercentThreshold: 50 }).current;

  const handleSelectOption = useCallback((questionId: string, optionId: string) => {
    if (isReviewMode) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  }, [isReviewMode]);

  const handleToggleBookmark = useCallback((questionId: string) => {
    setBookmarks(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  }, []);

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    if (!onSubmit) return;
    
    let correct = 0;
    let listCorrect = 0;
    let readCorrect = 0;

    questions.forEach(q => {
      if (answers[q.id] === q.correctOptionId) {
        correct++;
        if (q.type === 'LISTENING') listCorrect++;
        else readCorrect++;
      }
    });

    const result = {
      examId,
      score: Math.round((correct / questions.length) * 100),
      correctCount: correct,
      totalCount: questions.length,
      listeningCorrect: listCorrect,
      readingCorrect: readCorrect,
      date: new Date().toLocaleDateString('vi-VN'),
      answers,
    };
    
    onSubmit(result);
  };

  const handleGridPress = (qId: string) => {
    const dataIndex = questions.findIndex(q => q.id === qId);
    if (dataIndex >= 0) {
      flatListRef.current?.scrollToIndex({ index: dataIndex, animated: true });
      setShowGridModal(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const remainingCount = totalCount - answeredCount;

  const gridSections = useMemo((): QuestionGridSection[] => {
    const mapQuestion = (q: typeof questions[0]) => {
      const isAnswered = !!answers[q.id];
      const isBookmarked = !!bookmarks[q.id];
      const isCurrent = q.id === currentQuestionId;
      let isCorrect: boolean | undefined = undefined;
      if (isReviewMode && isAnswered) {
        isCorrect = answers[q.id] === q.correctOptionId;
      }
      return {
        id: q.id,
        index: q.index,
        isAnswered,
        isBookmarked,
        isCurrent,
        isCorrect,
      };
    };

    return [
      {
        key: 'listening',
        title: 'Nghe',
        items: questions.filter(q => q.type === 'LISTENING').map(mapQuestion),
      },
      {
        key: 'reading',
        title: 'Đọc',
        items: questions.filter(q => q.type === 'READING').map(mapQuestion),
      },
    ];
  }, [questions, answers, bookmarks, currentQuestionId, isReviewMode]);

  const handleExitPress = () => {
    if (isReviewMode) {
      onBack();
      return;
    }
    Alert.alert(
      'Thoát bài thi HSK',
      'Bạn có chắc chắn muốn thoát? Kết quả làm bài hiện tại sẽ không được lưu.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Thoát', style: 'destructive', onPress: onBack },
      ]
    );
  };

  const renderItem = useCallback(({ item }: any) => (
    <HskExamQuestionCard
      question={item}
      selectedOptionId={answers[item.id]}
      onSelectOption={handleSelectOption}
      bookmarked={bookmarks[item.id]}
      onToggleBookmark={handleToggleBookmark}
      isReviewMode={isReviewMode}
    />
  ), [answers, bookmarks, handleSelectOption, handleToggleBookmark, isReviewMode]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: hs(16), paddingTop: vs(8), paddingBottom: vs(12), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <BackButton onPress={handleExitPress} style={{ marginRight: hs(8), marginLeft: hs(-6) }} />
          <View>
            <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827' }}>
              HSK {examLevel}
            </Text>
            <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>
              {answeredCount}/{totalCount} số lượng câu
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(12) }}>
          {!isReviewMode && (
            <View style={{ backgroundColor: '#F3F4F6', borderRadius: ms(4), paddingHorizontal: hs(8), paddingVertical: vs(4) }}>
              <ExamTimer durationMin={durationMin} />
            </View>
          )}
          <TouchableOpacity onPress={() => setShowGridModal(true)}>
            <Svg height="24" viewBox="0 0 24 24" width="24">
              <Rect x="3" y="3" width="7" height="7" rx="1" fill="none" stroke="#4B5563" strokeWidth="2" />
              <Rect x="14" y="3" width="7" height="7" rx="1" fill="none" stroke="#4B5563" strokeWidth="2" />
              <Rect x="3" y="14" width="7" height="7" rx="1" fill="none" stroke="#4B5563" strokeWidth="2" />
              <Rect x="14" y="14" width="7" height="7" rx="1" fill="none" stroke="#4B5563" strokeWidth="2" />
            </Svg>
          </TouchableOpacity>
          {isReviewMode ? (
            <TouchableOpacity onPress={onBack} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(6), paddingHorizontal: hs(14), paddingVertical: vs(7) }}>
              <Text style={{ color: '#FFFFFF', fontSize: ms(14), fontWeight: '700' }}>Về kết quả</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setShowSubmitModal(true)} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(6), paddingHorizontal: hs(14), paddingVertical: vs(7) }}>
              <Text style={{ color: '#FFFFFF', fontSize: ms(14), fontWeight: '700' }}>Nộp bài</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Content */}
      <FlatList
        ref={flatListRef}
        data={questions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: ms(16) }}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={renderItem}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          });
        }}
        ListFooterComponent={
          <View style={{ backgroundColor: '#FAF9F6', borderRadius: ms(12), padding: ms(24), alignItems: 'center', marginTop: vs(8), marginBottom: vs(24) }}>
            {isReviewMode ? (
              <>
                <Text style={{ fontSize: ms(14), color: '#6B7280', fontWeight: '500', marginBottom: vs(16) }}>
                  Đúng <Text style={{ fontWeight: '800', color: '#111827' }}>{Object.entries(answers).filter(([qId, optId]) => {
                    const q = questions.find(qq => qq.id === qId);
                    return q && optId === q.correctOptionId;
                  }).length}</Text>/{totalCount} câu.
                </Text>
                <TouchableOpacity onPress={onBack} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(8), paddingVertical: vs(12), paddingHorizontal: hs(36) }}>
                  <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Về trang kết quả</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={{ fontSize: ms(14), color: '#6B7280', marginBottom: vs(16), fontWeight: '500' }}>
                  Đã trả lời <Text style={{ fontWeight: '800', color: '#111827' }}>{answeredCount}</Text>/{totalCount} câu. Còn {remainingCount} chưa trả lời
                </Text>
                <TouchableOpacity onPress={() => setShowSubmitModal(true)} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(8), paddingVertical: vs(12), paddingHorizontal: hs(36) }}>
                  <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Nộp bài</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
      />

      {/* Grid Modal */}
      <QuestionGridModal
        visible={showGridModal}
        onClose={() => setShowGridModal(false)}
        subtitle="Câu hỏi"
        sections={gridSections}
        isReviewMode={isReviewMode}
        onSelectItem={(item) => handleGridPress(String(item.id))}
      />

      {/* Submit Confirm Modal */}
      <SubmitConfirmModal
        visible={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
        remainingCount={remainingCount}
      />
    </SafeAreaView>
  );
};
