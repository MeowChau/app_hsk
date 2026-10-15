import React, { useEffect, useSyncExternalStore } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { useTheme, hs, vs, ms } from '@/theme';

import { ActivityTimeCard } from './components/ActivityTimeCard';
import { LearningTimeCard } from './components/LearningTimeCard';
import { WeeklyChartCard } from './components/WeeklyChartCard';
import { VocabularyStatsCard } from '@/screens/Home/components';
import { useDashboardStats } from '@/services/analytics/useAnalytics';
import { getPendingStudyCount, subscribeStudyEvents } from '@/services/analytics/recording';

export function StatisticsContent() {
  const { layout } = useTheme();
  const { data: dashboardData, isError } = useDashboardStats();
  const pendingCount = useSyncExternalStore(subscribeStudyEvents, getPendingStudyCount, getPendingStudyCount);
  const dataStatus = isError ? 'Không tải được' : !dashboardData ? 'Đang tải…' : undefined;
  useEffect(() => { if (isError) Alert.alert('Chưa tải được thống kê', 'Vui lòng kiểm tra kết nối và thử lại.'); }, [isError]);

  return (
    <View style={[layout.flex_1, { backgroundColor: '#FFFFFF' }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: vs(24) }}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= HEADER ================= */}
        <View style={{ paddingHorizontal: hs(16), paddingTop: vs(16), paddingBottom: vs(16) }}>
          <Text
            style={{
              color: '#111827',
              fontSize: ms(28),
              fontWeight: '800',
              marginBottom: vs(4),
            }}
          >
            Thống kê học tập
          </Text>
          <Text
            style={{
              color: '#4B5563',
              fontSize: ms(16),
              lineHeight: ms(18),
            }}
          >
            Toàn bộ hành trình học của bạn, tính đến hôm nay.
          </Text>
        </View>

        {/* ================= CARDS ================= */}
        <LearningTimeCard
          dataStatus={dataStatus}
          timeToday={dashboardData?.timeToday ?? 0}
          time7Days={dashboardData?.time7Days ?? 0}
          timeTotal={dashboardData?.timeTotal ?? 0}
          timeTodaySeconds={dashboardData?.timeTodaySeconds}
          time7DaysSeconds={dashboardData?.time7DaysSeconds}
          timeTotalSeconds={dashboardData?.timeTotalSeconds}
          pendingCount={pendingCount}
        />
        <WeeklyChartCard
          dataStatus={dataStatus}
          chart7Days={dashboardData?.chart7DaysSeconds?.map(seconds => seconds / 3600) ?? dashboardData?.chart7Days ?? []}
          chart7Dates={dashboardData?.chart7Dates}
          averagePerDay={dashboardData?.weekAverageSeconds !== undefined ? dashboardData.weekAverageSeconds / 3600 : dashboardData?.averagePerDay ?? 0}
          totalDaysStudied={dashboardData?.weekDaysStudied ?? dashboardData?.totalDaysStudied ?? 0}
          longestStreak={dashboardData?.weekLongestStreak ?? dashboardData?.longestStreak ?? 0}
        />
        <ActivityTimeCard dataStatus={dataStatus} activityTimes={dashboardData?.activityTimes} />
        
        <View style={{ paddingHorizontal: hs(16), marginBottom: vs(16) }}>
          <VocabularyStatsCard />
        </View>

      </ScrollView>
    </View>
  );
}

export default StatisticsContent;
