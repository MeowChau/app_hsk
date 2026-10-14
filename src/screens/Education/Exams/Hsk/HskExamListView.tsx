import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, Alert } from 'react-native';
import { ScreenHeader } from '@/components/molecules';
import { HskExamCard } from './HskExamCard';
import { examsApi, ExamResponseMismatchError } from '@/services/exams/api';
import { transformBackendExamToApp } from '@/services/exams/transformers';
import { HskExam, ExamResult } from '../../types';
import { ms, hs, vs } from '@/theme';

interface Props {
  hskLevel: number;
  onBack: () => void;
  onSelectExam?: (examId: string, durationMin: number) => void;
  examResults?: Record<string, ExamResult>;
  onViewResult?: (examId: string) => void;
}

export const HskExamListView = ({ hskLevel, onBack, onSelectExam, examResults, onViewResult }: Props) => {
  const [fullList, setFullList] = useState<HskExam[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const generation = useRef(0);
  const requestInFlight = useRef(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [selectedExam, setSelectedExam] = useState<HskExam | null>(null);
  const [examTime, setExamTime] = useState<string>('');

  const loadPage = useCallback(async (nextPage: number, requestGeneration: number) => {
    requestInFlight.current = true;
    try {
      const response = await examsApi.getExams({ hskLevel, page: nextPage, limit: 10 });
      const exams = await Promise.all(response.data.map(async exam =>
        transformBackendExamToApp(await examsApi.getExamById(exam.id, exam))));
      if (generation.current !== requestGeneration) return;
      setFullList(previous => nextPage === 1 ? exams : [...previous, ...exams]);
      setPage(nextPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      if (generation.current === requestGeneration) Alert.alert('Không thể tải đề thi', error instanceof ExamResponseMismatchError ? error.message : 'Vui lòng kiểm tra kết nối và thử lại.');
    } finally {
      if (generation.current === requestGeneration) {
        requestInFlight.current = false;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    }
  }, [hskLevel]);

  useEffect(() => {
    const requestGeneration = ++generation.current;
    setFullList([]);
    setPage(0);
    setTotalPages(1);
    setSelectedExam(null);
    setIsLoading(true);
    setIsLoadingMore(false);
    void loadPage(1, requestGeneration);
    return () => { generation.current += 1; };
  }, [loadPage]);

  const handlePressExam = (item: HskExam) => {
    console.log('[HskExamListView] handlePressExam called:', item.id, item.name);
    if (item.unsupportedSkills?.length) {
      Alert.alert('Đề thi chưa được hỗ trợ', 'Đề này có kỹ năng Nói mà giao diện hiện tại chưa hỗ trợ.');
      return;
    }
    if (!item.questions?.length) {
      Alert.alert('Đề thi chưa có câu hỏi', 'Vui lòng chọn đề thi khác.');
      return;
    }
    setSelectedExam(item);
    setExamTime(item.timeLimit.toString());
    console.log('[HskExamListView] selectedExam set, Modal should open');
  };

  const handleStartExam = () => {
    console.log('[HskExamListView] handleStartExam called, selectedExam:', selectedExam?.id);
    if (selectedExam) {
      onSelectExam?.(selectedExam.id, parseInt(examTime) || selectedExam.timeLimit);
      setSelectedExam(null);
    }
  };

  const handleLoadMore = () => {
    if (!requestInFlight.current && page < totalPages) {
      setIsLoadingMore(true);
      void loadPage(page + 1, generation.current);
    }
  };

  const visibleExams = fullList;

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF9F6' }}>
        <ScreenHeader title={`HSK ${hskLevel} - Đề thi thử`} onBack={onBack} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1E3A8A" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FAF9F6' }}>
      <ScreenHeader title={`HSK ${hskLevel} - Đề thi thử`} onBack={onBack} />

      <FlatList
        data={visibleExams}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: vs(16) }}
        contentContainerStyle={{ paddingHorizontal: hs(12), paddingTop: vs(8), paddingBottom: vs(80) }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <HskExamCard 
            key={item.id} 
            item={item} 
            hskLevel={hskLevel}
            onPress={() => handlePressExam(item)} 
            result={examResults?.[item.id]}
            onHistoryPress={() => onViewResult?.(item.id)}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View style={{ alignItems: 'center', marginTop: vs(12), marginBottom: vs(16) }}>
            {page >= totalPages && (
              <Text style={{ color: '#9CA3AF', fontSize: ms(14), fontWeight: '500' }}>
                Đã hiển thị toàn bộ {fullList.length} đề thi
              </Text>
            )}
          </View>
        }
      />

      {isLoadingMore && (
        <View style={{
          position: 'absolute', bottom: vs(24), alignSelf: 'center',
          backgroundColor: 'rgba(17, 24, 39, 0.92)', borderRadius: ms(24),
          flexDirection: 'row', alignItems: 'center', paddingHorizontal: hs(16), paddingVertical: vs(10),
        }}>
          <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: hs(8) }} />
          <Text style={{ color: '#FFFFFF', fontSize: ms(14), fontWeight: '700' }}>Đang tải thêm...</Text>
        </View>
      )}

      {/* Time Selection Modal */}
      <Modal
        visible={!!selectedExam}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedExam(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => Keyboard.dismiss()} 
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
          >
            <TouchableOpacity 
              activeOpacity={1} 
              onPress={() => {}} 
              style={{
                width: '80%',
                backgroundColor: '#FAF9F6',
                borderRadius: ms(12),
                padding: ms(20),
                position: 'relative'
              }}
            >
              <TouchableOpacity
                style={{ position: 'absolute', top: vs(12), right: hs(16), padding: ms(4), zIndex: 10 }}
                onPress={() => setSelectedExam(null)}
              >
                <Text style={{ fontSize: ms(24), color: '#6B7280', fontWeight: 'bold' }}>×</Text>
              </TouchableOpacity>

              <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: vs(20), marginTop: vs(8) }}>
                {selectedExam?.name}
              </Text>

              <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#111827', marginBottom: vs(8) }}>
                Thời gian (phút)
              </Text>

              <TextInput
                style={{
                  borderWidth: 1.5,
                  borderColor: '#D1D5DB',
                  borderRadius: ms(8),
                  paddingHorizontal: hs(12),
                  paddingVertical: vs(10),
                  fontSize: ms(16),
                  color: '#111827',
                  fontWeight: '600',
                  marginBottom: vs(4),
                  backgroundColor: '#FFFFFF'
                }}
                keyboardType="numeric"
                value={examTime}
                onChangeText={setExamTime}
              />
              <Text style={{ fontSize: ms(14), color: '#6B7280', marginBottom: vs(24) }}>
                Từ 1 đến 180 phút
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: '#1E3A8A',
                  borderRadius: ms(8),
                  paddingVertical: vs(14),
                  alignItems: 'center'
                }}
                onPress={handleStartExam}
              >
                <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Bắt đầu làm bài</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};
