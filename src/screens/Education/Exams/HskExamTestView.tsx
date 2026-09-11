import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { BackButton } from '@/components/atoms';
import { ALL_HSK_EXAMS } from '../mockData';
import { HskExamQuestionCard } from './components/HskExamQuestionCard';
import { ms, hs, vs } from '@/theme';

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
    <Text style={{ fontSize: ms(12), fontWeight: '700', color: '#111827' }}>
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
  
  const flatListRef = React.useRef<FlatList>(null);

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
          <BackButton onPress={onBack} style={{ marginRight: hs(8), marginLeft: hs(-6) }} />
          <View>
            <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827' }}>
              HSK {examLevel}
            </Text>
            <Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>
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
            <TouchableOpacity onPress={onBack} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(6), paddingHorizontal: hs(12), paddingVertical: vs(6) }}>
              <Text style={{ color: '#FFFFFF', fontSize: ms(13), fontWeight: '700' }}>Về kết quả</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setShowSubmitModal(true)} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(6), paddingHorizontal: hs(12), paddingVertical: vs(6) }}>
              <Text style={{ color: '#FFFFFF', fontSize: ms(13), fontWeight: '700' }}>Nộp bài</Text>
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
        renderItem={renderItem}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
          });
        }}
        ListFooterComponent={
          <View style={{ alignItems: 'center', marginVertical: vs(24) }}>
            <View style={{ backgroundColor: '#FEF3C7', borderRadius: ms(8), padding: ms(16), width: '100%', alignItems: 'center', marginBottom: vs(40) }}>
              {isReviewMode ? (
                <>
                  <Text style={{ fontSize: ms(14), color: '#374151', fontWeight: '600', marginBottom: vs(12) }}>
                    Đúng {Object.entries(answers).filter(([qId, optId]) => {
                      const q = questions.find(qq => qq.id === qId);
                      return q && optId === q.correctOptionId;
                    }).length}/{totalCount} câu.
                  </Text>
                  <TouchableOpacity onPress={onBack} style={{ borderWidth: 1.5, borderColor: '#374151', borderRadius: ms(20), paddingVertical: vs(10), paddingHorizontal: hs(32), backgroundColor: '#FFFFFF' }}>
                    <Text style={{ color: '#374151', fontSize: ms(14), fontWeight: '600' }}>Về trang kết quả</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={{ fontSize: ms(13), color: '#92400E', fontWeight: '500', marginBottom: vs(12) }}>
                    Đã trả lời {answeredCount}/{totalCount} câu. Còn {remainingCount} chưa trả lời
                  </Text>
                  <TouchableOpacity onPress={() => setShowSubmitModal(true)} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(8), paddingVertical: vs(10), paddingHorizontal: hs(32) }}>
                    <Text style={{ color: '#FFFFFF', fontSize: ms(14), fontWeight: '700' }}>Nộp bài</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        }
      />

      {/* Grid Modal */}
      <Modal visible={showGridModal} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowGridModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>
              <View style={{ width: '90%', height: '80%', backgroundColor: '#FAF9F6', borderRadius: ms(12), padding: ms(16) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: vs(16) }}>
                  <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827' }}>Danh sách câu hỏi</Text>
                  <TouchableOpacity onPress={() => setShowGridModal(false)} style={{ position: 'absolute', right: 0 }}>
                    <Text style={{ fontSize: ms(20), color: '#6B7280' }}>×</Text>
                  </TouchableOpacity>
                </View>
                
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={{ fontSize: ms(15), fontWeight: '700', color: '#111827', marginBottom: vs(12) }}>Câu hỏi</Text>
                  
                  <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#1E3A8A', marginBottom: vs(12), borderLeftWidth: 3, borderLeftColor: '#1E3A8A', paddingLeft: hs(8) }}>Nghe</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(12), marginBottom: vs(24) }}>
                    {questions.filter(q => q.type === 'LISTENING').map(q => {
                      const isAnswered = !!answers[q.id];
                      const isBookmarked = !!bookmarks[q.id];
                      
                      let bgColor = '#EBE3D5';
                      let textColor = '#4B5563';
                      let borderColor = 'transparent';
                      let borderWidth = 0;
                      let borderStyle = 'solid';
                      
                      if (isReviewMode) {
                        if (isAnswered) {
                          const isCorrect = answers[q.id] === q.correctOptionId;
                          bgColor = isCorrect ? '#22C55E' : '#EF4444';
                          textColor = '#FFFFFF';
                        } else {
                          bgColor = 'transparent';
                          textColor = '#EF4444';
                          borderColor = '#EF4444';
                          borderWidth = 1;
                          borderStyle = 'dashed';
                        }
                      } else {
                        bgColor = isAnswered ? '#1E3A8A' : '#EBE3D5';
                        textColor = isAnswered ? '#FFFFFF' : '#4B5563';
                      }
                      
                      return (
                        <TouchableOpacity key={q.id} onPress={() => handleGridPress(q.id)} style={{ width: ms(44), height: ms(44), borderRadius: ms(6), backgroundColor: bgColor, borderColor, borderWidth, borderStyle: borderStyle as any, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ color: textColor, fontWeight: '700', fontSize: ms(14) }}>{q.index}</Text>
                          {isBookmarked && (
                            <View style={{ position: 'absolute', top: -ms(4), right: -ms(4), width: ms(12), height: ms(12), borderRadius: ms(6), backgroundColor: '#F59E0B', borderWidth: 2, borderColor: '#FFFFFF' }} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#1E3A8A', marginBottom: vs(12), borderLeftWidth: 3, borderLeftColor: '#1E3A8A', paddingLeft: hs(8) }}>Đọc</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(12), marginBottom: vs(24) }}>
                    {questions.filter(q => q.type === 'READING').map(q => {
                      const isAnswered = !!answers[q.id];
                      const isBookmarked = !!bookmarks[q.id];

                      let bgColor = '#EBE3D5';
                      let textColor = '#4B5563';
                      let borderColor = 'transparent';
                      let borderWidth = 0;
                      let borderStyle = 'solid';
                      
                      if (isReviewMode) {
                        if (isAnswered) {
                          const isCorrect = answers[q.id] === q.correctOptionId;
                          bgColor = isCorrect ? '#22C55E' : '#EF4444';
                          textColor = '#FFFFFF';
                        } else {
                          bgColor = 'transparent';
                          textColor = '#EF4444';
                          borderColor = '#EF4444';
                          borderWidth = 1;
                          borderStyle = 'dashed';
                        }
                      } else {
                        bgColor = isAnswered ? '#1E3A8A' : '#EBE3D5';
                        textColor = isAnswered ? '#FFFFFF' : '#4B5563';
                      }

                      return (
                        <TouchableOpacity key={q.id} onPress={() => handleGridPress(q.id)} style={{ width: ms(44), height: ms(44), borderRadius: ms(6), backgroundColor: bgColor, borderColor, borderWidth, borderStyle: borderStyle as any, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ color: textColor, fontWeight: '700', fontSize: ms(14) }}>{q.index}</Text>
                          {isBookmarked && (
                            <View style={{ position: 'absolute', top: -ms(4), right: -ms(4), width: ms(12), height: ms(12), borderRadius: ms(6), backgroundColor: '#F59E0B', borderWidth: 2, borderColor: '#FFFFFF' }} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                {isReviewMode ? (
                  <View style={{ marginTop: vs(16), gap: vs(8) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}><View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: '#22C55E' }} /><Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Đúng</Text></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}><View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: '#EF4444' }} /><Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Sai</Text></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}>
                      <View style={{ width: ms(12), height: ms(12), borderRadius: ms(2), borderWidth: 1, borderColor: '#EF4444', borderStyle: 'dashed' }} />
                      <Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Chưa trả lời</Text>
                    </View>
                  </View>
                ) : (
                  <View style={{ marginTop: vs(16), gap: vs(8) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}><View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: '#1E3A8A' }} /><Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Đã trả lời</Text></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}><View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: '#EBE3D5' }} /><Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Chưa trả lời</Text></View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}><View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: '#F59E0B' }} /><Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Đã đánh dấu</Text></View>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
    </SafeAreaView>
  );
};
