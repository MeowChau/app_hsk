import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SectionCard } from '@/components/molecules';
import { useTheme, hs, vs, ms } from '@/theme';

import { useTopicCounts } from '@/services/vocabulary';

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
  const { layout } = useTheme();
  const { data: topicCounts } = useTopicCounts();
  const totalWordsInTopic = React.useMemo(() => {
    if (!topicCounts) return 0;
    return Object.values(topicCounts).reduce((acc, count) => acc + count, 0);
  }, [topicCounts]);

  const displayLearned = learnedCount !== undefined ? `${learnedCount} từ` : '0 từ';
  const displayMastered = masteredCount !== undefined ? `${masteredCount} từ` : '0 từ';
  const displayLearning = learningCount !== undefined ? `${learningCount} từ` : (totalWordsInTopic > 0 ? `${totalWordsInTopic} từ` : '0 từ');
  const displayReview = reviewCount !== undefined ? `${reviewCount} từ` : '0 từ';

  return (
    <SectionCard
      containerStyle={{ paddingHorizontal: 0, marginBottom: 0 }}
      icon={<View style={{ backgroundColor: '#DFF0FE', borderRadius: ms(21), height: vs(42), width: hs(42) }} />}
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
    </SectionCard>
  );
}

export default VocabularyStatsCard;
