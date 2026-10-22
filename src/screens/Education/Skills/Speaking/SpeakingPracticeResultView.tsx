import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { SpeakingPracticeResult } from '../../types';
import { ms, hs, vs } from '@/theme';
import { PracticeResultCard } from '../components';

interface Props {
  result: SpeakingPracticeResult;
  onBackToSetup: () => void;
  onRetake: () => void;
}

export const SpeakingPracticeResultView = ({ result, onBackToSetup, onRetake }: Props) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <View style={{ paddingHorizontal: hs(16), paddingTop: vs(24), paddingBottom: vs(32) }}>
        <Text style={{ fontSize: ms(22), fontWeight: '800', color: '#111827', marginBottom: vs(8) }}>
          Luyện tập kỹ năng nói
        </Text>
        <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(22) }}>
          {result.gradedCount > 0
            ? 'Điểm trung bình được tính từ các câu đã chấm phát âm. Câu chưa ghi âm hoặc chấm lỗi chưa được tính điểm.'
            : 'Chưa có câu nào được chấm thành công. Bạn có thể luyện lại để nhận điểm phát âm.'}
        </Text>
      </View>

      <View style={{ paddingHorizontal: hs(16), alignItems: 'center', marginTop: vs(16) }}>
        <PracticeResultCard
          score={result.score ?? '—'}
          scoreSuffix={result.score !== null ? '/100' : ''}
          scoreColor={result.score !== null ? '#1E3A8A' : '#4B5563'}
          subtitle={`${result.recordedCount ?? 0}/${result.totalCount} câu đã ghi âm · ${result.gradedCount ?? 0}/${result.totalCount} câu đã chấm`}
          onBackToSetup={onBackToSetup}
          onRetake={onRetake}
        />
      </View>
    </SafeAreaView>
  );
};
