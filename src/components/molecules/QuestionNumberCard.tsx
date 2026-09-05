import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { useTheme } from '@/theme';

export type QuestionStatus = 'default' | 'active' | 'correct' | 'incorrect';

interface QuestionNumberCardProps extends TouchableOpacityProps {
  number: number;
  status?: QuestionStatus;
}

const QuestionNumberCard = ({
  number,
  status = 'default',
  style,
  ...props
}: QuestionNumberCardProps) => {
  const { fonts, layout, colors } = useTheme();

  // Define colors based on status
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return {
          borderColor: colors.primary, // Blue
          borderWidth: 2,
          textColor: colors.primary,
        };
      case 'correct':
        return {
          borderColor: '#4CAF50', // Green
          borderWidth: 2,
          textColor: '#4CAF50',
        };
      case 'incorrect':
        return {
          borderColor: '#F44336', // Red
          borderWidth: 2,
          textColor: '#F44336',
        };
      case 'default':
      default:
        return {
          borderColor: colors.gray200, // Light gray
          borderWidth: 1,
          textColor: colors.gray800, // Dark text
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <TouchableOpacity
      style={[
        layout.itemsCenter,
        layout.justifyCenter,
        {
          width: 64,
          height: 64,
          backgroundColor: '#FFFFFF',
          borderColor: statusStyles.borderColor,
          borderWidth: statusStyles.borderWidth,
          borderRadius: 0, // Square corners as per design
        },
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          fonts.bold,
          {
            fontSize: 18,
            color: statusStyles.textColor,
          },
        ]}
      >
        {number}
      </Text>
    </TouchableOpacity>
  );
};

export default QuestionNumberCard;
