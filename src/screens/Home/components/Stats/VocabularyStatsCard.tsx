import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SectionCard } from '@/components/molecules';
import { useTheme, hs, vs, ms } from '@/theme';

import { useDashboardStats } from '@/services/analytics/useAnalytics';

interface VocabularyStatsCardProps {
  onPressDetail?: () => void;
  learnedCount?: number;
  masteredCount?: number;
  learningCount?: number;
  reviewCount?: number;
}

export function VocabularyStatsCard({
  onPressDetail,
  learnedCount,
  masteredCount,
  learningCount,
  reviewCount,
}: VocabularyStatsCardProps) {
  const { colors, layout } = useTheme();
  const { data, isError } = useDashboardStats();
  const stats = data?.vocabularyStats;
  const missing = isError ? 'Không tải được' : !data ? 'Đang tải…' : 'Chưa có dữ liệu';
  const formatCount = (count?: number) => count === undefined ? missing : count + ' từ';
  const displayLearned = formatCount(learnedCount ?? stats?.learnedCount);
  const displayMastered = formatCount(masteredCount ?? stats?.masteredCount);
  const displayLearning = formatCount(learningCount ?? stats?.learningCount);
  const displayReview = formatCount(reviewCount ?? stats?.reviewCount);

  return (
    <SectionCard
      containerStyle={{ paddingHorizontal: 0, marginBottom: 0 }}
      icon={
        <View style={{ alignItems: 'center', backgroundColor: '#DFF0FE', borderRadius: ms(21), height: vs(42), justifyContent: 'center', width: hs(42) }}>
          <Svg width={ms(22)} height={ms(22)} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 5v16m0-16C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z"
              stroke={colors.primaryAction}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
            />
          </Svg>
        </View>
      }
      title="Thống kê học tập từ vựng"
      headerStyle={{ marginBottom: vs(14) }}
    >
      <View style={{ rowGap: vs(8) }}>
        <View style={[layout.row, { columnGap: hs(8) }]}>
          <View style={{ alignItems: 'center', backgroundColor: '#F5F6F8', borderRadius: ms(10), flex: 1, paddingVertical: vs(12) }}>
            <Text style={{ color: '#000000', fontSize: ms(14), fontWeight: '700' }}>{displayLearned}</Text>
            <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '800', marginTop: vs(2) }}>Đã học</Text>
          </View>
          <View style={{ alignItems: 'center', backgroundColor: '#F5F6F8', borderRadius: ms(10), flex: 1, paddingVertical: vs(12) }}>
            <Text style={{ color: '#000000', fontSize: ms(14), fontWeight: '700' }}>{displayMastered}</Text>
            <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '800', marginTop: vs(2) }}>Đã thuộc</Text>
          </View>
        </View>

        <View style={[layout.row, { columnGap: hs(8) }]}>
          <View style={{ alignItems: 'center', backgroundColor: '#F5F6F8', borderRadius: ms(10), flex: 1, paddingVertical: vs(12) }}>
            <Text style={{ color: '#000000', fontSize: ms(14), fontWeight: '700' }}>{displayLearning}</Text>
            <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '800', marginTop: vs(2) }}>Đang học</Text>
          </View>
          <View style={{ alignItems: 'center', backgroundColor: '#F5F6F8', borderRadius: ms(10), flex: 1, paddingVertical: vs(12) }}>
            <Text style={{ color: '#000000', fontSize: ms(14), fontWeight: '700' }}>{displayReview}</Text>
            <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '800', marginTop: vs(2) }}>Cần ôn</Text>
          </View>
        </View>
      </View>

      {onPressDetail && (
        <TouchableOpacity
          activeOpacity={0.7}
          delayPressIn={0}
          onPress={onPressDetail}
          style={{ alignItems: 'center', backgroundColor: '#F5F6F8', borderRadius: ms(10), flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(12), paddingHorizontal: hs(14), paddingVertical: vs(10) }}
        >
          <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '700' }}>Xem thống kê chi tiết</Text>
          <Svg height="14" viewBox="0 0 24 24" width="14">
            <Path d="M9 5l7 7-7 7" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </Svg>
        </TouchableOpacity>
      )}
      <Text style={{ color: '#6B7280', fontSize: ms(12), lineHeight: ms(18), marginTop: vs(12) }}>
        Đã học: các từ đã ôn hoặc tập viết có ghi nhận. Đã thuộc theo lựa chọn “Đã nhớ”; Cần ôn là các từ chọn “Chưa nhớ”, nằm trong nhóm Đang học.
      </Text>
    </SectionCard>
  );
}

export default VocabularyStatsCard;
