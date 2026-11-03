// @refresh reset
import { PracticeHeader } from '../../components/PracticeHeader';
import { QuestionAudioPlayer } from '../../components/QuestionAudioPlayer';
import { PracticeBookmarkButton } from '../../components/PracticeBookmarkButton';
import { SharedAudioHeader, SharedAudioEnd } from '../../components/SharedAudioHeader';
import { buildSharedAudioRows, audioStickyHeaderIndices } from '../../components/sharedAudioRows';
import type { SharedAudioRow } from '../../components/sharedAudioRows';
import { useAudioListScroll } from '../../components/useAudioListScroll';
import { useStudyTimer } from '@/hooks/useStudyTimer';
import { useScreenBackHandler } from '@/navigation/useScreenBackHandler';
import React, { useState, useCallback, useMemo, memo, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { AppAlert } from '@/services/feedback/appAlert';
import { ListeningQuestionCard } from './ListeningQuestionCard';
import { ReadingPracticeImage } from '../Reading/ReadingPracticeImage';
import { ListeningPracticeQuestion, ListeningPracticeOption } from '../../types';
import { ms, hs, vs } from '@/theme';
import { SubmitConfirmModal, QuestionGridModal } from '@/screens/Education/components';

interface Props {
  hskLevel: number;
  practiceSetId: number;
  onBack: () => void;
  onSubmit?: (result: any) => void;
}

// ============================================================
// Group Header – hiển thị ảnh A-F + ví dụ 例如 cho loại GROUP_SELECT
// ============================================================
const GroupHeader = memo(({ images, exampleDialogue, exampleAnswer }: {
  images: ListeningPracticeOption[];
  exampleDialogue?: string;
  exampleAnswer?: string;
}) => (
  <View style={{ marginBottom: vs(12) }}>
    {/* Image row A-F */}
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(10) }}>
      {images.map((img) => (
        <View
          key={img.id}
          style={{
            width: '30%', backgroundColor: '#FFFFFF',
            borderRadius: ms(8), borderWidth: 1, borderColor: '#E5E7EB',
            alignItems: 'center', paddingTop: ms(4), paddingBottom: ms(4),
            overflow: 'hidden',
          }}
        >
          <Text style={{ fontSize: ms(10), fontWeight: '700', color: '#4B5563', marginBottom: vs(2) }}>{img.label}</Text>
          {img.imageUrl ? (
            <ReadingPracticeImage uri={img.imageUrl} showHint={false} accessibilityLabel={`Phóng to ảnh ${img.label}`} />
          ) : (
            <View style={{ width: '100%', height: vs(52), backgroundColor: '#F3F4F6' }} />
          )}
        </View>
      ))}
    </View>

    {/* 例如 box */}
    {exampleDialogue && (
      <View style={{
        backgroundColor: '#FFFFFF', borderRadius: ms(8),
        borderWidth: 1, borderColor: '#E5E7EB',
        padding: ms(12), flexDirection: 'row', alignItems: 'flex-start',
        gap: hs(10),
      }}>
        <View style={{ backgroundColor: '#9CA3AF', borderRadius: ms(4), paddingHorizontal: hs(6), paddingVertical: vs(2) }}>
          <Text style={{ color: '#FFFFFF', fontSize: ms(10), fontWeight: '700' }}>例如</Text>
        </View>
        <Text style={{ flex: 1, fontSize: ms(14), color: '#374151', lineHeight: vs(20) }}>{exampleDialogue}</Text>
        {exampleAnswer && (
          <View style={{
            width: ms(32), height: ms(32), borderRadius: ms(6),
            borderWidth: 1.5, borderColor: '#374151',
            justifyContent: 'center', alignItems: 'center',
            backgroundColor: '#FFFFFF',
          }}>
            <Text style={{ fontWeight: '700', color: '#374151', fontSize: ms(14) }}>{exampleAnswer}</Text>
          </View>
        )}
      </View>
    )}
  </View>
));

