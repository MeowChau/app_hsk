import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

import { Logo } from '@/components/atoms';
import { DailyProgressCard } from './DailyProgressCard';
import { ContinueLearningCard } from './ContinueLearningCard';
import { VocabularyStatsCard } from './VocabularyStatsCard';
import { RecommendedLessonsCard } from './RecommendedLessonsCard';
import { StreakCard } from './StreakCard';
import { HomeLeaderboardCard } from './HomeLeaderboardCard';
import { useTheme, hs, vs, ms } from '@/theme';

interface HomeContentProps {
  onSwitchTab: (tab: 'home' | 'learn' | 'game' | 'stats' | 'profile', params?: any) => void;
  onNavigateToProfile: () => void;
}

export function HomeContent({ onSwitchTab, onNavigateToProfile }: HomeContentProps) {
  const { layout } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const bannerWidth = screenWidth - 32;
  const bannerHeight = (bannerWidth * 484) / 804;

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: vs(24) }}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= HEADER ================= */}
      <View
        style={[
          layout.row,
          layout.justifyBetween,
          layout.itemsCenter,
          {
            paddingHorizontal: hs(16),
            paddingTop: vs(8),
            paddingBottom: vs(12),
          },
        ]}
      >
        <Logo variant="primary" />

        {/* Right actions */}
        <View style={[layout.row, layout.itemsCenter, { columnGap: hs(10) }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            delayPressIn={0}
            onPress={onNavigateToProfile}
            style={{
              alignItems: 'center',
              borderColor: '#D0D7DE',
              borderRadius: ms(20),
              borderWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: hs(8),
              paddingVertical: vs(3),
            }}
          >
            <View
              style={{
                backgroundColor: '#F3E8FF',
                borderRadius: ms(11),
                height: vs(22),
                marginRight: hs(6),
                overflow: 'hidden',
                width: hs(22),
              }}
            >
              <Svg height="22" viewBox="0 0 100 100" width="22">
                <Rect fill="#FDF4FF" height="100" width="100" />
                <Circle cx="50" cy="46" fill="#3E2723" r="28" />
                <Circle cx="50" cy="50" fill="#FFDFC4" r="20" />
                <Path
                  d="M32 40c4-10 14-16 26-14 8 2 14 8 16 16-4-2-9-2-14 1-5 3-10 3-14-1-6-1-10 0-14-2z"
                  fill="#2D1B16"
                />
                <Circle cx="44" cy="50" fill="#2D1B16" r="3.5" />
                <Circle cx="56" cy="50" fill="#2D1B16" r="3.5" />
                <Path d="M26 88c2-12 12-18 24-18s22 6 24 18z" fill="#374151" />
              </Svg>
            </View>
            <Text style={{ color: '#212121', fontSize: ms(14), fontWeight: '600' }}>
              Hoàng Văn Hùng
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ================= HERO BANNER ================= */}
      <View style={{ alignItems: 'center', marginTop: vs(4), paddingHorizontal: hs(16) }}>
        <Image
          resizeMode="contain"
          source={require('@/theme/assets/images/banner.png')}
          style={{
            borderRadius: ms(16),
            height: bannerHeight,
            width: bannerWidth,
          }}
        />
      </View>

      {/* ================= SLOGAN ================= */}
      <View style={{ alignItems: 'center', marginBottom: vs(20), marginTop: vs(24) }}>
        <Text
          style={{
            color: '#111827',
            fontSize: ms(28),
            fontWeight: '700',
            letterSpacing: 0.5,
            lineHeight: ms(40),
            textAlign: 'center',
          }}
        >
          Công cụ học và luyện viết{'\n'}chữ Hán & tiếng Trung{'\n'}
          <Text style={{ color: '#1F4086' }}>cho người Việt</Text>
        </Text>
      </View>

      {/* ================= CÁC CARD CHÍNH ================= */}
      {/* Card 1: Tiến độ hàng ngày */}
      <DailyProgressCard userName="Hoàng Văn Hùng" onStartLearning={() => onSwitchTab('learn')} />

      {/* Card 2: Tiếp tục học */}
      <ContinueLearningCard onContinue={() => onSwitchTab('learn')} />

      {/* Card 3: Thống kê từ vựng */}
      <View style={{ paddingHorizontal: hs(16), marginBottom: vs(20) }}>
        <VocabularyStatsCard onPressDetail={() => onSwitchTab('stats')} />
      </View>

      {/* Card 4: Bài học đề xuất */}
      <RecommendedLessonsCard onSeeAll={() => onSwitchTab('learn')} />

      {/* Card 5: Streak & Điểm danh */}
      <StreakCard />

      {/* Card 6: Bảng xếp hạng */}
      <HomeLeaderboardCard
        onSeeAll={() =>
          onSwitchTab('game', { targetView: 'leaderboard', timestamp: Date.now() })
        }
      />
    </ScrollView>
  );
}

export default HomeContent;
