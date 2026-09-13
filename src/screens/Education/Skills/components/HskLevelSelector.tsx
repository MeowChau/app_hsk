import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { ms, hs, vs } from '@/theme';

export interface HskLevelSelectorProps {
  selectedHsk: number;
  onSelectHsk: (level: number) => void;
  levels?: number[];
  title?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const HskLevelSelector = ({
  selectedHsk,
  onSelectHsk,
  levels = [1, 2, 3],
  title = 'THEO KỸ NĂNG HSK',
  containerStyle,
}: HskLevelSelectorProps) => {
  return (
    <View style={containerStyle}>
      {title ? (
        <Text
          style={{
            fontSize: ms(16),
            fontWeight: '800',
            color: '#111827',
            marginBottom: vs(12),
          }}
        >
          {title}
        </Text>
      ) : null}

      <View style={{ flexDirection: 'row', gap: hs(12), marginBottom: vs(32) }}>
        {levels.map(level => {
          const isSelected = selectedHsk === level;
          return (
            <TouchableOpacity
              key={level}
              onPress={() => onSelectHsk(level)}
              style={{
                paddingVertical: vs(8),
                paddingHorizontal: hs(24),
                borderRadius: ms(20),
                backgroundColor: isSelected ? '#1E3A8A' : '#FFFFFF',
                borderWidth: 1,
                borderColor: isSelected ? '#1E3A8A' : '#E5E7EB',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: '700',
                  color: isSelected ? '#FFFFFF' : '#111827',
                }}
              >
                HSK {level}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default HskLevelSelector;
