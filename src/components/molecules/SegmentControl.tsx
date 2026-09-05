import React from 'react';
import { View, Text, TouchableOpacity, TouchableOpacityProps, ScrollView } from 'react-native';
import { useTheme } from '@/theme';

export type SegmentVariant = 'default' | 'primary';

interface SegmentControlProps extends Omit<TouchableOpacityProps, 'onPress'> {
  options: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  variant?: SegmentVariant;
}

const SegmentControl = ({
  options,
  selectedIndex,
  onChange,
  variant = 'default',
  style,
  ...props
}: SegmentControlProps) => {
  const { colors, fonts, layout } = useTheme();

  const isPrimary = variant === 'primary';

  // Container styling based on variant
  const containerStyle = isPrimary
    ? {
        backgroundColor: '#CFF3F0', // Light cyan (like fun/primaryLight)
        borderRadius: 36,
        padding: 6,
        gap: 16,
      }
    : {
        backgroundColor: '#FFFFFF',
        borderRadius: 30, // Pill shape
        borderWidth: 1,
        borderColor: colors.gray200,
        padding: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
      };

  const getOptionStyle = (isSelected: boolean) => {
    if (isPrimary) {
      return {
        backgroundColor: isSelected ? colors.primary : 'transparent',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 24,
      };
    }
    return {
      backgroundColor: isSelected ? '#33c9fc' : 'transparent', // Cyan for default
      borderRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 20,
    };
  };

  const getTextStyle = (isSelected: boolean) => {
    if (isPrimary) {
      return {
        color: isSelected ? '#FFFFFF' : '#000000',
      };
    }
    return {
      color: isSelected ? '#FFFFFF' : colors.gray800,
    };
  };

  return (
    <View style={style}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          layout.row,
          layout.itemsCenter,
          layout.justifyBetween,
          containerStyle,
          { flexGrow: 1 }
        ]}
        {...props}
      >
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onChange(index)}
              style={[
                layout.itemsCenter,
                layout.justifyCenter,
                isPrimary ? layout.flex_1 : {}, // Spread evenly in primary
                getOptionStyle(isSelected),
              ]}
            >
              <Text
                style={[
                  fonts.bold,
                  { fontSize: 16, textTransform: 'capitalize' },
                  getTextStyle(isSelected),
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SegmentControl;
