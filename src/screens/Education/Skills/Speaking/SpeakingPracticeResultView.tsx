import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SpeakingPracticeResult } from '../../types';
import { ms, hs, vs } from '@/theme';

interface Props {
  result: SpeakingPracticeResult;
  onBackToSetup: () => void;
  onRetake: () => void;
}

export const SpeakingPracticeResultView = ({ result, onBackToSetup, onRetake }: Props) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <View style={{ paddingHorizontal: hs(16), paddingTop: vs(24), paddingBottom: vs(32) }}>
        <Text style={{ fontSize: ms(20), fontWeight: '700', color: '#111827', marginBottom: vs(8) }}>
          Luyện tập kỹ năng nói
        </Text>
        <Text style={{ fontSize: ms(13), color: '#4B5563', lineHeight: vs(22) }}>
          Chọn một bài học, đọc to từng từ hoặc từng câu, hệ thống sẽ nghe và chấm phát âm của bạn theo từng chữ kèm nhận xét
        </Text>
      </View>

      <View style={{ paddingHorizontal: hs(16), alignItems: 'center', marginTop: vs(16) }}>
        
        <View style={{ 
          backgroundColor: '#FAF8F1', 
          width: '90%', 
          borderRadius: ms(8), 
          paddingVertical: vs(40), 
          paddingHorizontal: hs(16),
          alignItems: 'center',
          alignSelf: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{ fontSize: ms(64), fontWeight: '800', color: '#1E3A8A', marginBottom: vs(12) }}>
            {result.score}
          </Text>
          <Text style={{ fontSize: ms(14), color: '#4B5563', textAlign: 'center', fontWeight: '500', marginBottom: vs(32), lineHeight: vs(22) }}>
            Điểm phát âm trung bình · {result.passedCount}/{result.totalCount} mục đạt từ 75 điểm
          </Text>

          <View style={{ flexDirection: 'row', gap: hs(12) }}>
            <TouchableOpacity 
              onPress={onBackToSetup}
              style={{ 
                flex: 1, 
                borderWidth: 1, 
                borderColor: '#D1D5DB', 
                backgroundColor: '#FFFFFF',
                borderRadius: ms(8), 
                paddingVertical: vs(12), 
                alignItems: 'center', 
                flexDirection: 'row', 
                justifyContent: 'center', 
                gap: hs(6) 
              }}
            >
              <Svg height="14" viewBox="0 0 24 24" width="14">
                <Path d="M20 12H4M10 18l-6-6 6-6" fill="none" stroke="#4B5563" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={{ color: '#374151', fontSize: ms(13), fontWeight: '600' }}>Đổi học liệu</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={onRetake}
              style={{ 
                flex: 1, 
                backgroundColor: '#1E3A8A', 
                borderRadius: ms(8), 
                paddingVertical: vs(12), 
                alignItems: 'center', 
                flexDirection: 'row', 
                justifyContent: 'center', 
                gap: hs(6) 
              }}
            >
              <Svg height="14" viewBox="0 0 24 24" width="14">
                <Path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={{ color: '#FFFFFF', fontSize: ms(13), fontWeight: '700' }}>Luyện lại</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
};
