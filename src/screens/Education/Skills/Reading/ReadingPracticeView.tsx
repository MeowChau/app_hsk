// @refresh reset
import { useStudyTimer } from '@/hooks/useStudyTimer';
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, SectionList, BackHandler, TextInput, useWindowDimensions } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { ReadingPracticeQuestion } from '../../types';
import { ms, hs, vs } from '@/theme';
import { SubmitConfirmModal, QuestionGridModal } from '@/screens/Education/components';
import { ReadingPracticeImage } from './ReadingPracticeImage';

interface Props {
  hskLevel: number;
  practiceSetId: number;
  onBack: () => void;
  onSubmit?: (result: { score: number, correctCount: number, totalCount: number, answers: Record<string, string>, questions: ReadingPracticeQuestion[], durationInSeconds: number }) => void;
}

import { Image } from 'react-native';

interface ReadingInstructionGroup {
  startIndex: number;
  endIndex: number;
  label: string;
  instruction: string;
  contextImageUrl?: string;
  example?: ReadingPracticeQuestion['example'];
}

const buildReadingInstructionGroups = (questions: ReadingPracticeQuestion[]) => {
  const groups: (ReadingInstructionGroup | undefined)[] = new Array(questions.length);
  const normalize = (instruction?: string) => instruction?.trim().replace(/\s+/g, ' ') || '';

  for (let startIndex = 0; startIndex < questions.length;) {
    const instruction = normalize(questions[startIndex].instruction);
    if (!instruction) {
      startIndex++;
      continue;
    }
    let endIndex = startIndex;
    while (endIndex + 1 < questions.length && normalize(questions[endIndex + 1].instruction) === instruction) {
      endIndex++;
    }
    const first = questions[startIndex];
    const last = questions[endIndex];
    const sharedImage = first.contextImageUrl;
    const sharedExample = first.example;
    const group: ReadingInstructionGroup = {
      startIndex,
      endIndex,
      label: startIndex === endIndex ? `Câu ${first.index}` : `Câu ${first.index}–${last.index}`,
      instruction,
      contextImageUrl: sharedImage && questions.slice(startIndex, endIndex + 1).every(question => question.contextImageUrl === sharedImage)
        ? sharedImage : undefined,
      example: sharedExample && questions.slice(startIndex, endIndex + 1).every(question =>
        question.example?.sentence === sharedExample.sentence
        && question.example?.pinyin === sharedExample.pinyin
        && question.example?.answer === sharedExample.answer)
        ? sharedExample : undefined,
    };
    groups.fill(group, startIndex, endIndex + 1);
    startIndex = endIndex + 1;
  }
  return groups;
};

interface ReadingQuestionSection {
  key: string;
  startIndex: number;
  instructionGroup?: ReadingInstructionGroup;
  data: ReadingPracticeQuestion[];
}

const buildReadingSections = (questions: ReadingPracticeQuestion[]): ReadingQuestionSection[] => {
  const groups = buildReadingInstructionGroups(questions);
  const sections: ReadingQuestionSection[] = [];
  for (let index = 0; index < questions.length;) {
    const group = groups[index];
    const endIndex = group?.endIndex ?? index;
    sections.push({ key: questions[index].id, startIndex: index, instructionGroup: group, data: questions.slice(index, endIndex + 1) });
    index = endIndex + 1;
  }
  return sections;
};

const ReadingInstructionHeader = ({ group, maxImageHeight }: { group: ReadingInstructionGroup; maxImageHeight: number }) => (
  <View style={{ backgroundColor: '#E5E7EB', paddingBottom: vs(12) }}>
    <View style={{ backgroundColor: '#FFFFFF', borderRadius: ms(12), borderWidth: 1, borderColor: '#E5E7EB', padding: ms(12) }}>
      <Text accessibilityRole="header" style={{ fontSize: ms(14), color: '#1E3A8A', fontWeight: '700', marginBottom: vs(6) }}>{group.label}</Text>
      <Text style={{ fontSize: ms(14), color: '#111827', fontWeight: '600', lineHeight: vs(22) }}>{group.instruction}</Text>
      {group.contextImageUrl ? <ReadingPracticeImage key={group.contextImageUrl} uri={group.contextImageUrl} maxHeight={maxImageHeight} /> : null}
    </View>
  </View>
);

