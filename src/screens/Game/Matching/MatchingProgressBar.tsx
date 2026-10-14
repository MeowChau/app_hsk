import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { hs, vs, ms, useTheme } from '@/theme';

export const MatchingProgressBar = ({ isMatched = false, active = true, readyCount = 0 }: { isMatched?: boolean; active?: boolean; readyCount?: number }) => {
  const { colors } = useTheme();
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active || isMatched) return;
    const start = Date.now();
    const timer = setInterval(() => setSeconds(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [active, isMatched]);
  return (
    <View style={{ width: '100%', minHeight: vs(44), backgroundColor: isMatched ? '#ECFDF5' : colors.secondary, borderRadius: ms(999), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: hs(8), paddingHorizontal: hs(16), paddingVertical: vs(10), marginBottom: vs(24) }}>
      {active && !isMatched ? <ActivityIndicator size="small" color="#1F4086" /> : null}
      <Text accessibilityLiveRegion={isMatched ? 'polite' : 'none'} style={{ color: isMatched ? '#047857' : colors.gray400, fontSize: ms(14), fontWeight: '600', fontVariant: ['tabular-nums'], textAlign: 'center', flexShrink: 1 }}>
        {isMatched ? readyCount + '/2 người đã sẵn sàng' : active ? 'Đã chờ ' + Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0') : 'Đã dừng tìm trận'}
      </Text>
    </View>
  );
};

export default MatchingProgressBar;
