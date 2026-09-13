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
          Chọn một bài học, đọc to từng từ hoặc từng câu, hệ thống sẽ nghe và chấm phát âm của bạn theo từng chữ kèm nhận xét
        </Text>
      </View>

      <View style={{ paddingHorizontal: hs(16), alignItems: 'center', marginTop: vs(16) }}>
        <PracticeResultCard
          score={result.score}
          subtitle={`Điểm phát âm trung bình · ${result.passedCount}/${result.totalCount} mục đạt từ 75 điểm`}
          onBackToSetup={onBackToSetup}
          onRetake={onRetake}
        />
      </View>
    </SafeAreaView>
  );
};
