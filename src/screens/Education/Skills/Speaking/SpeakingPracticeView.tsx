import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, Platform, PermissionsAndroid, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { generateSpeakingQuestions } from './speakingMockData';
import { SpeakingPracticeQuestion } from '../../types';
import { ms, hs, vs } from '@/theme';

interface Props {
  topic: string;
  onBack: () => void;
  onSubmit: (result: any) => void;
}

type RecordState = 'idle' | 'recording' | 'processing' | 'result';

export const SpeakingPracticeView = ({ topic, onBack, onSubmit }: Props) => {
  const [questions, setQuestions] = useState<SpeakingPracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [recordTime, setRecordTime] = useState(0);
  const [showGridModal, setShowGridModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Results tracker
  const [results, setResults] = useState<Record<string, number>>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuestions(generateSpeakingQuestions(topic));
  }, [topic]);

  const currentQ = questions[currentIndex];
  const totalCount = questions.length;
  const currentScore = currentQ ? results[currentQ.id] : undefined;

  const averageScore = Object.values(results).length > 0
    ? Math.round(Object.values(results).reduce((a, b) => a + b, 0) / Object.values(results).length)
    : 0;

  const answeredCount = Object.keys(results).length;
  const remainingCount = totalCount - answeredCount;

  const handleExit = () => {
    Alert.alert(
      'Thoát luyện tập',
      'Bạn có chắc muốn thoát? Kết quả hiện tại sẽ không được lưu.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Thoát', style: 'destructive', onPress: onBack },
      ]
    );
  };

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Quyền truy cập Microphone',
            message: 'Ứng dụng cần quyền sử dụng Microphone để thu âm và chấm điểm phát âm của bạn.',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Từ chối',
            buttonPositive: 'Đồng ý',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    // iOS usually handles this natively when the API is called, but we mock it here.
    return true;
  };

  const startRecording = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      Alert.alert('Không có quyền truy cập', 'Vui lòng cấp quyền Microphone trong cài đặt để tiếp tục.');
      return;
    }

    setRecordState('recording');
    setRecordTime(0);
    timerRef.current = setInterval(() => {
      setRecordTime(prev => {
        if (prev >= 3) {
          stopRecording(); // Auto stop at 4s
          return 4;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRecordState('processing');

    // Mock processing delay
    setTimeout(() => {
      // Generate a mock score. Even index -> high score, odd index -> low score for demo purposes.
      const mockScore = currentIndex % 2 === 0 ? Math.floor(Math.random() * (100 - 85 + 1)) + 85 : Math.floor(Math.random() * (60 - 10 + 1)) + 10;
      setResults(prev => ({ ...prev, [currentQ.id]: mockScore }));
      setRecordState('result');
    }, 1000);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setRecordState('idle');
    } else {
      // Auto open submit modal when clicking next on the last question
      setShowSubmitModal(true);
    }
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    const passedCount = Object.values(results).filter(s => s >= 75).length;
    onSubmit({ score: averageScore, passedCount, totalCount });
  };

  const handleRetry = () => {
    setRecordState('idle');
    setRecordTime(0);
  };

  if (!currentQ) return <View />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      {/* Sticky Header (Giống màn Luyện Nghe) */}
      <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: hs(16), paddingTop: vs(8), paddingBottom: vs(12), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={handleExit} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={{ marginRight: hs(8), padding: ms(8), marginLeft: hs(-6) }}>
            <Svg height="24" viewBox="0 0 24 24" width="24">
              <Path d="M20 12H4M10 18l-6-6 6-6" fill="none" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827' }} numberOfLines={1}>
              Luyện tập kỹ năng nói
            </Text>
            <Text style={{ fontSize: ms(13), color: '#4B5563', fontWeight: '500' }}>
              {currentIndex}/{totalCount} số lượng câu
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

      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(16), paddingBottom: vs(40) }} showsVerticalScrollIndicator={false}>
        {/* Practice Card Container */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: ms(12), borderWidth: 1, borderColor: '#E5E7EB', overflow: 'hidden' }}>

          {/* Card Content */}
          <View style={{ backgroundColor: '#FFFFFF', padding: ms(24), alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(8) }}>
              <Text style={{ fontSize: ms(48), fontWeight: '500', color: '#111827' }}>{currentQ.character}</Text>
              <TouchableOpacity style={{ marginLeft: hs(8) }}>
                <Svg height="24" viewBox="0 0 24 24" width="24">
                  <Path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: ms(16), color: '#374151', marginBottom: vs(4) }}>{currentQ.pinyin}</Text>
            <Text style={{ fontSize: ms(14), color: '#6B7280', marginBottom: vs(32) }}>{currentQ.meaning}</Text>

            {/* State: IDLE */}
            {recordState === 'idle' && (
              <View style={{ alignItems: 'center', marginTop: vs(16) }}>
                <TouchableOpacity
                  onPress={startRecording}
                  style={{ width: ms(56), height: ms(56), borderRadius: ms(28), backgroundColor: '#1E3A8A', justifyContent: 'center', alignItems: 'center', marginBottom: vs(12) }}
                >
                  <Svg height="24" viewBox="0 0 24 24" width="24">
                    <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </TouchableOpacity>
                <Text style={{ fontSize: ms(14), color: '#6B7280' }}>Bấm rồi đọc to đoạn trên</Text>
              </View>
            )}

            {/* State: RECORDING */}
            {recordState === 'recording' && (
              <View style={{ alignItems: 'center', marginTop: vs(16) }}>
                <TouchableOpacity
                  onPress={stopRecording}
                  style={{ width: ms(56), height: ms(56), borderRadius: ms(28), backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', marginBottom: vs(12) }}
                >
                  <View style={{ width: ms(16), height: ms(16), backgroundColor: '#FFFFFF', borderRadius: ms(4) }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: '#EF4444', marginRight: hs(6) }} />
                  <Text style={{ fontSize: ms(14), color: '#6B7280' }}>Đang ghi âm... {recordTime}s / 4s – bấm để dừng</Text>
                </View>
              </View>
            )}

            {/* State: PROCESSING */}
            {recordState === 'processing' && (
              <View style={{ alignItems: 'center', marginTop: vs(16) }}>
                <Text style={{ fontSize: ms(14), color: '#1E3A8A', fontWeight: '600' }}>Đang phân tích giọng nói...</Text>
              </View>
            )}

            {/* State: RESULT */}
            {recordState === 'result' && currentScore !== undefined && (
              <View style={{ alignItems: 'center', width: '100%', marginTop: vs(8) }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: vs(16) }}>
                  <Text style={{ fontSize: ms(40), fontWeight: '700', color: currentScore >= 75 ? '#15803D' : '#DC2626' }}>
                    {currentScore}
                  </Text>
                  <Text style={{ fontSize: ms(20), color: '#6B7280', fontWeight: '500' }}>/100</Text>
                  <View style={{ marginLeft: hs(8), alignItems: 'center' }}>
                    <Svg height="14" viewBox="0 0 24 24" width="14">
                      <Path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ fontSize: ms(10), color: '#6B7280', fontWeight: '500' }}>Giọng bạn</Text>
                  </View>
                </View>

                {/* Score badge & Feedback text */}
                <View style={{ backgroundColor: currentScore >= 75 ? '#F0FDF4' : '#FEF2F2', paddingHorizontal: hs(12), paddingVertical: vs(4), borderRadius: ms(6), marginBottom: vs(16) }}>
                  <Text style={{ color: currentScore >= 75 ? '#15803D' : '#DC2626', fontSize: ms(14), fontWeight: '600' }}>{currentQ.character}</Text>
                </View>

                {currentScore >= 75 ? (
                  <Text style={{ fontSize: ms(14), color: '#374151', textAlign: 'center', marginBottom: vs(24) }}>
                    Tuyệt vời! Phát âm của bạn rất chuẩn và tự nhiên.
                  </Text>
                ) : (
                  <View style={{ width: '100%' }}>
                    <Text style={{ fontSize: ms(14), color: '#4B5563', marginBottom: vs(4) }}>
                      <Text style={{ fontWeight: '700', color: '#DC2626' }}>{currentQ.character}</Text> – lỗi khác: Phát âm sai rõ rệt, cần đọc lại.
                    </Text>
                    <Text style={{ fontSize: ms(14), color: '#4B5563', marginBottom: vs(16) }}>
                      <Text style={{ fontWeight: '700', color: '#DC2626' }}>{currentQ.character}</Text> – lỗi chưa đọc: Chưa nghe rõ chữ này (có thể bị bỏ sót).
                    </Text>

                    <Text style={{ fontSize: ms(14), fontWeight: '600', color: '#111827', textAlign: 'center', marginBottom: vs(16) }}>
                      Cần thêm nhé – nhiều âm chưa đúng.
                    </Text>

                    <View style={{ backgroundColor: '#FEF3C7', padding: ms(12), borderRadius: ms(8), marginBottom: vs(16) }}>
                      <Text style={{ fontSize: ms(14), color: '#92400E' }}>
                        <Text style={{ fontWeight: '700' }}>💡 Chú ý</Text> phát âm chữ <Text style={{ fontWeight: '700' }}>{currentQ.character}</Text> cho rõ ràng và đúng thanh điệu hơn.
                      </Text>
                      <Text style={{ fontSize: ms(14), color: '#92400E', textAlign: 'center', marginTop: vs(12) }}>
                        Ai nghe thành: {currentQ.pinyin}?
                      </Text>
                    </View>
                  </View>
                )}

                {/* Buttons */}
                <View style={{ flexDirection: 'row', gap: hs(12), width: '100%', marginTop: vs(8) }}>
                  <TouchableOpacity onPress={handleRetry} style={{ flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: ms(8), paddingVertical: vs(12), alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: hs(6) }}>
                    <Svg height="16" viewBox="0 0 24 24" width="16">
                      <Path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ color: '#374151', fontSize: ms(15), fontWeight: '700' }}>Đọc lại</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleNext} style={{ flex: 1, backgroundColor: '#1E3A8A', borderRadius: ms(8), paddingVertical: vs(12), alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: hs(6) }}>
                    <Text style={{ color: '#FFFFFF', fontSize: ms(15), fontWeight: '700' }}>{currentIndex < totalCount - 1 ? 'Tiếp theo' : 'Hoàn thành'}</Text>
                    <Svg height="16" viewBox="0 0 24 24" width="16">
                      <Path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Submit Confirm Modal */}
      <Modal visible={showSubmitModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowSubmitModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>
              <View style={{ width: '85%', backgroundColor: '#FAF9F6', borderRadius: ms(12), padding: ms(20) }}>
                <TouchableOpacity onPress={() => setShowSubmitModal(false)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ position: 'absolute', top: ms(10), right: ms(10), padding: ms(10), zIndex: 10 }}>
                  <Text style={{ fontSize: ms(22), color: '#6B7280', fontWeight: '700', lineHeight: ms(22) }}>×</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: ms(20), fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: vs(16) }}>Xác nhận nộp bài?</Text>

                {remainingCount > 0 && (
                  <View style={{ backgroundColor: '#FEF3C7', padding: ms(12), borderRadius: ms(8), flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(24) }}>
                    <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginTop: 2, marginRight: hs(8) }}>
                      <Path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ fontSize: ms(14), color: '#92400E', flex: 1, lineHeight: vs(20) }}>
                      Bạn còn <Text style={{ fontWeight: '700' }}>{remainingCount}</Text> câu chưa đọc, những câu này sẽ bị tính 0 điểm.
                    </Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: hs(12) }}>
                  <TouchableOpacity onPress={() => setShowSubmitModal(false)} style={{ flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: ms(8), paddingVertical: vs(12), alignItems: 'center' }}>
                    <Text style={{ color: '#374151', fontSize: ms(15), fontWeight: '700' }}>Tiếp tục học</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleConfirmSubmit} style={{ flex: 1, backgroundColor: '#1E3A8A', borderRadius: ms(8), paddingVertical: vs(12), alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: ms(15), fontWeight: '700' }}>Nộp bài</Text>
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
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>
              <View style={{ width: '90%', backgroundColor: '#FAF9F6', borderRadius: ms(12), padding: ms(16), maxHeight: '80%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: vs(16) }}>
                  <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827' }}>Danh sách bài học</Text>
                  <TouchableOpacity onPress={() => setShowGridModal(false)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ position: 'absolute', right: 0, padding: ms(10), zIndex: 10 }}>
                    <Text style={{ fontSize: ms(24), color: '#6B7280', fontWeight: '700', lineHeight: ms(24) }}>×</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(12), marginBottom: vs(24) }}>
                    {questions.map((q, index) => {
                      const hasResult = results[q.id] !== undefined;
                      const isCurrent = index === currentIndex;
                      let bgColor = '#EBE3D5';
                      let textColor = '#1E3A8A';

                      if (isCurrent) {
                        bgColor = '#FEF3C7';
                        textColor = '#92400E';
                      } else if (hasResult) {
                        bgColor = '#1E3A8A';
                        textColor = '#FFFFFF';
                      }

                      return (
                        <TouchableOpacity
                          key={q.id}
                          onPress={() => {
                            setCurrentIndex(index);
                            setRecordState('idle');
                            setShowGridModal(false);
                          }}
                          style={{ width: ms(44), height: ms(44), borderRadius: ms(6), backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center', borderWidth: isCurrent ? 2 : 0, borderColor: '#F59E0B' }}
                        >
                          <Text style={{ color: textColor, fontWeight: '700', fontSize: ms(15) }}>{index + 1}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>

                <View style={{ marginTop: vs(16), gap: vs(8) }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}><View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: '#1E3A8A' }} /><Text style={{ fontSize: ms(13), color: '#1E3A8A', fontWeight: '600' }}>Đã trả lời</Text></View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}><View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: '#EBE3D5' }} /><Text style={{ fontSize: ms(13), color: '#1E3A8A', fontWeight: '600' }}>Chưa trả lời</Text></View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(8) }}><View style={{ width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: '#F59E0B' }} /><Text style={{ fontSize: ms(13), color: '#1E3A8A', fontWeight: '600' }}>Đã đánh dấu</Text></View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};
