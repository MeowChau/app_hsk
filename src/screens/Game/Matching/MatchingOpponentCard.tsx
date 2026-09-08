import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { hs, vs, ms } from '@/theme';

interface MatchingOpponentCardProps {
  isMatched?: boolean;
  opponentName?: string;
}

export const MatchingOpponentCard = ({
  isMatched = false,
  opponentName = 'Hạ Ngân',
}: MatchingOpponentCardProps) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isMatched) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [spinAnim, isMatched]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (isMatched) {
    // Thẻ đối thủ khi đã ghép trận thành công (chuẩn theo Figma)
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
        {/* Avatar Đối thủ */}
        <View
          style={{
            width: hs(54),
            height: vs(54),
            borderRadius: ms(27),
            backgroundColor: '#0E7490',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: vs(8),
            borderWidth: 1.5,
            borderColor: '#22D3EE',
          }}
        >
          <Text
            style={{
              fontSize: ms(22),
              fontWeight: '900',
              color: '#FFFFFF',
            }}
          >
            H
          </Text>
        </View>

        {/* Tên Đối thủ */}
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
          {opponentName}
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
  }

  // Thẻ đối thủ lúc đang dò tìm
  return (
    <View
      style={{
        width: hs(130),
        height: vs(160),
        backgroundColor: '#1E1B4B',
        borderColor: '#312E81',
        borderWidth: 1.5,
        borderRadius: ms(16),
        alignItems: 'center',
        justifyContent: 'center',
        padding: ms(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 3,
      }}
    >
      {/* Avatar Đối thủ (?) */}
      <View
        style={{
          width: hs(54),
          height: vs(54),
          borderRadius: ms(27),
          backgroundColor: '#2E2A72',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: vs(8),
          borderWidth: 1.5,
          borderColor: '#4338CA',
        }}
      >
        <Text
          style={{
            fontSize: ms(24),
            fontWeight: '800',
            color: '#C7D2FE',
          }}
        >
          ?
        </Text>
      </View>

      {/* Tên: Đối thủ */}
      <Text
        style={{
          fontSize: ms(13),
          fontWeight: '700',
          color: '#E0E7FF',
          marginBottom: vs(10),
          textAlign: 'center',
        }}
      >
        Đối thủ
      </Text>

      {/* Badge: Đang dò... */}
      <View
        style={{
          backgroundColor: '#131131',
          borderColor: '#3730A3',
          borderWidth: 1,
          borderRadius: ms(6),
          paddingHorizontal: hs(8),
          paddingVertical: vs(5),
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={{
            marginRight: hs(4),
            transform: [{ rotate: spinInterpolate }],
          }}
        >
          {/* Lucide loader icon */}
          <Svg height="13" viewBox="0 0 24 24" width="13" fill="none">
            <Path d="M12 2v4" stroke="#818CF8" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="m16.2 7.8 2.9-2.9" stroke="#818CF8" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M18 12h4" stroke="#818CF8" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="m16.2 16.2 2.9 2.9" stroke="#818CF8" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M12 18v4" stroke="#818CF8" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="m4.9 19.1 2.9-2.9" stroke="#818CF8" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M2 12h4" stroke="#818CF8" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="m4.9 4.9 2.9 2.9" stroke="#818CF8" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Animated.View>
        <Text
          style={{
            color: '#818CF8',
            fontSize: ms(10),
            fontWeight: '700',
          }}
        >
          Đang dò...
        </Text>
      </View>
    </View>
  );
};

export default MatchingOpponentCard;
