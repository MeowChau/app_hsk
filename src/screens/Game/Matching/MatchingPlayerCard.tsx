import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { hs, vs, ms } from '@/theme';

interface MatchingPlayerCardProps {
  userName: string;
}

export const MatchingPlayerCard = ({ userName }: MatchingPlayerCardProps) => {
  return (
    <View
      style={{
        width: hs(130),
        height: vs(160),
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
        borderWidth: 1.5,
        borderRadius: ms(16),
        alignItems: 'center',
        justifyContent: 'center',
        padding: ms(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Avatar Người dùng */}
      <View
        style={{
          width: hs(54),
          height: vs(54),
          borderRadius: ms(27),
          backgroundColor: '#F3E8FF',
          overflow: 'hidden',
          marginBottom: vs(8),
        }}
      >
        <Svg height="54" viewBox="0 0 100 100" width="54">
          <Rect fill="#FDF4FF" height="100" width="100" />
          <Circle cx="50" cy="46" fill="#3E2723" r="28" />
          <Circle cx="50" cy="50" fill="#FFDFC4" r="20" />
          <Path
            d="M32 40c4-10 14-16 26-14 8 2 14 8 16 16-4-2-9-2-14 1-5 3-10 3-14-1-6-1-10 0-14-2z"
            fill="#2D1B16"
          />
          <Circle cx="44" cy="50" fill="#2D1B16" r="3.5" />
          <Circle cx="56" cy="50" fill="#2D1B16" r="3.5" />
          <Path d="M26 88c2-12 12-18 24-18s22 6 24 18z" fill="#374151" />
        </Svg>
      </View>

      {/* Tên Người dùng */}
      <Text
        numberOfLines={1}
        style={{
          fontSize: ms(13),
          fontWeight: '700',
          color: '#111827',
          marginBottom: vs(10),
          textAlign: 'center',
        }}
      >
        {userName}
      </Text>

      {/* Badge Sẵn sàng */}
      <View
        style={{
          backgroundColor: '#1E293B',
          borderRadius: ms(6),
          paddingHorizontal: hs(10),
          paddingVertical: vs(5),
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#34D399',
            fontSize: ms(11),
            fontWeight: '800',
            marginRight: hs(4),
          }}
        >
          ✓
        </Text>
        <Text
          style={{
            color: '#34D399',
            fontSize: ms(11),
            fontWeight: '700',
          }}
        >
          Sẵn sàng
        </Text>
      </View>
    </View>
  );
};

export default MatchingPlayerCard;
