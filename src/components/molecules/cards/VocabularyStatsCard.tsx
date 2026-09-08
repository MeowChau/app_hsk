import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme, hs, vs, ms } from '@/theme';

interface VocabularyStatsCardProps {
  onPressDetail?: () => void;
}

export function VocabularyStatsCard({ onPressDetail }: VocabularyStatsCardProps) {
  const { layout } = useTheme();

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#F0F2F5',
        borderRadius: ms(16),
        borderWidth: 1,
        elevation: 1.5,
        padding: ms(16),
        shadowColor: '#000',
        shadowOffset: { width: hs(0), height: vs(2) },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      }}
    >
      <View style={[layout.row, layout.itemsCenter, { marginBottom: vs(14) }]}>
        <View style={{ backgroundColor: '#DFF0FE', borderRadius: ms(16), height: vs(32), width: hs(32) }} />
        <Text style={{ color: '#111827', fontSize: ms(14), fontWeight: '700', marginLeft: hs(10) }}>
          Thống kê học tập từ vựng
        </Text>
      </View>

      <View style={{ rowGap: vs(8) }}>
        <View style={[layout.row, { columnGap: hs(8) }]}>
          <View style={{ alignItems: 'center', backgroundColor: '#F5F6F8', borderRadius: ms(10), flex: 1, paddingVertical: vs(12) }}>
            <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '700' }}>"Số lượng"</Text>
            <Text style={{ color: '#6B7280', fontSize: ms(11), marginTop: vs(2) }}>Đã học</Text>
          </View>
          <View style={{ alignItems: 'center', backgroundColor: '#F5F6F8', borderRadius: ms(10), flex: 1, paddingVertical: vs(12) }}>
            <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '700' }}>"Số lượng"</Text>
            <Text style={{ color: '#6B7280', fontSize: ms(11), marginTop: vs(2) }}>Đã thuộc</Text>
          </View>
        </View>

        <View style={[layout.row, { columnGap: hs(8) }]}>
          <View style={{ alignItems: 'center', backgroundColor: '#F5F6F8', borderRadius: ms(10), flex: 1, paddingVertical: vs(12) }}>
            <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '700' }}>"Số lượng"</Text>
            <Text style={{ color: '#6B7280', fontSize: ms(11), marginTop: vs(2) }}>Đang học</Text>
          </View>
          <View style={{ alignItems: 'center', backgroundColor: '#F5F6F8', borderRadius: ms(10), flex: 1, paddingVertical: vs(12) }}>
            <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '700' }}>"Số lượng"</Text>
            <Text style={{ color: '#6B7280', fontSize: ms(11), marginTop: vs(2) }}>Cần ôn</Text>
          </View>
        </View>
      </View>

      {onPressDetail && (
        <TouchableOpacity
          activeOpacity={0.7}
          delayPressIn={0}
          onPress={onPressDetail}
          style={{ alignItems: 'center', backgroundColor: '#F5F6F8', borderRadius: ms(10), flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(12), paddingHorizontal: hs(14), paddingVertical: vs(10) }}
        >
          <Text style={{ color: '#374151', fontSize: ms(12), fontWeight: '600' }}>Xem thống kê chi tiết</Text>
          <Svg height="14" viewBox="0 0 24 24" width="14">
            <Path d="M9 5l7 7-7 7" fill="none" stroke="#6B7280" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </Svg>
        </TouchableOpacity>
      )}
    </View>
  );
}
