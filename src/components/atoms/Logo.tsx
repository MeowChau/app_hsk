import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/theme';

interface LogoProps {
  variant?: 'primary' | 'light';
}

const Logo = ({ variant = 'primary' }: LogoProps) => {
  const { colors, layout } = useTheme();

  const isPrimary = variant === 'primary';
  const circleColor = isPrimary ? colors.primary : colors.primaryLight;
  const hskColor = isPrimary ? '#FFFFFF' : '#000000';
  const mastaColor = '#000000';

  return (
    <View style={[layout.row, layout.itemsCenter]}>
      <View
        style={[
          layout.itemsCenter,
          layout.justifyCenter,
          {
            backgroundColor: circleColor,
            width: 60,
            height: 60,
            borderRadius: 30,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
          },
        ]}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: hskColor,
          }}
        >
          hsk
        </Text>
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: mastaColor,
          marginLeft: 8,
        }}
      >
        masta
      </Text>
    </View>
  );
};

export default Logo;
