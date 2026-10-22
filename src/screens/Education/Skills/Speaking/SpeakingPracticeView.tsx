// @refresh reset
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, Platform, PermissionsAndroid, ScrollView, AppState } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Svg, { Path, Rect } from 'react-native-svg';
import { educationApi } from '@/services/education/api';
import { transformQuestionToSpeaking } from '@/services/education/transformers';
import { SpeakingPracticeQuestion, SpeakingPracticeResult } from '../../types';
import { ms, hs, vs } from '@/theme';
import { SubmitConfirmModal, QuestionGridModal } from '@/screens/Education/components';
import { useStudyTimer } from '@/hooks/useStudyTimer';
import { useAudioPlayback } from '@/services/audio/AudioProvider';
import { VoiceRecorder } from '@/services/audio/VoiceRecorder';
import type { VoiceRecorderEvent, VoiceRecorderHandle } from '@/services/audio/VoiceRecorder';
import { MAX_VOICE_RECORDING_MS } from '@/services/audio/voiceRecordingDocument';
import { assessPronunciation } from '@/services/education/pronunciation';
import type { PronunciationAssessment } from '@/services/education/pronunciation';
import { SpeakingAssessmentFeedback } from './SpeakingAssessmentFeedback';

interface Props {
  hskLevel: number;
  topic: string;
  onBack: () => void;
  onSubmit: (result: SpeakingPracticeResult) => void;
}

type RecordState = 'idle' | 'preparing' | 'recording' | 'processing' | 'result';
type Recording = { durationMs: number; bytes: number; status: 'pending' | 'graded' | 'error'; assessment?: PronunciationAssessment; error?: string };

