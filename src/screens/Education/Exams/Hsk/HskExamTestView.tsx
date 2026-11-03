// @refresh reset
import { PracticeHeader } from '../../components/PracticeHeader';
import { SharedAudioHeader, SharedAudioEnd } from '../../components/SharedAudioHeader';
import { buildSharedAudioRows, audioStickyHeaderIndices } from '../../components/sharedAudioRows';
import type { SharedAudioRow } from '../../components/sharedAudioRows';
import { useAudioListScroll } from '../../components/useAudioListScroll';
import { useStudyTimer } from '@/hooks/useStudyTimer';
import { useScreenBackHandler } from '@/navigation/useScreenBackHandler';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { AppAlert } from '@/services/feedback/appAlert';
import { hasExamAnswer, hasExamAnswerKey, isExamAnswerCorrect } from '@/services/exams/answers';
import { HskExamQuestionCard } from './HskExamQuestionCard';
import { ms, hs, vs, useTheme } from '@/theme';
import { SubmitConfirmModal, QuestionGridModal, QuestionGridSection } from '@/screens/Education/components';

interface Props {
  examId: string;
  durationMin: number;
  onBack: () => void;
  onSubmit?: (result: any) => void;
  isReviewMode?: boolean;
  reviewAnswers?: Record<string, string>;
  reviewQuestions?: ExamQuestion[];
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
    <Text style={{ fontSize: ms(14), fontWeight: '700', fontVariant: ['tabular-nums'], color: '#111827' }}>
      {`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`}
    </Text>
  );
};

import { ActivityIndicator } from 'react-native';
import { examsApi, ExamResponseMismatchError } from '@/services/exams/api';
import { transformBackendExamToApp } from '@/services/exams/transformers';
import { HskExam, ExamQuestion } from '../../types';

