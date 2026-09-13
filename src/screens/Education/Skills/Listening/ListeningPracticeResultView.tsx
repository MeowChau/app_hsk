import React from 'react';
import { Text, SafeAreaView, ScrollView } from 'react-native';
import { ms, hs, vs } from '@/theme';
import { PracticeResultCard } from '../components';

interface Props {
  score: number;
  correctCount: number;
  totalCount: number;
  onBackToSetup: () => void;
  onRetake: () => void;
}

export const ListeningPracticeResultView = ({ score, correctCount, totalCount, onBackToSetup, onRetake }: Props) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(24), paddingBottom: vs(100) }}>
        
        {/* Title */}
        <Text style={{ fontSize: ms(20), fontWeight: '700', color: '#111827', marginBottom: vs(8) }}>
          Luyện tập kỹ năng nghe
        </Text>
        <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(22), marginBottom: vs(32) }}>
          Luyện nghe theo 3 chế độ: Nghe chọn ảnh, nghe chọn từ vựng và nghe chọn True/False (thêm Nghe chọn các hình ảnh theo số lượng và bài nghe cho HSK 3)
        </Text>

        {/* Result Card */}
        <PracticeResultCard
          score={score}
          scoreSuffix="%"
          subtitle={`Đúng ${correctCount}/${totalCount} câu`}
          onBackToSetup={onBackToSetup}
          onRetake={onRetake}
        />

      </ScrollView>
    </SafeAreaView>
  );
};
