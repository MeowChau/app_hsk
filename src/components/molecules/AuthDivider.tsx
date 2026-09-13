import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { useTheme, hs, vs, ms } from '@/theme';

interface AuthDividerProps {
  text?: string;
  style?: StyleProp<ViewStyle>;
}

export const AuthDivider = ({ text = 'HOẶC', style }: AuthDividerProps) => {
  const { layout } = useTheme();

  return (
    <View
      style={[
        layout.row,
        layout.itemsCenter,
        layout.justifyCenter,
        { marginVertical: vs(28) },
        style,
      ]}
    >
      <View style={{ backgroundColor: '#2B2B2B', flex: 1, height: 1.5 }} />
      <Text
        style={{
          color: '#4D4D4D',
          fontSize: ms(14),
          fontWeight: '600',
          marginHorizontal: hs(16),
        }}
      >
        {text}
      </Text>
      <View style={{ backgroundColor: '#2B2B2B', flex: 1, height: 1.5 }} />
    </View>
  );
};

export default AuthDivider;
