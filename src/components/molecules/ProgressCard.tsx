import React from 'react';
import { View, Text, TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

export type ProgressCardVariant = 'listening' | 'reading' | 'writing' | 'flashcards';

interface ProgressCardProps extends TouchableOpacityProps {
  title: string;
  progress: number; // 0 to 100
  variant: ProgressCardVariant;
}

const variantConfig = {
  listening: { bg: '#bdf2d0', progress: '#4CAF50' },
  reading: { bg: '#c5f1ef', progress: '#33c9fc' },
  writing: { bg: '#EAD1F9', progress: '#0E84F2' }, // Light purple
  flashcards: { bg: '#ffdae9', progress: '#F06292' },
};

const ProgressCard = ({ title, progress, variant, style, ...props }: ProgressCardProps) => {
  const { fonts, layout } = useTheme();
  const colors = variantConfig[variant];

  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <TouchableOpacity
      style={[
        layout.itemsCenter,
        layout.justifyCenter,
        {
          backgroundColor: colors.bg,
          borderRadius: 12,
          paddingVertical: 24,
          paddingHorizontal: 16,
          width: 160, // Fixed width to match visual proportions
          height: 120,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          fonts.bold,
          {
            fontSize: 20,
            color: '#000000',
            marginBottom: 16,
          },
        ]}
      >
        {title}
      </Text>

      {/* Progress Bar Track */}
      <View
        style={{
          width: '80%',
          height: 12,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: '#9E9E9E',
          backgroundColor: 'transparent',
          overflow: 'hidden',
          padding: 1, // To give a small gap inside the border
        }}
      >
        {/* Progress Bar Fill */}
        <View
          style={{
            height: '100%',
            width: `${clampedProgress}%`,
            backgroundColor: colors.progress,
            borderRadius: 4,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ProgressCard;
