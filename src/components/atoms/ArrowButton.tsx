import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, Text } from 'react-native';
import { useTheme } from '@/theme';

interface ArrowButtonProps extends TouchableOpacityProps {
  direction?: 'left' | 'right';
}

const ArrowButton = ({ direction = 'left', style, ...props }: ArrowButtonProps) => {
  const { colors, layout } = useTheme();

  return (
    <TouchableOpacity
      style={[
        layout.itemsCenter,
        layout.justifyCenter,
        {
          width: 179,
          height: 72,
          backgroundColor: '#FFFFFF',
          borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        style,
      ]}
      {...props}
    >
      <Text
        style={{
          color: colors.primaryLight,
          fontSize: 40,
          fontWeight: '600',
          lineHeight: 48,
          transform: [{ translateY: -2 }], // visual centering for angle brackets
        }}
      >
        {direction === 'left' ? '〈' : '〉'}
      </Text>
    </TouchableOpacity>
  );
};

export default ArrowButton;
