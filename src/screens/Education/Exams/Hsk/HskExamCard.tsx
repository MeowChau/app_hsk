import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { ExamResult, HskExam } from '../../types';
import { ms, hs, vs } from '@/theme';

interface Props {
  item: HskExam;
  hskLevel: number;
  onPress: () => void;
  result?: ExamResult;
  onHistoryPress?: () => void;
}

export const HskExamCard = ({ item, onPress, result, onHistoryPress }: Props) => {
  const indexStr = item.name.split('Đề ')[1] || '1';
  const watermarkText = indexStr.padStart(2, '0');
  const isCompleted = !!result;

  const handleCardPress = () => {
    console.log('[HskExamCard] Card pressed:', item.id, item.name);
    onPress();
  };

  const handleHistoryPress = () => {
    console.log('[HskExamCard] History pressed:', item.id);
    onHistoryPress?.();
  };

  return (
    <View style={{ width: '48%', marginBottom: vs(16) }}>
      {/* Main Card - ấn vào đây mở popup */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleCardPress}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: ms(8),
          borderWidth: 1.5,
          borderColor: isCompleted ? '#22C55E' : '#111827',
          padding: ms(14),
          minHeight: vs(160),
          justifyContent: 'space-between',
        }}
      >
        {/* Top Row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827', flex: 1, paddingRight: hs(8) }} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: ms(14), color: '#EF4444', fontWeight: '700', marginRight: hs(4) }}>
              {item.timeLimit} phút
            </Text>
            <Svg height="14" viewBox="0 0 24 24" width="14">
              <Circle cx="12" cy="12" r="10" fill="none" stroke="#EF4444" strokeWidth={2} />
              <Path d="M12 6v6l3 2" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </View>

        {/* Bottom Info */}
        <View style={{ gap: vs(8), marginTop: vs(24) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginRight: hs(8) }}>
              <Path d="M3 18v-6a9 9 0 0 1 18 0v6" fill="none" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M21 19a2 2 0 0 1-2 2h-1v-4h3v2zM3 19a2 2 0 0 0 2 2h1v-4H3v2z" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </Svg>
            <Text style={{ fontSize: ms(14), color: '#374151', fontWeight: '600' }}>
              {item.listeningCount} câu nghe
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginRight: hs(8) }}>
              <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="none" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="none" stroke="#EF4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={{ fontSize: ms(14), color: '#374151', fontWeight: '600' }}>
              {item.readingCount} câu đọc
            </Text>
          </View>
        </View>

        {/* Watermark */}
        <Text
          style={{
            position: 'absolute',
            bottom: vs(-16),
            right: hs(-4),
            fontSize: ms(80),
            fontWeight: '900',
            color: 'rgba(239, 68, 68, 0.08)',
          }}
        >
          {watermarkText}
        </Text>
      </TouchableOpacity>

      {/* History Tag - hoàn toàn tách biệt */}
      {isCompleted && result && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleHistoryPress}
          style={{
            backgroundColor: '#F0FDF4',
            borderRadius: ms(8),
            padding: ms(8),
            marginTop: vs(6),
            borderWidth: 1,
            borderColor: '#D1FAE5',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Svg height="14" viewBox="0 0 24 24" width="14">
              <Circle cx="12" cy="12" r="10" fill="none" stroke="#059669" strokeWidth="2" />
              <Path d="M8 12l3 3 5-5" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={{ fontSize: ms(12), color: '#059669', fontWeight: '700', marginLeft: hs(4) }}>Lịch sử</Text>
          </View>
          <Text style={{ fontSize: ms(14), color: '#DC2626', fontWeight: '800' }}>
            {result.score}%
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
