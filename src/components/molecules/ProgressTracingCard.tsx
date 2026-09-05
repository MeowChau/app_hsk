import React from 'react';
import { View, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useTheme } from '@/theme';

export type TracingCardVariant = 'reading' | 'writing' | 'flashcards' | 'listening';

interface ProgressTracingCardProps extends TouchableOpacityProps {
  title: string;
  subtitle: string;
  variant: TracingCardVariant;
}

const variantConfig = {
  reading: { bg: '#c5f1ef', title: '#00B4D8' },
  writing: { bg: '#ffdae9', title: '#FF4081' },
  flashcards: { bg: '#EAD1F9', title: '#7B61FF' },
  listening: { bg: '#bdf2d0', title: '#4CAF50' },
};

const ProgressTracingCard = ({ title, subtitle, variant, style, ...props }: ProgressTracingCardProps) => {
  const { fonts, layout } = useTheme();
  const colors = variantConfig[variant];

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
          width: 140, // Square-ish proportion
          height: 140,
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
            color: colors.title,
            marginBottom: 8,
            textTransform: 'capitalize',
          },
        ]}
      >
        {title}
      </Text>
      
      <Text
        style={{
          fontSize: 14,
          color: '#757575',
          textAlign: 'center',
        }}
      >
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
};

export default ProgressTracingCard;
