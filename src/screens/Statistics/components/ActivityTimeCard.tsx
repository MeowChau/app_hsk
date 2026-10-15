import React from 'react';
import { View, Text } from 'react-native';
import { hs, vs, ms } from '@/theme';
import { formatStudySeconds } from './LearningTimeCard';
import type { DashboardStatsResponse } from '@/services/analytics/types';

interface ActivityTimeCardProps {
  dataStatus?: string;
  activityTimes?: DashboardStatsResponse['activityTimes'];
}

const activities = [
  { key: 'review', label: 'Ôn từ vựng', color: '#0E84F2' },
  { key: 'practice', label: 'Luyện kỹ năng', color: '#10B981' },
  { key: 'exam', label: 'Thi thử HSK', color: '#8B5CF6' },
  { key: 'pk', label: 'Đấu PK', color: '#F59E0B' },
] as const;

export function ActivityTimeCard({ dataStatus, activityTimes }: ActivityTimeCardProps) {
  const total = activityTimes ? Object.values(activityTimes).reduce((sum, seconds) => sum + seconds, 0) : 0;
  const missing = dataStatus ?? (!activityTimes ? 'Chưa có dữ liệu' : undefined);
  return (
    <View style={{ paddingHorizontal: hs(16), marginBottom: vs(16) }}>
      <View style={{ backgroundColor: '#FFFFFF', borderColor: '#F0F2F5', borderRadius: ms(16), borderWidth: 1, elevation: 1.5, padding: ms(16), shadowColor: '#000', shadowOffset: { width: hs(0), height: vs(2) }, shadowOpacity: 0.05, shadowRadius: 5 }}>
        <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '700', marginLeft: hs(12), marginBottom: vs(16) }}>Thời gian theo hoạt động</Text>
        <View style={{ rowGap: vs(14) }}>
          {activities.map(activity => {
            const seconds = activityTimes?.[activity.key] ?? 0;
            const percent = total > 0 ? seconds / total * 100 : 0;
            return (
              <View key={activity.key}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4) }}>
                  <Text style={{ color: '#000000', fontSize: ms(14), fontWeight: '600' }}>{activity.label}</Text>
                  <Text style={{ color: '#6B7280', fontSize: ms(12) }}>{missing ?? (formatStudySeconds(seconds) + ' · ' + Math.round(percent) + '%')}</Text>
                </View>
                <View style={{ backgroundColor: '#F1F5F9', borderRadius: ms(3), height: vs(6), width: '100%', overflow: 'hidden' }}>
                  <View style={{ backgroundColor: activity.color, height: '100%', width: percent + '%' as `${number}%` }} />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}
