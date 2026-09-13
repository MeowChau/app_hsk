import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ms, hs, vs } from '@/theme';

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
        <Text style={{ fontSize: ms(13), color: '#4B5563', lineHeight: vs(22), marginBottom: vs(32) }}>
          Luyện nghe theo 3 chế độ: Nghe chọn ảnh, nghe chọn từ vựng và nghe chọn True/False (thêm Nghe chọn các hình ảnh theo số lượng và bài nghe cho HSK 3)
        </Text>

        {/* Result Card */}
        <View style={{
          backgroundColor: '#FAF8F1',
          borderRadius: ms(8),
          paddingVertical: vs(40),
          paddingHorizontal: hs(16),
          alignItems: 'center',
          alignSelf: 'center',
          width: '90%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{ fontSize: ms(48), fontWeight: '800', color: '#1E3A8A', marginBottom: vs(8) }}>
            {score}%
          </Text>
          <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500', marginBottom: vs(24) }}>
            Đúng {correctCount}/{totalCount} câu
          </Text>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: hs(12) }}>
            <TouchableOpacity
              onPress={onBackToSetup}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: hs(6),
                backgroundColor: '#FFFFFF',
                borderWidth: 1, borderColor: '#D1D5DB',
                borderRadius: ms(8),
                paddingVertical: vs(10),
                paddingHorizontal: hs(16),
              }}
            >
              <Svg height="14" viewBox="0 0 24 24" width="14">
                <Path d="M20 12H4M10 18l-6-6 6-6" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={{ color: '#374151', fontSize: ms(13), fontWeight: '600' }}>Đổi học liệu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onRetake}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: hs(6),
                backgroundColor: '#1E3A8A',
                borderRadius: ms(8),
                paddingVertical: vs(10),
                paddingHorizontal: hs(16),
              }}
            >
              <Svg height="14" viewBox="0 0 24 24" width="14">
                <Path d="M2 12a10 10 0 1 0 10-10v3M2 12h3M2 12V9" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={{ color: '#FFFFFF', fontSize: ms(13), fontWeight: '600' }}>Làm lại</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};
