import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { ms, vs } from '@/theme';

interface Props {
  title: string;
  isSelected?: boolean;
  onPress: () => void;
}

export const SkillBoxCard = ({ title, isSelected, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '48%',
        backgroundColor: '#F3F4F6', // Light gray background
        borderRadius: ms(8),
        paddingVertical: vs(24),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: vs(16),
        borderWidth: isSelected ? 2 : 0,
        borderColor: isSelected ? '#111827' : 'transparent',
      }}
    >
      <Text style={{ fontSize: ms(16), fontWeight: '700', color: '#111827' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
