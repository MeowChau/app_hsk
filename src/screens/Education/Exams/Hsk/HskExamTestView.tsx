import { useStudyTimer } from '@/hooks/useStudyTimer';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { hasExamAnswer, isExamAnswerCorrect } from '@/services/exams/answers';
import Svg, { Rect } from 'react-native-svg';
import { BackButton } from '@/components/atoms';
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

import { ActivityIndicator } from 'react-native';
import { examsApi, ExamResponseMismatchError } from '@/services/exams/api';
import { transformBackendExamToApp } from '@/services/exams/transformers';
import { HskExam } from '../../types';

export const HskExamTestView = ({ examId, durationMin, onBack, onSubmit, isReviewMode, reviewAnswers }: Props) => {
  const [fullExam, setFullExam] = useState<HskExam | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const examLevel = fullExam?.level || 1;

  useEffect(() => {
    let cancelled = false;
    const fetchExam = async () => {
      try {
        setIsLoading(true);
        const res = await examsApi.getExamById(Number(examId));
        const examApp = transformBackendExamToApp(res);
        if (cancelled) return;
        if (examApp.unsupportedSkills?.length || !examApp.questions?.length) {
          Alert.alert('Đề thi chưa được hỗ trợ', examApp.unsupportedSkills?.length ? 'Đề này có kỹ năng Nói mà giao diện hiện tại chưa hỗ trợ.' : 'Đề thi chưa có câu hỏi.', [{ text: 'OK', onPress: onBack }]);
          setFullExam(null);
          return;
        }
        setFullExam(examApp);
        setAnswers(reviewAnswers || {});
        setBookmarks({});
      } catch (err) {
        if (!cancelled) { setFullExam(null); Alert.alert('Không thể tải đề thi', err instanceof ExamResponseMismatchError ? err.message : 'Vui lòng kiểm tra kết nối.', [{ text: 'OK', onPress: onBack }]); }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchExam();
    return () => { cancelled = true; };
  }, [examId]);

  const studyTimer = useStudyTimer(!isLoading && !isReviewMode && (fullExam?.questions?.length ?? 0) > 0);
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
    if (!onSubmit || !questions.length) return;
    
    let correct = 0;
    let listCorrect = 0;
    let readCorrect = 0;
    let writeCorrect = 0;

    questions.forEach(q => {
      if (isExamAnswerCorrect(q, answers[q.id])) {
        correct++;
        if (q.type === 'LISTENING') listCorrect++;
        else if (q.type === 'READING') readCorrect++;
        else writeCorrect++;
      }
    });

    const result = {
      examId,
      score: Math.round((correct / questions.length) * 100),
      correctCount: correct,
      totalCount: questions.length,
      listeningCorrect: listCorrect,
      readingCorrect: readCorrect,
      writingCorrect: writeCorrect,
      date: new Date().toLocaleDateString('vi-VN'),
      answers,
      questions,
      durationInSeconds: studyTimer.takeSeconds(),
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

  const answeredCount = questions.filter(q => hasExamAnswer(answers[q.id])).length;
  const totalCount = questions.length;
  const remainingCount = totalCount - answeredCount;

  const gridSections = useMemo((): QuestionGridSection[] => {
    const mapQuestion = (q: typeof questions[0]) => {
      const isAnswered = hasExamAnswer(answers[q.id]);
      const isBookmarked = !!bookmarks[q.id];
      const isCurrent = q.id === currentQuestionId;
      let isCorrect: boolean | undefined = undefined;
      if (isReviewMode && isAnswered) {
        isCorrect = isExamAnswerCorrect(q, answers[q.id]);
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
      {
        key: 'writing',
        title: 'Viết',
        items: questions.filter(q => q.type === 'WRITING').map(mapQuestion),
      },
    ].filter(section => section.items.length > 0);
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

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
          <TouchableOpacity accessibilityLabel="Danh sách câu hỏi" onPress={() => { Keyboard.dismiss(); setShowGridModal(true); }}>
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
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={renderItem}
        onScrollToIndexFailed={(info) => {
          flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: false });
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
                  Đúng <Text style={{ fontWeight: '800', color: '#111827' }}>{questions.filter(q => isExamAnswerCorrect(q, answers[q.id])).length}</Text>/{totalCount} câu.
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
