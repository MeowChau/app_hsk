import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useTheme } from '@/theme';

export type InputIconType = 'user' | 'mail' | 'lock';

interface InputFieldProps extends TextInputProps {
  iconType?: InputIconType;
}

const Icon = ({ type, color }: { type: InputIconType; color: string }) => {
  switch (type) {
    case 'user':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <Circle cx={12} cy={7} r={4} />
        </Svg>
      );
    case 'mail':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <Rect x={2} y={4} width={20} height={16} rx={2} />
          <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </Svg>
      );
    case 'lock':
      return (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <Rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
          <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </Svg>
      );
    default:
      return null;
  }
};

const InputField = ({ iconType, style, ...props }: InputFieldProps) => {
  const { colors, layout } = useTheme();

  return (
    <View
      style={[
        layout.row,
        layout.itemsCenter,
        {
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.gray200,
          paddingHorizontal: 16,
          height: 56,
          width: '100%',
        },
        style,
      ]}
    >
      {iconType && (
        <View style={{ marginRight: 12 }}>
          <Icon type={iconType} color={colors.gray800} />
        </View>
      )}
      <TextInput
        style={[
          layout.flex_1,
          {
            color: '#000000',
            fontSize: 14,
            height: '100%',
          },
        ]}
        placeholderTextColor={colors.gray800}
        {...props}
      />
    </View>
  );
};

export default InputField;
