import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { BackButton } from '@/components/atoms';
import { HskExamCard } from './HskExamCard';
import { ALL_HSK_EXAMS } from '../mockData';
import { ms, hs, vs } from '@/theme';

interface Props {
  hskLevel: number;
  onBack: () => void;
  onSelectExam?: (examId: string) => void;
}

export const HskExamListView = ({ hskLevel, onBack, onSelectExam }: Props) => {
  const fullList = ALL_HSK_EXAMS[hskLevel] || [];
  const [displayedCount, setDisplayedCount] = useState<number>(2);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 60;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    if (isCloseToBottom && !isLoadingMore && displayedCount < fullList.length) {
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
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: hs(16), paddingTop: vs(8), paddingBottom: vs(12) }}>
        <BackButton onPress={onBack} style={{ marginRight: hs(8), marginLeft: hs(-6) }} />
        <View>
          <Text style={{ fontSize: ms(22), fontWeight: '800', color: '#111827' }}>
            HSK {hskLevel} - Đề thi thử
          </Text>
          <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>
            Hiển thị {visibleExams.length}/{fullList.length} đề thi
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: hs(12), paddingTop: vs(8), paddingBottom: vs(80) }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {visibleExams.map((item) => (
            <HskExamCard
              key={item.id}
              item={item}
              hskLevel={hskLevel}
              onPress={() => onSelectExam?.(item.id)}
            />
          ))}
        </View>
        {displayedCount >= fullList.length && (
          <View style={{ alignItems: 'center', marginTop: vs(12), marginBottom: vs(16) }}>
            <Text style={{ color: '#9CA3AF', fontSize: ms(14), fontWeight: '500' }}>
              Đã hiển thị toàn bộ {fullList.length} đề thi
            </Text>
          </View>
        )}
      </ScrollView>

      {isLoadingMore && (
        <View style={{
          position: 'absolute', bottom: vs(24), alignSelf: 'center',
          backgroundColor: 'rgba(17, 24, 39, 0.92)', borderRadius: ms(24),
          flexDirection: 'row', alignItems: 'center', paddingHorizontal: hs(16), paddingVertical: vs(10),
        }}>
          <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: hs(8) }} />
          <Text style={{ color: '#FFFFFF', fontSize: ms(13), fontWeight: '700' }}>Đang tải thêm...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};