const ReadingExample = ({ example }: { example: NonNullable<ReadingPracticeQuestion['example']> }) => (
  <View style={{ backgroundColor: '#F3F4F6', borderRadius: ms(8), padding: ms(12), marginTop: vs(12), gap: vs(6) }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontSize: ms(14), color: '#111827', fontWeight: '700' }}>Ví dụ</Text>
      <Text style={{ fontSize: ms(14), color: '#1E3A8A', fontWeight: '700' }}>Chọn {example.answer}</Text>
    </View>
    <Text style={{ fontSize: ms(16), color: '#111827', lineHeight: vs(24) }}>{example.sentence}</Text>
    {example.pinyin ? <Text accessibilityLabel={`Pinyin: ${example.pinyin}`} style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(22) }}>{example.pinyin}</Text> : null}
  </View>
);

const ReadingQuestionCard = React.memo(({ question, instructionGroup, isGroupStart, selectedOptionId, onSelectOption, bookmarked, onToggleBookmark }: {
  question: ReadingPracticeQuestion;
  instructionGroup?: ReadingInstructionGroup;
  isGroupStart?: boolean;
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

  const renderSentence = () => (
    <View style={{ flex: 1, gap: vs(6) }}>
      <Text style={{ fontSize: ms(16), color: '#111827', lineHeight: vs(24) }}>{question.sentence}</Text>
      {question.pinyin ? (
        <Text accessibilityLabel={`Pinyin: ${question.pinyin}`} style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(22) }}>{question.pinyin}</Text>
      ) : null}
    </View>
  );

  const renderGroupHeader = () => {
    if (!question.groupImages && !question.groupVocabs) return null;
    return (
      <View style={{ marginBottom: vs(16) }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(12) }}>
          <View style={{ width: 4, height: 16, backgroundColor: '#1E3A8A', marginRight: 8, borderRadius: 2 }} />
          <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827' }}>Các phương án</Text>
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

      </View>
    );
  };

  const renderInlineOptions = () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: hs(8), marginTop: vs(16), marginLeft: hs(36) }}>
      {question.options.map(opt => {
        const isSelected = selectedOptionId === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => onSelectOption(question.id, opt.id)}
            style={{
              width: ms(36), height: ms(36), borderRadius: ms(18),
              backgroundColor: isSelected ? '#1E3A8A' : '#FFFFFF',
              borderWidth: 1, borderColor: isSelected ? '#1E3A8A' : '#D1D5DB',
              justifyContent: 'center', alignItems: 'center',
            }}
          >
            <Text style={{ color: isSelected ? '#FFFFFF' : '#374151', fontWeight: '700', fontSize: ms(14) }}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View>
      {instructionGroup?.example && isGroupStart ? <View style={{ marginBottom: vs(12) }}><ReadingExample example={instructionGroup.example} /></View> : null}
      {renderGroupHeader()}
      <View style={{
        backgroundColor: '#FFFFFF',
        borderRadius: ms(12),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: ms(16),
        marginBottom: vs(16),
      }}>
        {!instructionGroup && question.instruction ? (
          <Text style={{ fontSize: ms(14), color: '#111827', fontWeight: '600', lineHeight: vs(22), marginBottom: vs(16) }}>{question.instruction}</Text>
        ) : null}
        {!instructionGroup?.contextImageUrl && question.contextImageUrl ? <ReadingPracticeImage key={question.contextImageUrl} uri={question.contextImageUrl} /> : null}
        {!instructionGroup?.example && question.example ? <ReadingExample example={question.example} /> : null}
        {question.imageUrl && question.type !== 'TRUE_FALSE' ? (
          <ReadingPracticeImage key={question.imageUrl} uri={question.imageUrl} aspectRatio={question.imageAspectRatio} />
        ) : null}
        {question.type === 'GUIDED_PRACTICE' && (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(12) }}>
              {renderNumber(question.index)}
              {renderSentence()}
              {renderFlag()}
            </View>
            <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(22), marginBottom: vs(12) }}>
              Đây là bài luyện tổng hợp, gồm các mục trong hình. Ghi câu trả lời theo từng mục để tự luyện. Bài này chưa có đáp án để chấm tự động.
            </Text>
            <TextInput
              accessibilityLabel="Câu trả lời cho các mục trong hình"
              multiline
              textAlignVertical="top"
              value={selectedOptionId || ''}
              onChangeText={value => onSelectOption(question.id, value)}
              placeholder="Ghi câu trả lời theo thứ tự các mục trong hình…"
              placeholderTextColor="#6B7280"
              style={{ minHeight: vs(100), borderWidth: 1, borderColor: '#D1D5DB', borderRadius: ms(8), padding: ms(12), color: '#111827', fontSize: ms(14), lineHeight: vs(22) }}
            />
          </View>
        )}
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
                {renderSentence()}
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
                {renderSentence()}
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
                    <View style={{ flex: 1 }}>
                      {opt.imageUrl ? <Image source={{ uri: opt.imageUrl }} style={{ width: '100%', aspectRatio: 1, resizeMode: 'contain' }} /> : null}
                      {opt.text ? <Text style={{ fontSize: ms(14), color: isSelected ? '#1E3A8A' : '#4B5563', fontWeight: isSelected ? '700' : '500' }}>{opt.text}</Text> : null}
                      {opt.pinyin && opt.pinyin !== opt.text ? <Text style={{ fontSize: ms(12), color: '#4B5563', lineHeight: vs(18), marginTop: vs(4) }}>{opt.pinyin}</Text> : null}
                    </View>
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

