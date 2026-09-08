import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { hs, vs, ms } from '@/theme';

interface MatchingProgressBarProps {
  isMatched?: boolean;
}

export const MatchingProgressBar = ({ isMatched = false }: MatchingProgressBarProps) => {
  const [seconds, setSeconds] = useState(0);
  const [trackWidth, setTrackWidth] = useState(140);
  const streamAnim = useRef(new Animated.Value(0)).current;

  // Timer: đếm giây đã chờ thực tế (0:01, 0:02...)
  useEffect(() => {
    if (isMatched) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isMatched]);

  // Hiệu ứng luồng quét radar 1 chiều từ trái sang phải liên tục (không giật lùi về trái)
  useEffect(() => {
    if (isMatched) return;
    Animated.loop(
      Animated.timing(streamAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      })
    ).start();
  }, [streamAnim, isMatched]);

  const beamWidth = trackWidth * 0.45;

  const translateX = streamAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-beamWidth, trackWidth + beamWidth * 0.2],
  });

  const opacity = streamAnim.interpolate({
    inputRange: [0, 0.15, 0.85, 1],
    outputRange: [0.3, 1, 1, 0.3],
  });

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View
      style={{
        width: '90%',
        height: vs(46),
        backgroundColor: isMatched ? '#064E3B' : '#1E1B4B',
        borderRadius: ms(23),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: hs(16),
        marginBottom: vs(40),
        borderWidth: 1.5,
        borderColor: isMatched ? '#10B981' : '#2E2A68',
      }}
    >
      {/* Rãnh chạy tiến độ bên trái */}
      <View
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        style={{
          flex: 1,
          height: vs(8),
          backgroundColor: isMatched ? '#047857' : '#29245E',
          borderRadius: ms(4),
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isMatched ? (
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#34D399',
              borderRadius: ms(4),
            }}
          />
        ) : (
          /* Dải sáng tím neon lướt đều 1 chiều từ trái sang phải */
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: beamWidth,
              backgroundColor: '#C4B5FD',
              borderRadius: ms(4),
              opacity,
              transform: [{ translateX }],
            }}
          />
        )}
      </View>

      {/* Text thời gian đã chờ bên phải */}
      <Text
        style={{
          color: isMatched ? '#A7F3D0' : '#C7D2FE',
          fontSize: ms(14),
          fontWeight: '700',
          marginLeft: hs(16),
        }}
      >
        {isMatched ? '✓ Sẵn sàng vào trận' : `Đã chờ ${formatTimer(seconds)}`}
      </Text>
    </View>
  );
};

export default MatchingProgressBar;
