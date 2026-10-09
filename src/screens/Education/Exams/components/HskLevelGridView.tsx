import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ms, hs, vs } from '@/theme';

const HSK_LEVELS = [
  { level: 1, title: 'HSK 1', subtitle: 'Sơ cấp' },
  { level: 2, title: 'HSK 2', subtitle: 'Sơ cấp' },
  { level: 3, title: 'HSK 3', subtitle: 'Trung cấp' },
  { level: 4, title: 'HSK 4', subtitle: 'Trung cấp' },
  { level: 5, title: 'HSK 5', subtitle: 'Cao cấp' },
  { level: 6, title: 'HSK 6', subtitle: 'Cao cấp' },
];

interface Props {
  onSelectLevel: (level: number) => void;
}

export const HskLevelGridView = ({ onSelectLevel }: Props) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: hs(16) }}>
      {HSK_LEVELS.map((hsk) => (
        <TouchableOpacity
          key={hsk.level}
          onPress={() => onSelectLevel(hsk.level)}
          style={{
            width: '48%',
            backgroundColor: '#F3F4F6',
            borderRadius: ms(8),
            paddingVertical: vs(20),
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: vs(16),
          }}
        >
          <Text style={{ fontSize: ms(16), fontWeight: '700', color: '#111827', marginBottom: vs(4) }}>
            {hsk.title}
          </Text>
          <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>
            {hsk.subtitle}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
