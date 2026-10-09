import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme, hs, vs, ms } from '@/theme';
import { useProfile } from '@/services/auth';
import { useStreakLeaderboard } from '@/services/leaderboard';
import { useDashboardStats, useCheckIn } from '@/services/analytics';

interface StreakCardProps {
  days?: Array<{ label: string; active: boolean }>;
  streakCount?: string | number;
  recordCount?: string | number;
  onCheckIn?: () => void;
}

export const StreakCard = ({
  days: propDays,
  streakCount: propStreakCount,
  recordCount: propRecordCount,
  onCheckIn: propOnCheckIn,
}: StreakCardProps) => {
  const { layout } = useTheme();
  const { data: profile } = useProfile();
  const { data: leaderboardData } = useStreakLeaderboard();
  const { data: dashboardData } = useDashboardStats();
  const checkInMutation = useCheckIn();

  // Tìm thông tin của user hiện tại từ leaderboard và dashboard
  const currentUserItem = leaderboardData?.leaderboard?.find(
    (item) => item.id === profile?.id,
  );

  const currentStreak =
    propStreakCount !== undefined
      ? Number(propStreakCount) || 0
      : currentUserItem?.currentStreak ?? 0;

  const longestStreak =
    propRecordCount !== undefined
      ? propRecordCount
      : currentUserItem?.longestStreak ?? dashboardData?.longestStreak ?? 0;

  // Kiểm tra xem hôm nay đã điểm danh / học chưa
  const isTodayStudied =
    (dashboardData?.timeToday ?? 0) > 0 ||
    currentUserItem?.streakStatus === 'active';

  // Tính toán 7 ngày trong tuần hiện tại (T2 -> CN)
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0: CN, 1: T2, ..., 6: T7
  const currentWeekDayIndex = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1; // 0: T2, ..., 6: CN

  const weekDayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const computedDays = propDays ?? weekDayLabels.map((label, idx) => {
    let active = false;
    if (idx === currentWeekDayIndex) {
      active = isTodayStudied;
    } else if (idx < currentWeekDayIndex) {
      const daysAgo = currentWeekDayIndex - idx;
      if (daysAgo < currentStreak) {
        active = true;
      }
      if (!active && dashboardData?.chart7Days) {
        const chartIndex = 6 - daysAgo;
        if (chartIndex >= 0 && (dashboardData.chart7Days[chartIndex] ?? 0) > 0) {
          active = true;
        }
      }
    }
    return { label, active };
  });

  const handleCheckIn = () => {
    if (propOnCheckIn) {
      propOnCheckIn();
      return;
    }

    if (isTodayStudied) {
      Alert.alert(
        'Đã điểm danh',
        'Bạn đã điểm danh và học tập hôm nay rồi! Hãy quay lại vào ngày mai nhé.',
      );
      return;
    }

    checkInMutation.mutate(
      { durationInSeconds: 60, module: 'daily_checkin' },
      {
        onSuccess: () => {
          Alert.alert(
            'Điểm danh thành công! 🎉',
            'Chuỗi ngày học của bạn đã được duy trì và bạn được cộng +2 XP.',
          );
        },
        onError: () => {
          Alert.alert('Lỗi', 'Không thể điểm danh lúc này, vui lòng thử lại sau.');
        },
      },
    );
  };

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
        {/* Header */}
        <View style={[layout.row, layout.itemsCenter, { marginBottom: vs(14) }]}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#FFF3E0',
              borderRadius: ms(21),
              height: vs(42),
              justifyContent: 'center',
              width: hs(42),
            }}
          >
            <Text style={{ fontSize: ms(22) }}>🔥</Text>
          </View>
          <Text style={{ color: '#111827', fontSize: ms(16), fontWeight: '700', marginLeft: hs(12) }}>
            Streak của bạn
          </Text>
        </View>

        {/* Streak number info */}
        <View style={[layout.row, layout.itemsCenter, { marginBottom: vs(16) }]}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#FFE0B2',
              borderRadius: ms(18),
              height: vs(36),
              justifyContent: 'center',
              marginRight: hs(10),
              width: hs(36),
            }}
          >
            <Text style={{ fontSize: ms(18) }}>⚡</Text>
          </View>
          <View>
            <Text style={{ color: '#111827', fontSize: ms(16), fontWeight: '700' }}>
              {currentStreak} ngày liên tiếp
            </Text>
            <Text
              style={{
                color: currentStreak > 0 ? '#E53935' : '#6B7280',
                fontSize: ms(14),
                fontWeight: '700',
                marginTop: vs(1),
              }}
            >
              {currentStreak > 0
                ? isTodayStudied
                  ? 'Duy trì rất tốt!'
                  : 'Cố gắng quá!'
                : 'Bắt đầu chuỗi học ngay!'}
            </Text>
          </View>
        </View>

        {/* Weekly Day Circles (T2 -> CN) */}
        <View style={[layout.row, layout.justifyBetween, { marginBottom: vs(14), paddingHorizontal: hs(4) }]}>
          {computedDays.map((item, index) => (
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
                  backgroundColor: item.active ? '#FFEBEE' : '#F9FAFB',
                  borderColor: item.active ? '#E53935' : '#E0E0E0',
                  borderRadius: ms(14),
                  borderWidth: 1.5,
                  height: vs(28),
                  justifyContent: 'center',
                  width: hs(28),
                }}
              >
                {item.active ? (
                  <View
                    style={{
                      backgroundColor: '#E53935',
                      borderRadius: ms(5),
                      height: vs(10),
                      width: hs(10),
                    }}
                  />
                ) : null}
              </View>
            </View>
          ))}
        </View>

        {/* Daily Check-in Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={checkInMutation.isPending}
          onPress={handleCheckIn}
          style={{
            alignItems: 'center',
            backgroundColor: isTodayStudied ? '#F0FDF4' : '#FFF5F5',
            borderColor: isTodayStudied ? '#BBF7D0' : '#FFCDD2',
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
                fill={isTodayStudied ? '#16A34A' : '#E53935'}
              />
            </Svg>
            <View>
              <Text
                style={{
                  color: isTodayStudied ? '#16A34A' : '#E53935',
                  fontSize: ms(15),
                  fontWeight: '700',
                }}
              >
                {isTodayStudied ? 'Đã điểm danh hôm nay' : 'Điểm danh hôm nay'}
              </Text>
              <Text
                style={{
                  color: isTodayStudied ? '#15803D' : '#757575',
                  fontSize: ms(12),
                  marginTop: vs(1),
                }}
              >
                {isTodayStudied ? 'Chuỗi ngày học đã duy trì' : 'Để chuỗi ngày học +2 XP'}
              </Text>
            </View>
          </View>
          {checkInMutation.isPending ? (
            <ActivityIndicator color={isTodayStudied ? '#16A34A' : '#E53935'} size="small" />
          ) : (
            <Svg height="14" viewBox="0 0 24 24" width="14">
              <Path
                d={isTodayStudied ? 'M5 13l4 4L19 7' : 'M9 5l7 7-7 7'}
                fill="none"
                stroke={isTodayStudied ? '#16A34A' : '#E53935'}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
            </Svg>
          )}
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
            <Text style={{ color: '#4B5563', fontSize: ms(14), fontWeight: '600' }}>
              Kỷ lục: {longestStreak} ngày
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
export default StreakCard;