export const HskExamTestView = ({ examId, durationMin, onBack, onSubmit, isReviewMode, reviewAnswers, reviewQuestions }: Props) => {
  const { colors } = useTheme();
  const [fullExam, setFullExam] = useState<HskExam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const onBackRef = React.useRef(onBack);
  onBackRef.current = onBack;

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
          AppAlert.warning('Đề thi chưa được hỗ trợ', examApp.unsupportedSkills?.length ? 'Đề này có kỹ năng Nói mà giao diện hiện tại chưa hỗ trợ.' : 'Đề thi chưa có câu hỏi.', [{ text: 'OK', onPress: () => onBackRef.current() }]);
          setFullExam(null);
          return;
        }
        const hasGradedReview = reviewQuestions?.length && reviewQuestions.every(question => question.requiresManualReview || hasExamAnswerKey(question));
        setFullExam(isReviewMode && hasGradedReview ? { ...examApp, questions: reviewQuestions } : examApp);
        setAnswers(reviewAnswers || {});
        setBookmarks({});
      } catch (err) {
        if (!cancelled) { setFullExam(null); AppAlert.error('Không thể tải đề thi', err instanceof ExamResponseMismatchError ? err.message : 'Vui lòng kiểm tra kết nối.', [{ text: 'OK', onPress: () => onBackRef.current() }]); }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchExam();
    return () => { cancelled = true; };
  }, [examId, isReviewMode, reviewQuestions, reviewAnswers]);

  const studyTimer = useStudyTimer(!isLoading && !isReviewMode && (fullExam?.questions?.length ?? 0) > 0, 'hsk_exam');
  const questions = useMemo(() => fullExam?.questions || [], [fullExam]);
  const questionRows = useMemo(() => buildSharedAudioRows(questions, question => question.type === 'LISTENING'), [questions]);
  const stickyHeaders = useMemo(() => audioStickyHeaderIndices(questionRows), [questionRows]);
  const { listRef: flatListRef, scrollToQuestion, rememberHeaderHeight, onScrollToIndexFailed } = useAudioListScroll(questionRows);

  const [answers, setAnswers] = useState<Record<string, string>>(reviewAnswers || {});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  
  const [showGridModal, setShowGridModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  

  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const firstQuestion = viewableItems.find((item: any) => item.item.kind === 'question');
      if (firstQuestion) setCurrentQuestionId(firstQuestion.item.question.id);
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
    const gradedQuestions = questions.filter(question => !question.requiresManualReview);
    if (gradedQuestions.some(question => !hasExamAnswerKey(question))) {
      AppAlert.error('Chưa chấm được bài thi', 'Đề thi chưa có đủ đáp án để chấm. Bài làm vẫn được giữ; bạn có thể thử nộp lại.');
      return;
    }
    
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
      score: gradedQuestions.length ? Math.round((correct / gradedQuestions.length) * 100) : null,
      gradedCount: gradedQuestions.length,
      manualCount: questions.length - gradedQuestions.length,
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
    const dataIndex = questionRows.findIndex(row => row.kind === 'question' && row.question.id === qId);
    const row = questionRows[dataIndex];
    scrollToQuestion(dataIndex, row?.kind === 'question' ? row.sharedAudioHeaderId : undefined);
    setShowGridModal(false);
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
      if (isReviewMode && isAnswered && !q.requiresManualReview) {
        isCorrect = isExamAnswerCorrect(q, answers[q.id]);
      }
      return {
        id: q.id,
        index: q.index,
        isAnswered,
        isBookmarked,
        isCurrent,
        isCorrect,
        requiresManualReview: q.requiresManualReview,
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
    AppAlert.confirm(
      'Thoát bài thi HSK',
      'Bạn có chắc chắn muốn thoát? Kết quả làm bài hiện tại sẽ không được lưu.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Thoát', style: 'destructive', onPress: onBack },
      ]
    );
  };

  useScreenBackHandler(() => {
    if (isLoading || questions.length === 0) onBack();
    else handleExitPress();
    return true;
  });

  const renderItem = useCallback(({ item }: { item: SharedAudioRow<ExamQuestion> }) => {
    if (item.kind === 'audio_header') return <SharedAudioHeader url={item.audioUrl} label={item.label} onHeight={height => rememberHeaderHeight(item.id, height)} />;
    if (item.kind === 'audio_end') return <SharedAudioEnd />;
    return <HskExamQuestionCard
      question={item.question}
      showAudio={!item.sharedAudioHeaderId}
      selectedOptionId={answers[item.question.id]}
      onSelectOption={handleSelectOption}
      bookmarked={bookmarks[item.question.id]}
      onToggleBookmark={handleToggleBookmark}
      isReviewMode={isReviewMode}
    />;
  }, [answers, bookmarks, handleSelectOption, handleToggleBookmark, isReviewMode, rememberHeaderHeight]);

  if (isLoading) {
    return (
      <SafeAreaView onTouchStart={studyTimer.markActivity} onTouchMove={studyTimer.markActivity} style={{ flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView onTouchStart={studyTimer.markActivity} onTouchMove={studyTimer.markActivity} style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <PracticeHeader
        title={`HSK ${examLevel}`}
        subtitle={`${answeredCount}/${totalCount} số lượng câu`}
        onBack={handleExitPress}
        onOpenGrid={() => { Keyboard.dismiss(); setShowGridModal(true); }}
        onSubmit={isReviewMode ? onBack : () => setShowSubmitModal(true)}
        submitLabel={isReviewMode ? 'Về kết quả' : 'Nộp bài'}
        timer={!isReviewMode ? <ExamTimer durationMin={durationMin} /> : undefined}
      />

      {/* Main Content */}
      <FlatList
        ref={flatListRef}
        data={questionRows}
        keyExtractor={(item) => item.id}
        stickyHeaderIndices={stickyHeaders}
        removeClippedSubviews={false}
        contentContainerStyle={{ padding: ms(16) }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={renderItem}
        onScrollToIndexFailed={onScrollToIndexFailed}
        ListFooterComponent={
          <View style={{ backgroundColor: colors.surface, borderRadius: ms(12), padding: ms(24), alignItems: 'center', marginTop: vs(8), marginBottom: vs(24) }}>
            {isReviewMode ? (
              <>
                <Text style={{ fontSize: ms(14), color: '#6B7280', fontWeight: '500', marginBottom: vs(16) }}>
                  Đúng <Text style={{ fontWeight: '800', color: '#111827' }}>{questions.filter(q => isExamAnswerCorrect(q, answers[q.id])).length}</Text>/{questions.filter(q => !q.requiresManualReview).length} câu chấm tự động.
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
