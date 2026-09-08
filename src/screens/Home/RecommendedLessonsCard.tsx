import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme, hs, vs, ms } from '@/theme';

interface RecommendedLessonsCardProps {
  onSeeAll: () => void;
}

export const RecommendedLessonsCard = ({ onSeeAll }: RecommendedLessonsCardProps) => {
  const { layout } = useTheme();

  return (
    <View style={{ paddingHorizontal: hs(16), marginBottom: vs(20) }}>
      <View style={[layout.row, layout.justifyBetween, layout.itemsCenter, { marginBottom: vs(12) }]}>
        <View style={[layout.row, layout.itemsCenter]}>
          <View style={{ backgroundColor: '#DFF0FE', borderRadius: ms(21), height: vs(42), width: hs(42) }} />
          <Text style={{ color: '#111827', fontSize: ms(16), fontWeight: '700', marginLeft: hs(12) }}>
            Bài học đề xuất cho bạn
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={onSeeAll}>
          <Text style={{ color: '#1F4086', fontSize: ms(16), fontWeight: '700' }}>Xem tất cả {'>'}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ rowGap: vs(10) }}>
        <View style={[layout.row, { columnGap: hs(10) }]}>
          <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: '#F0F7FF', borderColor: '#D4E8FC', borderRadius: ms(14), borderWidth: 1, flex: 1, height: vs(96) }} />
          <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: '#F0F7FF', borderColor: '#D4E8FC', borderRadius: ms(14), borderWidth: 1, flex: 1, height: vs(96) }} />
        </View>
        <View style={[layout.row, { columnGap: hs(10) }]}>
          <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: '#F0F7FF', borderColor: '#D4E8FC', borderRadius: ms(14), borderWidth: 1, flex: 1, height: vs(96) }} />
          <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: '#F0F7FF', borderColor: '#D4E8FC', borderRadius: ms(14), borderWidth: 1, flex: 1, height: vs(96) }} />
        </View>
      </View>
    </View>
  );
};
