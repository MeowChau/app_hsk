import React, { useState, useRef } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { ScreenHeader } from '@/components/molecules';
import { HskExamCard } from './HskExamCard';
import { ALL_HSK_EXAMS } from '../../mockData';
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
  const fullList = ALL_HSK_EXAMS[hskLevel] || [];
  const [displayedCount, setDisplayedCount] = useState<number>(10);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [selectedExam, setSelectedExam] = useState<HskExam | null>(null);
  const [examTime, setExamTime] = useState<string>('');

  const handlePressExam = (item: HskExam) => {
    console.log('[HskExamListView] handlePressExam called:', item.id, item.name);
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
    if (!isLoadingMore && displayedCount < fullList.length) {
      setIsLoadingMore(true);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);

      loadingTimeoutRef.current = setTimeout(() => {
        setDisplayedCount((prev) => {
          const remaining = fullList.length - prev;
          return remaining <= 10 ? fullList.length : prev + 10;
        });
        setIsLoadingMore(false);
      }, 700);
    }
  };

  const visibleExams = fullList.slice(0, displayedCount);

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
            {displayedCount >= fullList.length && (
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
