import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ms, hs, vs } from '@/theme';

interface Props {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
}

export const EducationSegment = ({ options, selectedIndex, onChange }: Props) => {
  return (
    <View style={{ paddingHorizontal: hs(16), marginBottom: vs(24) }}>
      <View style={{
        flexDirection: 'row',
        backgroundColor: '#E5DECD',
        borderRadius: ms(30),
        padding: ms(4),
      }}>
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onChange(index)}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: vs(10),
                backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                borderRadius: ms(24),
              }}
            >
              <Text style={{
                fontSize: ms(16),
                fontWeight: isSelected ? '700' : '600',
                color: isSelected ? '#111827' : '#6B7280'
              }}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
