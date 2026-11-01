import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard, ScrollView, useWindowDimensions } from 'react-native';
import { AppAlert } from '@/services/feedback/appAlert';
import { ScreenHeader } from '@/components/molecules';
import { HskExamCard } from './HskExamCard';
import { examsApi, ExamResponseMismatchError } from '@/services/exams/api';
import { transformBackendExamToApp } from '@/services/exams/transformers';
import { HskExam, ExamResult } from '../../types';
import { ms, hs, vs, useTheme, useControlSizes } from '@/theme';
import InputError from '@/components/atoms/InputError';
import IconButton from '@/components/atoms/IconButton';
import PopupCloseIcon from '@/components/atoms/PopupCloseIcon';

interface Props {
  hskLevel: number;
  onBack: () => void;
  onSelectExam?: (examId: string, durationMin: number) => void;
  examResults?: Record<string, ExamResult>;
  onViewResult?: (examId: string) => void;
}

export const HskExamListView = ({ hskLevel, onBack, onSelectExam, examResults, onViewResult }: Props) => {
  const { colors } = useTheme();
  const { fontScale } = useWindowDimensions();
  const controlSizes = useControlSizes();
  // Align the icon with the first line, regardless of how many lines the title wraps to.
  const closeButtonTop = ms(24) + (ms(26) * fontScale - controlSizes.touchTarget) / 2;
  const [fullList, setFullList] = useState<HskExam[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const generation = useRef(0);
  const requestInFlight = useRef(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [selectedExam, setSelectedExam] = useState<HskExam | null>(null);
  const [examTime, setExamTime] = useState<string>('');
  const [examTimeError, setExamTimeError] = useState<string>();

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
      if (generation.current === requestGeneration) AppAlert.error('Không thể tải đề thi', error instanceof ExamResponseMismatchError ? error.message : 'Vui lòng kiểm tra kết nối và thử lại.');
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
      AppAlert.warning('Đề thi chưa được hỗ trợ', 'Đề này có kỹ năng Nói mà giao diện hiện tại chưa hỗ trợ.');
      return;
    }
    if (!item.questions?.length) {
      AppAlert.warning('Đề thi chưa có câu hỏi', 'Vui lòng chọn đề thi khác.');
      return;
    }
    setSelectedExam(item);
    setExamTimeError(undefined);
    setExamTime(item.timeLimit.toString());
    console.log('[HskExamListView] selectedExam set, Modal should open');
  };

  const handleStartExam = () => {
    console.log('[HskExamListView] handleStartExam called, selectedExam:', selectedExam?.id);
    if (selectedExam) {
      const duration = Number(examTime);
      if (!/^\d+$/.test(examTime) || !Number.isInteger(duration) || duration < 1 || duration > 180) {
        setExamTimeError('Vui lòng nhập thời gian từ 1 đến 180 phút.');
        return;
      }
      onSelectExam?.(selectedExam.id, duration);
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
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
        <ScreenHeader title={`HSK ${hskLevel} - Đề thi thử`} onBack={onBack} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1E3A8A" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
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
                maxWidth: 420,
                maxHeight: '90%',
                backgroundColor: colors.dialogBackground,
                borderRadius: ms(16),
                position: 'relative'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: ms(56), paddingVertical: ms(24) }}>
                <Text
                  accessibilityRole="header"
                  textBreakStrategy="balanced"
                  lineBreakStrategyIOS="standard"
                  style={{ flex: 1, minWidth: 0, fontSize: ms(18), lineHeight: ms(26), includeFontPadding: false, fontWeight: '700', color: colors.dialogText, textAlign: 'center' }}
                >
                  {selectedExam?.name}
                </Text>
                <IconButton
                  accessibilityLabel="Đóng chọn thời gian làm bài"
                  style={{ position: 'absolute', top: closeButtonTop, right: ms(8) }}
                  onPress={() => { Keyboard.dismiss(); setSelectedExam(null); }}
                  renderIcon={() => <PopupCloseIcon />}
                />
              </View>
              <ScrollView
                bounces={false}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                style={{ flexGrow: 0, flexShrink: 1 }}
                contentContainerStyle={{ paddingHorizontal: ms(24), paddingBottom: ms(28) }}
              >
              <Text style={{ fontSize: ms(14), fontWeight: '700', color: colors.dialogText, marginBottom: vs(8) }}>
                Thời gian (phút)
              </Text>

              <TextInput
                style={{
                  borderWidth: 1.5,
                  borderColor: examTimeError ? colors.red500 : colors.dialogBorder,
                  borderRadius: ms(8),
                  paddingHorizontal: hs(12),
                  paddingVertical: vs(10),
                  fontSize: ms(16),
                  color: colors.dialogText,
                  fontWeight: '600',
                  marginBottom: vs(4),
                  backgroundColor: colors.dialogBackground
                }}
                keyboardType="numeric"
                value={examTime}
                onChangeText={value => { setExamTime(value); setExamTimeError(undefined); }}
              />
              <InputError message={examTimeError} />
              <Text style={{ fontSize: ms(14), color: colors.dialogText, marginBottom: vs(28) }}>
                Từ 1 đến 180 phút
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: colors.dialogAction,
                  borderRadius: ms(8),
                  paddingVertical: vs(14),
                  alignItems: 'center'
                }}
                onPress={handleStartExam}
              >
                <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Bắt đầu làm bài</Text>
              </TouchableOpacity>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};