// ============================================================
// GROUP_SELECT individual question card (chỉ audio + A-F buttons)
// ============================================================
const GroupQuestionCard = memo(({ question, selectedOptionId, onSelectOption, bookmarked, onToggleBookmark, showAudio }: {
  question: ListeningPracticeQuestion;
  selectedOptionId?: string;
  onSelectOption: (qId: string, oId: string) => void;
  bookmarked?: boolean;
  onToggleBookmark: (qId: string) => void;
  showAudio: boolean;
}) => {
  const allLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      borderRadius: ms(10),
      borderWidth: 1,
      borderColor: '#E5E7EB',
      padding: ms(12),
      marginBottom: vs(10),
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: vs(10) }}>
        <View style={{ width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#374151', fontWeight: '800', fontSize: ms(14) }}>{question.index}</Text>
        </View>
        {showAudio ? <QuestionAudioPlayer url={question.audioUrl} label={`câu ${question.index}`} /> : <View style={{ flex: 1 }} />}
        <PracticeBookmarkButton index={question.index} selected={bookmarked} onPress={() => onToggleBookmark(question.id)} />
      </View>

      {/* A-F buttons */}
      {question.instruction ? <Text style={{ fontSize: ms(14), color: '#111827', lineHeight: vs(22), marginBottom: vs(8) }}>{question.instruction}</Text> : null}
      {question.imageUrl ? <ReadingPracticeImage key={question.imageUrl} uri={question.imageUrl} /> : null}
      <View style={{ flexDirection: 'row', gap: hs(8) }}>
        {allLetters.map(letter => {
          const opt = question.options.find(o => o.label === letter);
          if (!opt) return null;
          const isSelected = selectedOptionId === opt.id;
          return (
            <TouchableOpacity
              key={letter}
              onPress={() => onSelectOption(question.id, opt.id)}
              style={{
                width: ms(36), height: ms(36), borderRadius: ms(18),
                backgroundColor: isSelected ? '#1E3A8A' : '#FFFFFF',
                borderWidth: 1,
                borderColor: isSelected ? '#1E3A8A' : '#D1D5DB',
                justifyContent: 'center', alignItems: 'center',
              }}
            >
              <Text style={{ color: isSelected ? '#FFFFFF' : '#374151', fontWeight: '700', fontSize: ms(14) }}>{letter}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

// ============================================================
// Build flat data list with injected group headers
// ============================================================
type FlatItem =
  | { kind: 'group_header'; images: ListeningPracticeOption[]; exampleDialogue?: string; exampleAnswer?: string; id: string }
  | SharedAudioRow<ListeningPracticeQuestion>;

function buildFlatData(questions: ListeningPracticeQuestion[]): FlatItem[] {
  const items: FlatItem[] = [];
  let groupHeaderInserted = false;

  for (const row of buildSharedAudioRows(questions)) {
    if (row.kind !== 'question') {
      items.push(row);
      continue;
    }
    const q = row.question;
    if (q.type === 'GROUP_SELECT') {
      if (!groupHeaderInserted) {
        // First GROUP_SELECT question carries the groupImages
        const firstGroup = questions.find(x => x.type === 'GROUP_SELECT' && x.groupImages);
        if (firstGroup?.groupImages?.length) items.push({
          kind: 'group_header',
          id: 'group_header',
          images: firstGroup?.groupImages || [],
        });
        groupHeaderInserted = true;
      }
    }
    items.push(row);
  }
  return items;
}

// ============================================================
// MAIN VIEW
// ============================================================
import { educationApi } from '@/services/education/api';
import { transformQuestionToListening } from '@/services/education/transformers';

export const ListeningPracticeView = ({ hskLevel, practiceSetId, onBack, onSubmit }: Props) => {
  const [questions, setQuestions] = useState<ListeningPracticeQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const set = await educationApi.getPracticeSetById(practiceSetId);
        if (set.id !== practiceSetId || set.skill !== 'LISTENING' || set.hskLevel !== hskLevel) {
          throw new Error('The selected set is not a listening set for this HSK level.');
        }
        const links = [...(set.practiceSetQuestions ?? [])].sort((left, right) => left.order - right.order);
        if (links.some(link => !link.question || link.question.skill !== 'LISTENING' || link.question.hskLevel !== hskLevel)) {
          throw new Error('The selected listening set contains missing or mismatched questions.');
        }
        const mappedQuestions = links.map(({ question }, idx) =>
          transformQuestionToListening(question, idx + 1, set.audioUrl));
        if (!cancelled) { setQuestions(mappedQuestions); setAnswers({}); setBookmarks({}); }
      } catch (err) {
        if (!cancelled) { setQuestions([]); AppAlert.error('Không thể tải bài luyện', 'Vui lòng kiểm tra kết nối và mở lại bài luyện.'); }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchQuestions();
    return () => { cancelled = true; };
  }, [hskLevel, practiceSetId]);

  const studyTimer = useStudyTimer(!isLoading && questions.length > 0, 'practice_listening');
  const flatData = useMemo(() => buildFlatData(questions), [questions]);
  const stickyHeaders = useMemo(() => audioStickyHeaderIndices(flatData, 1), [flatData]);
  const { listRef: flatListRef, scrollToQuestion, rememberHeaderHeight, onScrollToIndexFailed } = useAudioListScroll(flatData);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const firstQ = viewableItems.find((v: any) => v.item.kind === 'question');
      if (firstQ) {
        setCurrentQuestionId(firstQ.item.question.id);
      }
    }
  }).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const handleSelectOption = useCallback((questionId: string, optionId: string) => {
    setAnswers(prev => {
      const next = { ...prev };
      if (optionId.trim()) next[questionId] = optionId;
      else delete next[questionId];
      return next;
    });
  }, []);

  const handleToggleBookmark = useCallback((questionId: string) => {
    setBookmarks(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  }, []);

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    let correct = 0;
    const gradableQuestions = questions.filter(question => !question.requiresManualReview);
    gradableQuestions.forEach(q => {
      if (answers[q.id] === q.correctOptionId) correct++;
    });
    if (onSubmit) {
      onSubmit({ score: gradableQuestions.length ? Math.round((correct / gradableQuestions.length) * 100) : null, correctCount: correct, totalCount: questions.length, gradedCount: gradableQuestions.length, manualCount: questions.length - gradableQuestions.length, completedCount: Object.keys(answers).length, answers, questions, durationInSeconds: studyTimer.takeSeconds() });
    } else {
      onBack();
    }
  };

  const handleGridPress = useCallback((questionId: string) => {
    setShowGridModal(false);
    const index = flatData.findIndex(item => item.kind === 'question' && item.question.id === questionId);
    const row = flatData[index];
    scrollToQuestion(index, row?.kind === 'question' ? row.sharedAudioHeaderId : undefined);
  }, [flatData, scrollToQuestion]);

  const handleExitPress = useCallback(() => {
    AppAlert.confirm(
      'Thoát bài luyện tập',
      'Bạn có chắc chắn muốn thoát? Kết quả hiện tại sẽ không được lưu.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Thoát', style: 'destructive', onPress: onBack },
      ]
    );
  }, [onBack]);

  useScreenBackHandler(() => {
    if (isLoading || questions.length === 0) onBack();
    else handleExitPress();
    return true;
  });

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const remainingCount = totalCount - answeredCount;
  const manualCount = questions.filter(question => question.requiresManualReview).length;
  const isManualOnly = totalCount > 0 && manualCount === totalCount;
  const submitLabel = isManualOnly ? 'Hoàn thành' : 'Nộp bài';

  const gridItems = useMemo(() => questions.map(q => ({
    id: q.id,
    index: q.index,
    isAnswered: !!answers[q.id],
    isBookmarked: !!bookmarks[q.id],
    isCurrent: q.id === currentQuestionId,
  })), [questions, answers, bookmarks, currentQuestionId]);

  const renderItem = useCallback(({ item }: { item: FlatItem }) => {
    if (item.kind === 'audio_header') return <SharedAudioHeader url={item.audioUrl} label={item.label} onHeight={height => rememberHeaderHeight(item.id, height)} />;
    if (item.kind === 'audio_end') return <SharedAudioEnd />;
    if (item.kind === 'group_header') {
      return <GroupHeader images={item.images} exampleDialogue={item.exampleDialogue} exampleAnswer={item.exampleAnswer} />;
    }
    const q = item.question;
    if (q.type === 'GROUP_SELECT') {
      return (
        <GroupQuestionCard
          question={q}
          showAudio={!item.sharedAudioHeaderId}
          selectedOptionId={answers[q.id]}
          onSelectOption={handleSelectOption}
          bookmarked={bookmarks[q.id]}
          onToggleBookmark={handleToggleBookmark}
        />
      );
    }
    return (
      <ListeningQuestionCard
        question={q}
        showAudio={!item.sharedAudioHeaderId}
        selectedOptionId={answers[q.id]}
        onSelectOption={handleSelectOption}
        bookmarked={bookmarks[q.id]}
        onToggleBookmark={handleToggleBookmark}
      />
    );
  }, [answers, bookmarks, handleSelectOption, handleToggleBookmark, rememberHeaderHeight]);

  if (isLoading) {
    return (
      <SafeAreaView onTouchStart={studyTimer.markActivity} onTouchMove={studyTimer.markActivity} style={{ flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: ms(16), color: '#4B5563' }}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView onTouchStart={studyTimer.markActivity} onTouchMove={studyTimer.markActivity} style={{ flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: ms(16), color: '#4B5563', marginBottom: vs(16) }}>Không có câu hỏi nào.</Text>
        <TouchableOpacity onPress={onBack} style={{ padding: ms(12), backgroundColor: '#1E3A8A', borderRadius: ms(8) }}>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView onTouchStart={studyTimer.markActivity} onTouchMove={studyTimer.markActivity} style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <PracticeHeader
        title="Luyện tập kỹ năng nghe"
        subtitle={`${answeredCount}/${totalCount} ${isManualOnly ? 'mục đã làm' : 'câu đã trả lời'}`}
        onBack={handleExitPress}
        onOpenGrid={() => setShowGridModal(true)}
        onSubmit={() => setShowSubmitModal(true)}
        submitLabel={submitLabel}
      />

      <FlatList
        keyboardShouldPersistTaps="handled"
        ref={flatListRef}
        data={flatData}
        keyExtractor={(item) => item.id}
        stickyHeaderIndices={stickyHeaders}
        removeClippedSubviews={false}
        renderItem={renderItem}
        contentContainerStyle={{ padding: ms(16) }}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollToIndexFailed={onScrollToIndexFailed}
        ListHeaderComponent={
          <View style={{ marginBottom: vs(20) }}>
            <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(22) }}>
              Nghe audio và làm theo yêu cầu của từng mục. {manualCount ? 'Phần nghe–viết có đáp án đối chiếu sau khi hoàn thành. Phần nghe–đọc lại tự luyện không chấm tự động.' : 'Chọn đáp án phù hợp cho mỗi câu.'}
            </Text>
          </View>
        }
        ListFooterComponent={
          <View style={{ backgroundColor: '#FAF9F6', borderRadius: ms(12), padding: ms(24), alignItems: 'center', marginTop: vs(8), marginBottom: vs(24) }}>
            <Text style={{ fontSize: ms(14), color: '#6B7280', marginBottom: vs(16), fontWeight: '500' }}>
              Đã làm <Text style={{ fontWeight: '800', color: '#111827' }}>{answeredCount}</Text>/{totalCount} {isManualOnly ? 'mục' : 'câu'}. Còn {remainingCount} chưa làm
            </Text>
            <TouchableOpacity onPress={() => setShowSubmitModal(true)} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(8), paddingHorizontal: hs(36), paddingVertical: vs(12) }}>
              <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>{submitLabel}</Text>
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
        title={isManualOnly ? 'Hoàn thành bài tự luyện?' : undefined}
        confirmButtonText={submitLabel}
        remainingWarningText={manualCount ? `Bạn còn ${remainingCount} mục chưa làm. Phần nghe–viết và đọc lại không tính vào điểm trắc nghiệm.` : undefined}
      />

      {/* Grid Modal */}
      <QuestionGridModal
        visible={showGridModal}
        onClose={() => setShowGridModal(false)}
        items={gridItems}
        onSelectItem={(item) => handleGridPress(String(item.id))}
      />
    </SafeAreaView>
  );
};
