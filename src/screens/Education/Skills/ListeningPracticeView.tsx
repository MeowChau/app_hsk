import React, { useState, useCallback, useMemo, memo, useRef } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, Alert, ScrollView } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { ListeningQuestionCard } from './ListeningQuestionCard';
import { generateListeningQuestions } from './listeningMockData';
import { ListeningPracticeQuestion, ListeningPracticeOption } from '../types';
import { ms, hs, vs } from '@/theme';

interface Props {
  hskLevel: number;
  topic: string;
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
    <View style={{ flexDirection: 'row', gap: ms(6), marginBottom: vs(10) }}>
      {images.map((img) => (
        <View
          key={img.id}
          style={{
            flex: 1, backgroundColor: '#FFFFFF',
            borderRadius: ms(8), borderWidth: 1, borderColor: '#E5E7EB',
            alignItems: 'center', paddingTop: ms(4), paddingBottom: ms(4),
            overflow: 'hidden',
          }}
        >
          <Text style={{ fontSize: ms(10), fontWeight: '700', color: '#4B5563', marginBottom: vs(2) }}>{img.label}</Text>
          {img.imageUrl ? (
            <Image source={img.imageUrl} style={{ width: '100%', height: vs(52) }} resizeMode="cover" />
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
        <Text style={{ flex: 1, fontSize: ms(13), color: '#374151', lineHeight: vs(20) }}>{exampleDialogue}</Text>
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
const GroupQuestionCard = memo(({ question, selectedOptionId, onSelectOption, bookmarked, onToggleBookmark }: {
  question: ListeningPracticeQuestion;
  selectedOptionId?: string;
  onSelectOption: (qId: string, oId: string) => void;
  bookmarked?: boolean;
  onToggleBookmark: (qId: string) => void;
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
      {/* Audio row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(10) }}>
        {/* Index */}
        <View style={{ width: ms(28), height: ms(28), borderRadius: ms(14), backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginRight: hs(8) }}>
          <Text style={{ color: '#374151', fontWeight: '800', fontSize: ms(12) }}>{question.index}</Text>
        </View>

        {/* Volume icon */}
        <Svg height="15" viewBox="0 0 24 24" width="15">
          <Path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
        </Svg>

        {/* Play */}
        <TouchableOpacity style={{ marginHorizontal: hs(4) }}>
          <Svg height="11" viewBox="0 0 24 24" width="11">
            <Path d="M5 3l14 9-14 9V3z" fill="#374151" />
          </Svg>
        </TouchableOpacity>

        {/* Time */}
        <Text style={{ fontSize: ms(11), color: '#9CA3AF', marginRight: hs(4) }}>0:00 / 0:00</Text>

        {/* Progress bar stretches */}
        <View style={{ flex: 1, height: vs(3), backgroundColor: '#D1D5DB', borderRadius: ms(2) }}>
          <View style={{ width: '0%', height: '100%', backgroundColor: '#374151', borderRadius: ms(2) }} />
        </View>

        {/* Volume small */}
        <Svg height="13" viewBox="0 0 24 24" width="13" style={{ marginLeft: hs(4) }}>
          <Path d="M11 5L6 9H2v6h4l5 4V5z" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
        </Svg>

        {/* Three dots */}
        <TouchableOpacity style={{ marginLeft: hs(4) }}>
          <Svg height="14" viewBox="0 0 24 24" width="14">
            <Path d="M12 5v.01M12 12v.01M12 19v.01" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>

        {/* Bookmark */}
        <TouchableOpacity onPress={() => onToggleBookmark(question.id)} style={{ marginLeft: hs(6) }}>
          <Svg height="15" viewBox="0 0 24 24" width="15">
            <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"
              fill={bookmarked ? '#D97706' : 'none'}
              stroke={bookmarked ? '#D97706' : '#9CA3AF'}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* A-F buttons */}
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
              <Text style={{ color: isSelected ? '#FFFFFF' : '#374151', fontWeight: '700', fontSize: ms(13) }}>{letter}</Text>
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
  | { kind: 'question'; question: ListeningPracticeQuestion };

function buildFlatData(questions: ListeningPracticeQuestion[]): FlatItem[] {
  const items: FlatItem[] = [];
  let groupHeaderInserted = false;

  for (const q of questions) {
    if (q.type === 'GROUP_SELECT') {
      if (!groupHeaderInserted) {
        // First GROUP_SELECT question carries the groupImages
        const firstGroup = questions.find(x => x.type === 'GROUP_SELECT' && x.groupImages);
        items.push({
          kind: 'group_header',
          id: 'group_header',
          images: firstGroup?.groupImages || [],
          exampleDialogue: '男：喂，请问张经理在吗？\n女：他正在开会，您半个小时以后再打，好吗？',
          exampleAnswer: 'D',
        });
        groupHeaderInserted = true;
      }
    }
    items.push({ kind: 'question', question: q });
  }
  return items;
}

// ============================================================
// MAIN VIEW
// ============================================================
export const ListeningPracticeView = ({ hskLevel, topic, onBack, onSubmit }: Props) => {
  const questions = useMemo(
    () => generateListeningQuestions(hskLevel, topic),
    [hskLevel, topic],
  );

  const flatData = useMemo(() => buildFlatData(questions), [questions]);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);

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

  const handleGridPress = useCallback((questionId: string) => {
    setShowGridModal(false);
    const index = flatData.findIndex(item => item.kind === 'question' && item.question.id === questionId);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0 });
    }
  }, [flatData]);

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

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const remainingCount = totalCount - answeredCount;
  const progressPercent = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  const renderItem = useCallback(({ item }: { item: FlatItem }) => {
    if (item.kind === 'group_header') {
      return <GroupHeader images={item.images} exampleDialogue={item.exampleDialogue} exampleAnswer={item.exampleAnswer} />;
    }
    const q = item.question;
    if (q.type === 'GROUP_SELECT') {
      return (
        <GroupQuestionCard
          question={q}
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
        selectedOptionId={answers[q.id]}
        onSelectOption={handleSelectOption}
        bookmarked={bookmarks[q.id]}
        onToggleBookmark={handleToggleBookmark}
      />
    );
  }, [answers, bookmarks, handleSelectOption, handleToggleBookmark]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      {/* Sticky Header */}
      <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: hs(16), paddingTop: vs(8), paddingBottom: vs(12), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={handleExitPress} style={{ marginRight: hs(8), padding: ms(4), marginLeft: hs(-6) }}>
            <Svg height="24" viewBox="0 0 24 24" width="24">
              <Path d="M20 12H4M10 18l-6-6 6-6" fill="none" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827' }} numberOfLines={1}>
              LUYỆN NGHE THEO BÀI HỌC
            </Text>
            <Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>
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
          <TouchableOpacity onPress={() => setShowSubmitModal(true)} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(6), paddingHorizontal: hs(12), paddingVertical: vs(6) }}>
            <Text style={{ color: '#FFFFFF', fontSize: ms(13), fontWeight: '700' }}>Nộp bài</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={flatData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: ms(16) }}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          });
        }}
        ListHeaderComponent={
          <View style={{ marginBottom: vs(20) }}>
            <Text style={{ fontSize: ms(13), color: '#4B5563', lineHeight: vs(22) }}>
              Luyện nghe theo 3 chế độ: Nghe chọn ảnh, nghe chọn từ vựng và nghe chọn True/False
            </Text>
          </View>
        }
      />

      {/* Submit Confirm Modal */}
      <Modal visible={showSubmitModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowSubmitModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>
              <View style={{ width: '85%', backgroundColor: '#FAF9F6', borderRadius: ms(12), padding: ms(20) }}>
                <TouchableOpacity onPress={() => setShowSubmitModal(false)} style={{ position: 'absolute', top: vs(12), right: hs(16) }}>
                  <Text style={{ fontSize: ms(20), color: '#6B7280' }}>×</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: vs(16) }}>Xác nhận nộp bài?</Text>
                
                {remainingCount > 0 && (
                  <View style={{ backgroundColor: '#FEF3C7', padding: ms(12), borderRadius: ms(8), flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(24) }}>
                    <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginTop: 2, marginRight: hs(8) }}>
                      <Path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ fontSize: ms(13), color: '#92400E', flex: 1 }}>
                      Bạn còn <Text style={{ fontWeight: '700' }}>{remainingCount}</Text> câu chưa trả lời, những câu này sẽ bị tính là sai.
                    </Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: hs(12) }}>
                  <TouchableOpacity onPress={() => setShowSubmitModal(false)} style={{ flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: ms(8), paddingVertical: vs(10), alignItems: 'center' }}>
                    <Text style={{ color: '#374151', fontSize: ms(13), fontWeight: '700' }}>Tiếp tục làm bài</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleConfirmSubmit} style={{ flex: 1, backgroundColor: '#1E3A8A', borderRadius: ms(8), paddingVertical: vs(10), alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: ms(13), fontWeight: '700' }}>Nộp bài</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Grid Modal */}
      <Modal visible={showGridModal} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setShowGridModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
            <TouchableWithoutFeedback>
              <View style={{ backgroundColor: '#FFFFFF', borderTopLeftRadius: ms(16), borderTopRightRadius: ms(16), padding: ms(16), maxHeight: '80%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(16) }}>
                  <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827' }}>Danh sách câu hỏi</Text>
                  <TouchableOpacity onPress={() => setShowGridModal(false)}>
                    <Text style={{ fontSize: ms(24), color: '#6B7280' }}>×</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(12), marginBottom: vs(24) }}>
                    {questions.map(q => {
                      const isAnswered = !!answers[q.id];
                      const isBookmarked = !!bookmarks[q.id];
                      const bgColor = isAnswered ? '#1E3A8A' : '#EBE3D5';
                      const textColor = isAnswered ? '#FFFFFF' : '#4B5563';

                      return (
                        <TouchableOpacity key={q.id} onPress={() => handleGridPress(q.id)} style={{ width: ms(44), height: ms(44), borderRadius: ms(6), backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ color: textColor, fontWeight: '700', fontSize: ms(14) }}>{q.index}</Text>
                          {isBookmarked && (
                            <View style={{ position: 'absolute', top: -ms(4), right: -ms(4), width: ms(12), height: ms(12), borderRadius: ms(6), backgroundColor: '#F59E0B', borderWidth: 2, borderColor: '#FFFFFF' }} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                <View style={{ marginTop: vs(16), gap: vs(8) }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}><View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: '#1E3A8A' }} /><Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Đã trả lời</Text></View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}><View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: '#EBE3D5' }} /><Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Chưa trả lời</Text></View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}><View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: '#F59E0B' }} /><Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Đã đánh dấu</Text></View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};