import { educationApi } from '@/services/education/api';
import { transformQuestionToReading } from '@/services/education/transformers';

const ReadingPracticeSession = ({ hskLevel, practiceSetId, onBack, onSubmit }: Props) => {
  const [questions, setQuestions] = useState<ReadingPracticeQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sections = useMemo(() => buildReadingSections(questions), [questions]);
  const { height: windowHeight } = useWindowDimensions();
  const maxPinnedImageHeight = Math.min(vs(220), windowHeight * 0.28);

  useEffect(() => {
    let cancelled = false;
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const set = await educationApi.getPracticeSetById(practiceSetId);
        if (set.skill !== 'READING' || set.hskLevel !== hskLevel) {
          throw new Error('The selected set is not a reading set for this HSK level.');
        }
        const mappedQuestions = [...(set.practiceSetQuestions ?? [])]
          .sort((left, right) => left.order - right.order)
          .filter(link => link.question)
          .map(({ question }, idx) => transformQuestionToReading(question, idx + 1));
        if (!cancelled) { setQuestions(mappedQuestions); setAnswers({}); setBookmarks({}); setCurrentIndex(0); }
      } catch (err) {
        if (!cancelled) { setQuestions([]); Alert.alert('Không thể tải bài luyện', 'Vui lòng kiểm tra kết nối và mở lại bài luyện.'); }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchQuestions();
    return () => { cancelled = true; };
  }, [hskLevel, practiceSetId]);

  const studyTimer = useStudyTimer(!isLoading && questions.length > 0, 'practice_reading');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionListRef = useRef<SectionList<ReadingPracticeQuestion, ReadingQuestionSection>>(null);
  const pendingScroll = useRef<{ sectionIndex: number; itemIndex: number } | null>(null);
  const scrollRetryCount = useRef(0);
  const scrollRetryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    pendingScroll.current = null;
    scrollRetryCount.current = 0;
    return () => { if (scrollRetryTimer.current) clearTimeout(scrollRetryTimer.current); };
  }, [practiceSetId]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const firstQuestion = viewableItems.find((item: any) => typeof item.index === 'number' && item.section);
    if (firstQuestion) {
      setCurrentIndex(firstQuestion.section.startIndex + firstQuestion.index);
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
    const gradableQuestions = questions.filter(q => !q.requiresManualReview);
    gradableQuestions.forEach(q => {
      if (answers[q.id] === q.correctOptionId) correct++;
    });
    if (onSubmit) {
      onSubmit({ score: gradableQuestions.length ? Math.round((correct / gradableQuestions.length) * 100) : 0, correctCount: correct, totalCount: questions.length, answers, questions, durationInSeconds: studyTimer.takeSeconds() });
    } else {
      onBack();
    }
  };

  const handleGridPress = useCallback((index: number) => {
    setShowGridModal(false);
    const sectionIndex = sections.findIndex(section => index >= section.startIndex && index < section.startIndex + section.data.length);
    if (sectionIndex < 0) return;
    if (scrollRetryTimer.current) clearTimeout(scrollRetryTimer.current);
    // The native section list counts its header before the first question.
    const location = { sectionIndex, itemIndex: index - sections[sectionIndex].startIndex + 1 };
    pendingScroll.current = location;
    scrollRetryCount.current = 0;
    sectionListRef.current?.scrollToLocation({ ...location, animated: true, viewPosition: 0 });
  }, [sections]);

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
  const hasGuidedPractice = questions.some(question => question.type === 'GUIDED_PRACTICE');
  const isManualOnly = questions.length > 0 && questions.every(question => question.requiresManualReview);
  const countUnit = hasGuidedPractice ? 'bài luyện' : 'câu';
  const submitLabel = isManualOnly ? 'Hoàn thành' : 'Nộp bài';

  const gridItems = useMemo(() => questions.map((q, idx) => ({
    id: q.id,
    index: q.index,
    isAnswered: !!answers[q.id],
    isBookmarked: !!bookmarks[q.id],
    isCurrent: idx === currentIndex,
  })), [questions, answers, bookmarks, currentIndex]);

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
              {answeredCount}/{totalCount} {countUnit}
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
            <Text style={{ color: '#FFFFFF', fontSize: ms(14), fontWeight: '700' }}>{submitLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SectionList<ReadingPracticeQuestion, ReadingQuestionSection>
        ref={sectionListRef}
        sections={sections}
        stickySectionHeadersEnabled
        removeClippedSubviews={false}
        keyExtractor={item => item.id}
        renderSectionHeader={({ section }) => section.instructionGroup ? (
          <ReadingInstructionHeader group={section.instructionGroup} maxImageHeight={maxPinnedImageHeight} />
        ) : null}
        renderItem={({ item, index, section }) => (
          <ReadingQuestionCard
            question={item}
            instructionGroup={section.instructionGroup}
            isGroupStart={index === 0}
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
          if (!pendingScroll.current || scrollRetryCount.current >= 3) return;
          scrollRetryCount.current++;
          sectionListRef.current?.getScrollResponder()?.scrollTo({ y: Math.max(0, info.averageItemLength * info.index), animated: false });
          if (scrollRetryTimer.current) clearTimeout(scrollRetryTimer.current);
          scrollRetryTimer.current = setTimeout(() => {
            if (pendingScroll.current) sectionListRef.current?.scrollToLocation({ ...pendingScroll.current, animated: true, viewPosition: 0 });
          }, 250);
        }}
        ListFooterComponent={
          <View style={{ backgroundColor: '#FAF9F6', borderRadius: ms(12), padding: ms(24), alignItems: 'center', marginTop: vs(8), marginBottom: vs(24) }}>
            <Text style={{ fontSize: ms(14), color: '#6B7280', marginBottom: vs(16), fontWeight: '500' }}>
              Đã trả lời <Text style={{ fontWeight: '800', color: '#111827' }}>{answeredCount}</Text>/{totalCount} {countUnit}. Còn {remainingCount} chưa trả lời
            </Text>
            <TouchableOpacity onPress={() => setShowSubmitModal(true)} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(8), paddingHorizontal: hs(32), paddingVertical: vs(12) }}>
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
        title={isManualOnly ? 'Hoàn thành bài tự luyện?' : undefined}
        confirmButtonText={submitLabel}
        remainingCount={remainingCount}
        remainingWarningText={hasGuidedPractice ? `Còn ${remainingCount} bài luyện chưa ghi câu trả lời.` : undefined}
      />

      {/* Grid Modal */}
      <QuestionGridModal
        visible={showGridModal}
        onClose={() => setShowGridModal(false)}
        items={gridItems}
        title={hasGuidedPractice ? 'Danh sách bài luyện' : undefined}
        onSelectItem={(_item, idx) => handleGridPress(idx)}
      />
    </SafeAreaView>
  );
};

export const ReadingPracticeView = (props: Props) => (
  <ReadingPracticeSession key={`${props.hskLevel}:${props.practiceSetId}`} {...props} />
);
