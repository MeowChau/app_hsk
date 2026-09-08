import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useTheme, hs, vs, ms } from '@/theme';

import { LearningTimeCard } from '@/components/molecules/cards/LearningTimeCard';
import { WeeklyChartCard } from '@/components/molecules/cards/WeeklyChartCard';
import { ActivityTimeCard } from '@/components/molecules/cards/ActivityTimeCard';
import { VocabularyStatsCard } from '@/components/molecules/cards/VocabularyStatsCard';

export function StatisticsContent() {
  const { layout } = useTheme();

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
              fontSize: ms(22),
              fontWeight: '800',
              marginBottom: vs(4),
            }}
          >
            Thống kê học tập
          </Text>
          <Text
            style={{
              color: '#4B5563',
              fontSize: ms(13),
              lineHeight: ms(18),
            }}
          >
            Toàn bộ hành trình học của bạn, tính đến hôm nay.
          </Text>
        </View>

        {/* ================= CARDS ================= */}
        <LearningTimeCard />
        <WeeklyChartCard />
        <ActivityTimeCard />
        
        <View style={{ paddingHorizontal: hs(16), marginBottom: vs(16) }}>
          <VocabularyStatsCard />
        </View>

      </ScrollView>
    </View>
  );
}

export default StatisticsContent;
