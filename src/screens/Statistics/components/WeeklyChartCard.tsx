import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, hs, vs, ms } from '@/theme';

import { formatHours } from './LearningTimeCard';

export interface WeeklyChartCardProps {
  dataStatus?: string;
  chart7Days?: number[];
  averagePerDay?: number;
  totalDaysStudied?: number;
  longestStreak?: number;
  chart7Dates?: string[];
}

export function WeeklyChartCard({
  dataStatus,
  chart7Days = [],
  averagePerDay = 0,
  totalDaysStudied = 0,
  longestStreak = 0,
  chart7Dates,
}: WeeklyChartCardProps) {
  const { layout } = useTheme();

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const safeChart = chart7Days.length === 7 ? chart7Days : [0, 0, 0, 0, 0, 0, 0];
  const maxVal = Math.max(...safeChart, 0.1);
  const maxDayHours = Math.max(...safeChart, 0);

  const days = safeChart.map((hours, i) => {
    const d = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
    const label = dayNames[chart7Dates?.[i] ? new Date(chart7Dates[i] + 'T00:00:00Z').getUTCDay() : d.getDay()];
    const isToday = i === 6;
    const heightRatio = maxVal > 0 ? hours / maxVal : 0;
    const barHeight = hours > 0 ? Math.max(vs(10), heightRatio * vs(50)) : vs(4);
    return {
      hours,
      label,
      isToday,
      barHeight,
    };
  });

  return (
    <View style={{ paddingHorizontal: hs(16), marginBottom: vs(16) }}>
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
        <View style={[layout.row, layout.itemsCenter, { marginBottom: vs(16) }]}>
          <Text
            style={{
              color: '#000000',
              fontSize: ms(16),
              fontWeight: '700',
              marginLeft: hs(12),
            }}
          >
            7 ngày gần nhất
          </Text>
        </View>

        {/* Bar Chart Visualization */}
        <View
          style={{
            alignItems: 'flex-end',
            flexDirection: 'row',
            height: vs(76),
            justifyContent: 'space-between',
            marginBottom: vs(6),
            paddingHorizontal: hs(4),
          }}
        >
          {days.map((day, idx) => (
            <View key={idx} style={{ alignItems: 'center', flex: 1 }}>
              <View
                style={{
                  backgroundColor: day.hours > 0 ? '#0E84F2' : '#E2E8F0',
                  borderRadius: ms(3),
                  height: day.barHeight,
                  width: hs(14),
                }}
              />
              <Text
                style={{
                  color: day.isToday ? '#0E84F2' : '#94A3B8',
                  fontSize: ms(11),
                  fontWeight: day.isToday ? '700' : '500',
                  marginTop: vs(6),
                }}
              >
                {day.label}
              </Text>
            </View>
          ))}
        </View>
        <Text
          style={{
            color: '#94A3B8',
            fontSize: ms(12),
            marginBottom: vs(14),
          }}
        >
          Cột xanh là ngày có thời gian học ghi nhận.
        </Text>

        {/* 2x2 Stats Grid */}
        <View style={{ rowGap: vs(8) }}>
          {/* Row 1 */}
          <View style={[layout.row, { columnGap: hs(8) }]}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#F5F6F8',
                borderRadius: ms(10),
                flex: 1,
                paddingVertical: vs(10),
              }}
            >
              <Text style={{ color: '#000000', fontSize: ms(14) }}>
                Trung bình mỗi ngày học
              </Text>
              <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '700', marginTop: vs(2) }}>
                {dataStatus ?? formatHours(averagePerDay)}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#F5F6F8',
                borderRadius: ms(10),
                flex: 1,
                paddingVertical: vs(10),
              }}
            >
              <Text style={{ color: '#000000', fontSize: ms(14) }}>
                Số ngày có học
              </Text>
              <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '700', marginTop: vs(2) }}>
                {dataStatus ?? `${totalDaysStudied} ngày`}
              </Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={[layout.row, { columnGap: hs(8) }]}>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#F5F6F8',
                borderRadius: ms(10),
                flex: 1,
                paddingVertical: vs(10),
              }}
            >
              <Text style={{ color: '#000000', fontSize: ms(14) }}>
                Ngày học nhiều nhất
              </Text>
              <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '700', marginTop: vs(2) }}>
                {dataStatus ?? formatHours(maxDayHours)}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#F5F6F8',
                borderRadius: ms(10),
                flex: 1,
                paddingVertical: vs(10),
              }}
            >
              <Text style={{ color: '#000000', fontSize: ms(14) }}>
                Chuỗi ngày dài nhất
              </Text>
              <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '700', marginTop: vs(2) }}>
                {dataStatus ?? `${longestStreak} ngày`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
