import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { HskExam } from '../types';
import { ms, hs, vs } from '@/theme';

interface Props {
  item: HskExam;
  hskLevel: number;
  onPress: () => void;
}

export const HskExamCard = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: ms(4),
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: ms(12),
        marginBottom: vs(12),
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(24) }}>
        <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#111827', flex: 1 }} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={{ fontSize: ms(12), color: '#EF4444', fontWeight: '600', marginLeft: hs(4) }}>
          {item.timeLimit} phút
        </Text>
      </View>
      <View style={{ gap: vs(4) }}>
        <Text style={{ fontSize: ms(12), color: '#4B5563' }}>
          🎧 {item.listeningCount} câu nghe
        </Text>
        <Text style={{ fontSize: ms(12), color: '#4B5563' }}>
          📖 {item.readingCount} câu đọc
        </Text>
      </View>
    </TouchableOpacity>
  );
};
