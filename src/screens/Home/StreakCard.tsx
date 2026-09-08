import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme, hs, vs, ms } from '@/theme';

interface StreakCardProps {
  days?: Array<{ label: string; active: boolean }>;
  streakCount?: string;
  recordCount?: string;
  onCheckIn?: () => void;
}

const DEFAULT_DAYS = [
  { label: 'T2', active: true },
  { label: 'T3', active: false },
  { label: 'T4', active: false },
  { label: 'T5', active: false },
  { label: 'T6', active: false },
  { label: 'T7', active: false },
  { label: 'CN', active: false },
];

export const StreakCard = ({
  days = DEFAULT_DAYS,
  streakCount = '"Số lượng"',
  recordCount = '0 ngày',
  onCheckIn,
}: StreakCardProps) => {
  const { layout } = useTheme();

  return (
    <View style={{ paddingHorizontal: hs(16), marginBottom: vs(20) }}>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderColor: '#F0F2F5',
          borderRadius: ms(16),
          borderWidth: 1,
          elevation: 1.5,
          padding: ms(16),
          shadowColor: '#000',
          shadowOffset: { width: hs(0), height: vs(2) },
          shadowOpacity: 0.05,
          shadowRadius: 5,
        }}
      >
        <View style={[layout.row, layout.itemsCenter, { marginBottom: vs(14) }]}>
          <View style={{ backgroundColor: '#FFB74D', borderRadius: ms(21), height: vs(42), width: hs(42) }} />
          <Text style={{ color: '#111827', fontSize: ms(16), fontWeight: '700', marginLeft: hs(12) }}>
            Streak của bạn
          </Text>
        </View>
        <View style={[layout.row, layout.itemsCenter, { marginBottom: vs(16) }]}>
          <View style={{ backgroundColor: '#FFB74D', borderRadius: ms(18), height: vs(36), marginRight: hs(10), width: hs(36) }} />
          <View>
            <Text style={{ color: '#111827', fontSize: ms(16), fontWeight: '700' }}>
              {streakCount} ngày liên tiếp
            </Text>
            <Text style={{ color: '#E53935', fontSize: ms(16), fontWeight: '700', marginTop: vs(1) }}>
              Cố gắng quá!
            </Text>
          </View>
        </View>
        <View style={[layout.row, layout.justifyBetween, { marginBottom: vs(14), paddingHorizontal: hs(4) }]}>
          {days.map((item, index) => (
            <View key={index} style={{ alignItems: 'center' }}>
              <Text
                style={{
                  color: item.active ? '#E53935' : '#9E9E9E',
                  fontSize: ms(11),
                  fontWeight: '600',
                  marginBottom: vs(6),
                }}
              >
                {item.label}
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  borderColor: item.active ? '#E53935' : '#E0E0E0',
                  borderRadius: ms(14),
                  borderWidth: 1.5,
                  height: vs(28),
                  justifyContent: 'center',
                  width: hs(28),
                }}
              />
            </View>
          ))}
        </View>

        {/* Daily Check-in Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onCheckIn}
          style={{
            alignItems: 'center',
            backgroundColor: '#FFF5F5',
            borderColor: '#FFCDD2',
            borderRadius: ms(12),
            borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: vs(10),
            paddingHorizontal: hs(14),
            paddingVertical: vs(10),
          }}
        >
          <View style={[layout.row, layout.itemsCenter]}>
            <Svg height="20" style={{ marginRight: hs(10) }} viewBox="0 0 24 24" width="20">
              <Path
                d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"
                fill="#E53935"
              />
            </Svg>
            <View>
              <Text style={{ color: '#E53935', fontSize: ms(16), fontWeight: '700' }}>
                Điểm danh hôm nay
              </Text>
              <Text style={{ color: '#757575', fontSize: ms(13), marginTop: vs(1) }}>
                Để chuỗi ngày học +2 XP
              </Text>
            </View>
          </View>
          <Svg height="14" viewBox="0 0 24 24" width="14">
            <Path
              d="M9 5l7 7-7 7"
              fill="none"
              stroke="#E53935"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          </Svg>
        </TouchableOpacity>

        {/* Record info */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: ms(10),
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: hs(12),
            paddingVertical: vs(8),
          }}
        >
          <View style={[layout.row, layout.itemsCenter]}>
            <Svg height="16" style={{ marginRight: hs(8) }} viewBox="0 0 24 24" width="16">
              <Path
                d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"
                fill="#F5A623"
              />
            </Svg>
            <Text style={{ color: '#4B5563', fontSize: ms(16), fontWeight: '600' }}>
              Kỷ lục: {recordCount}
            </Text>
          </View>
          <Svg height="14" viewBox="0 0 24 24" width="14">
            <Path
              d="M9 5l7 7-7 7"
              fill="none"
              stroke="#9CA3AF"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />
          </Svg>
        </View>
      </View>
    </View>
  );
};
