import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { hs, vs, ms } from '@/theme';

interface DailyProgressCardProps {
  userName: string;
  onStartLearning: () => void;
}

export const DailyProgressCard = ({ userName, onStartLearning }: DailyProgressCardProps) => {
  return (
    <View style={{ paddingHorizontal: hs(16), marginBottom: vs(16) }}>
      <View
        style={{
          backgroundColor: '#DFF3FF',
          borderRadius: ms(16),
          padding: ms(20),
        }}
      >
        <Text
          style={{
            color: '#111827',
            fontSize: ms(22),
            fontWeight: '700',
            marginBottom: vs(4),
          }}
        >
          Nâng cao mỗi ngày
        </Text>
        <Text
          style={{
            color: '#1F4086',
            fontSize: ms(22),
            fontWeight: '700',
            marginBottom: vs(10),
          }}
        >
          Tiến bộ không ngừng!
        </Text>
        <Text
          style={{
            color: '#111827',
            fontSize: ms(15),
            lineHeight: ms(28),
            marginBottom: vs(20),
          }}
        >
          Học tiếng Trung mỗi ngày giúp bạn mở ra những cơ hội mới, "{userName}".
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onStartLearning}
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            backgroundColor: '#1F4086',
            borderRadius: ms(999),
            justifyContent: 'center',
            paddingVertical: vs(16),
            width: '90%',
          }}
        >
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: ms(15),
                fontWeight: '700',
                letterSpacing: 0.5,
              }}
            >
              BẮT ĐẦU HỌC NGAY
            </Text>
            <Svg height="16" style={{ marginLeft: hs(6), marginTop: vs(1) }} viewBox="0 0 24 24" width="16">
              <Path
                d="M5 12h14M12 5l7 7-7 7"
                fill="none"
                stroke="#FFFFFF"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
            </Svg>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
