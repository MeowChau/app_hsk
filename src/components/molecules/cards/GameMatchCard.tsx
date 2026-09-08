import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { hs, vs, ms } from '@/theme';

interface GameMatchCardProps {
  onSearch?: () => void;
}

export const GameMatchCard = ({ onSearch }: GameMatchCardProps) => {
  return (
    <View style={{ alignItems: 'center', marginBottom: vs(24) }}>
      <Text style={{ fontSize: ms(22), fontWeight: '800', color: '#111827', marginBottom: vs(20) }}>
        Bạn đã sẵn sàng?
      </Text>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onSearch}
        style={{
          backgroundColor: '#1F4086',
          borderRadius: ms(999),
          paddingHorizontal: hs(40),
          paddingVertical: vs(16),
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: ms(15), fontWeight: '700', marginRight: hs(8), letterSpacing: 0.5 }}>
          BẮT ĐẦU TÌM NGƯỜI
        </Text>
        <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginTop: vs(1) }}>
          <Path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};