export const SpeakingPracticeView = ({ hskLevel, topic, onBack, onSubmit }: Props) => {
  const [questions, setQuestions] = useState<SpeakingPracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordState, setRecordState] = useState<RecordState>('idle');
  const [recordTime, setRecordTime] = useState(0);
  const [showGridModal, setShowGridModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [recordings, setRecordings] = useState<Record<string, Recording>>({});
  const assessmentRequests = useRef(new Map<string, AbortController>());
  const cancelAssessments = useCallback(() => {
    assessmentRequests.current.forEach(controller => controller.abort());
    assessmentRequests.current.clear();
    setRecordings(previous => Object.fromEntries(Object.entries(previous).map(([id, recording]) => [id,
      recording.status === 'pending' ? { ...recording, status: 'error' as const, error: 'Đã dừng chấm khi rời bài luyện. Bạn có thể thử chấm lại.' } : recording,
    ])));
  }, []);
  const [playingRecordingId, setPlayingRecordingId] = useState<string | null>(null);
  const recorder = useRef<VoiceRecorderHandle>(null);
  const recordingsRef = useRef(recordings);
  recordingsRef.current = recordings;
  const recordingRequest = useRef(0);
  const focused = useIsFocused();
  const focusedRef = useRef(focused);
  focusedRef.current = focused;
  useFocusEffect(useCallback(() => () => {
    recordingRequest.current++;
    recorder.current?.cancel();
    cancelAssessments();
    setRecordState(previous => previous === 'preparing' || previous === 'recording' || previous === 'processing' ? 'idle' : previous);
  }, [cancelAssessments]));
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') cancelAssessments();
    });
    return () => subscription.remove();
  }, [cancelAssessments]);

  const [isLoading, setIsLoading] = useState(true);
  const studyTimer = useStudyTimer(!isLoading && questions.length > 0, 'practice_speaking');

  useEffect(() => {
    let cancelled = false;
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const entries = await educationApi.getPracticeQuestions({ hskLevel, topic, skill: 'SPEAKING' });
        if (!cancelled) {
          setQuestions(entries.map(({ question, fallbackAudioUrl }) => transformQuestionToSpeaking(question, fallbackAudioUrl)));
          setCurrentIndex(0);
          setRecordings({});
          setRecordState('idle');
        }
      } catch (err) {
        if (!cancelled) { setQuestions([]); console.warn('Failed to fetch speaking questions', err); }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchQuestions();
    return () => { cancelled = true; };
  }, [hskLevel, topic]);

  const currentQ = questions[currentIndex];
  const audio = useAudioPlayback(currentQ?.audioUrl);
  const totalCount = questions.length;
  const currentRecording = currentQ ? recordings[currentQ.id] : undefined;
  const isCapturing = recordState === 'preparing' || recordState === 'recording' || recordState === 'processing';
  const answeredCount = Object.keys(recordings).length;
  const remainingCount = totalCount - answeredCount;
  const gradedCount = Object.values(recordings).filter(recording => recording.assessment).length;
  const isGrading = Object.values(recordings).some(recording => recording.status === 'pending');

  const gradeRecording = async (questionId: string) => {
    const question = questions.find(item => item.id === questionId);
    if (!question || !recorder.current || !focusedRef.current) return;
    assessmentRequests.current.get(questionId)?.abort();
    const controller = new AbortController();
    assessmentRequests.current.set(questionId, controller);
    setRecordings(previous => previous[questionId] ? { ...previous,
      [questionId]: { ...previous[questionId], status: 'pending', assessment: undefined, error: undefined },
    } : previous);
    try {
      const exported = await recorder.current.exportAudio(questionId);
      if (controller.signal.aborted) return;
      const assessment = await assessPronunciation(exported, question.character, controller.signal);
      if (controller.signal.aborted || assessmentRequests.current.get(questionId) !== controller) return;
      setRecordings(previous => previous[questionId] ? { ...previous,
        [questionId]: { ...previous[questionId], status: 'graded', assessment, error: undefined },
      } : previous);
    } catch (error) {
      if (controller.signal.aborted || assessmentRequests.current.get(questionId) !== controller) return;
      setRecordings(previous => previous[questionId] ? { ...previous,
        [questionId]: { ...previous[questionId], status: 'error', error: error instanceof Error ? error.message : 'Chưa chấm được bản ghi. Vui lòng thử lại.' },
      } : previous);
    } finally {
      if (assessmentRequests.current.get(questionId) === controller) assessmentRequests.current.delete(questionId);
    }
  };

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
            message: 'Ứng dụng cần quyền sử dụng micro để ghi âm và nghe lại giọng của bạn.',
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
    // iOS requests microphone access when the recorder starts capturing.
    return true;
  };

  const startRecording = async () => {
    if (!currentQ || isCapturing) return;
    const request = ++recordingRequest.current;
    setRecordState('preparing');
    const hasPermission = await requestMicrophonePermission();
    if (recordingRequest.current !== request) return;
    if (!focusedRef.current || AppState.currentState !== 'active') {
      setRecordState(currentRecording ? 'result' : 'idle');
      return;
    }
    if (!hasPermission) {
      setRecordState(currentRecording ? 'result' : 'idle');
      Alert.alert('Không có quyền truy cập', 'Vui lòng cấp quyền Microphone trong cài đặt để tiếp tục.');
      return;
    }

    audio.stop();
    setRecordTime(0);
    recorder.current?.start(currentQ.id);
  };

  const stopRecording = () => {
    setRecordState('processing');
    recorder.current?.stop();
  };

  const handleRecorderEvent = (event: VoiceRecorderEvent) => {
    if (event.type === 'playback') {
      setPlayingRecordingId(event.playing ? event.questionId ?? null : null);
      return;
    }
    if (event.type === 'error') {
      if (event.operation === 'recording') setRecordState(currentRecording ? 'result' : 'idle');
      Alert.alert(event.operation === 'playback' ? 'Không thể nghe lại' : 'Không thể ghi âm', event.message || 'Vui lòng thử lại.');
      return;
    }
    if (event.questionId !== currentQ?.id) return;
    if (event.type === 'started') setRecordState('recording');
    if (event.type === 'progress') setRecordTime(Math.floor((event.durationMs || 0) / 1000));
    if (event.type === 'saving') setRecordState('processing');
    if (event.type === 'saved' && Number(event.bytes) > 0) {
      setRecordings(previous => ({ ...previous, [event.questionId!]: { durationMs: event.durationMs || 0, bytes: event.bytes!, status: 'pending' } }));
      setRecordState('result');
      void gradeRecording(event.questionId!);
    }
    if (event.type === 'cancelled') setRecordState(currentRecording ? 'result' : 'idle');
  };

  const selectQuestion = (index: number) => {
    recordingRequest.current++;
    recorder.current?.cancel();
    audio.stop();
    setCurrentIndex(index);
    setRecordTime(0);
    setRecordState(recordingsRef.current[questions[index].id] ? 'result' : 'idle');
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      selectQuestion(currentIndex + 1);
    } else {
      // Auto open submit modal when clicking next on the last question
      setShowSubmitModal(true);
    }
  };

  const handleConfirmSubmit = () => {
    if (isCapturing || isGrading) return;
    setShowSubmitModal(false);
    recorder.current?.cancel();
    const scores = Object.values(recordings).flatMap(recording => recording.assessment ? [recording.assessment.score] : []);
    onSubmit({
      score: scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length * 10) / 10 : null,
      recordedCount: answeredCount, gradedCount: scores.length, totalCount,
      assessmentStatus: scores.length === totalCount ? 'graded' : scores.length ? 'partial' : 'ungraded',
      durationInSeconds: studyTimer.takeSeconds(),
    });
  };

  const handleRetry = () => {
    if (currentQ) {
      assessmentRequests.current.get(currentQ.id)?.abort();
      assessmentRequests.current.delete(currentQ.id);
      setRecordings(previous => previous[currentQ.id]?.status === 'pending' ? { ...previous,
        [currentQ.id]: { ...previous[currentQ.id], status: 'error', error: 'Bạn có thể ghi âm lại hoặc thử chấm lại bản ghi này.' },
      } : previous);
    }
    recorder.current?.pausePlayback();
    setRecordState('idle');
    setRecordTime(0);
  };

  const gridItems = useMemo(() => questions.map((q, index) => ({
    id: q.id,
    index: index + 1,
    isAnswered: recordings[q.id] !== undefined,
    isCurrent: index === currentIndex,
  })), [questions, recordings, currentIndex]);

  if (isLoading) {
    return (
      <SafeAreaView onTouchStart={studyTimer.markActivity} onTouchMove={studyTimer.markActivity} style={{ flex: 1, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: ms(16), color: '#4B5563' }}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  if (questions.length === 0 || !currentQ) {
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
            <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>
              {answeredCount}/{totalCount} câu đã ghi âm · {gradedCount} đã chấm
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
          <TouchableOpacity disabled={isCapturing || isGrading} onPress={() => setShowSubmitModal(true)} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(6), paddingHorizontal: hs(14), paddingVertical: vs(7), opacity: isCapturing || isGrading ? 0.5 : 1 }}>
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
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={audio.playing ? 'Tạm dừng phát âm mẫu' : 'Nghe phát âm mẫu'}
                accessibilityState={{ busy: audio.loading, disabled: isCapturing }}
                disabled={isCapturing}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                onPress={() => { recorder.current?.pausePlayback(); audio.toggle(); }}
                style={{ marginLeft: hs(8) }}
              >
                <Svg height="24" viewBox="0 0 24 24" width="24">
                  <Path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke={audio.playing ? '#1E3A8A' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                  <Text style={{ fontSize: ms(14), color: '#6B7280' }}>Đang ghi âm... {recordTime}s / {MAX_VOICE_RECORDING_MS / 1000}s – bấm để dừng</Text>
                </View>
              </View>
            )}

            {/* State: PROCESSING */}
            {(recordState === 'preparing' || recordState === 'processing') && (
              <View style={{ alignItems: 'center', marginTop: vs(16) }}>
                <Text style={{ fontSize: ms(14), color: '#1E3A8A', fontWeight: '600' }}>{recordState === 'preparing' ? 'Đang mở micro...' : 'Đang lưu bản ghi...'}</Text>
              </View>
            )}

            {/* State: RESULT */}
            {recordState === 'result' && currentRecording && (
              <View style={{ alignItems: 'center', width: '100%', marginTop: vs(8) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(16) }}>
                  <Text accessibilityLiveRegion="polite" style={{ fontSize: ms(24), color: currentRecording.assessment ? '#1E3A8A' : '#4B5563', fontWeight: '700' }}>
                    {currentRecording.assessment ? `${currentRecording.assessment.score}/100` : currentRecording.status === 'pending' ? 'Đang chấm...' : 'Chưa chấm được'}
                  </Text>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={playingRecordingId === currentQ.id ? 'Tạm dừng bản ghi' : 'Nghe giọng bạn'}
                    onPress={() => { audio.stop(); recorder.current?.togglePlayback(currentQ.id); }}
                    style={{ marginLeft: hs(16), minWidth: ms(44), minHeight: ms(44), alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Svg height="14" viewBox="0 0 24 24" width="14">
                      <Path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke={playingRecordingId === currentQ.id ? '#1E3A8A' : '#6B7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ fontSize: ms(10), color: '#6B7280', fontWeight: '500' }}>Giọng bạn</Text>
                  </TouchableOpacity>
                </View>
                <SpeakingAssessmentFeedback
                  assessment={currentRecording.assessment}
                  pending={currentRecording.status === 'pending'}
                  error={currentRecording.error}
                  onRetry={() => { void gradeRecording(currentQ.id); }}
                />

                {/* Buttons */}
                <View style={{ flexDirection: 'row', gap: hs(12), width: '100%', marginTop: vs(8) }}>
                  <TouchableOpacity onPress={handleRetry} style={{ flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: ms(8), paddingVertical: vs(12), alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: hs(6) }}>
                    <Svg height="16" viewBox="0 0 24 24" width="16">
                      <Path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                    <Text style={{ color: '#374151', fontSize: ms(15), fontWeight: '700' }}>Đọc lại</Text>
                  </TouchableOpacity>

                  <TouchableOpacity disabled={currentIndex === totalCount - 1 && isGrading} onPress={handleNext} style={{ flex: 1, backgroundColor: '#1E3A8A', borderRadius: ms(8), paddingVertical: vs(12), alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: hs(6), opacity: currentIndex === totalCount - 1 && isGrading ? 0.5 : 1 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>{currentIndex < totalCount - 1 ? 'Tiếp theo' : 'Hoàn thành'}</Text>
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
      <SubmitConfirmModal
        visible={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
        remainingCount={remainingCount}
        remainingWarningText={`Bạn còn ${remainingCount} câu chưa ghi âm. ${gradedCount}/${totalCount} câu đã được chấm; điểm trung bình chỉ tính các câu đã chấm.`}
      />

      {/* Grid Modal */}
      <QuestionGridModal
        visible={showGridModal}
        onClose={() => setShowGridModal(false)}
        title="Danh sách bài học"
        items={gridItems}
        onSelectItem={(_item, index) => { setShowGridModal(false); selectQuestion(index); }}
      />
      <VoiceRecorder ref={recorder} onEvent={handleRecorderEvent} />
    </SafeAreaView>
  );
};
