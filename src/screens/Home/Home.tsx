import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, useWindowDimensions } from 'react-native';

import { Logo, UserAvatar } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';
import { useTheme, hs, vs, ms } from '@/theme';

import {
  DailyProgressCard,
  ContinueLearningCard,
  VocabularyStatsCard,
  RecommendedLessonsCard,
  StreakCard,
  HomeLeaderboardCard,
} from './components';

export interface HomeContentProps {
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
            <UserAvatar size={ms(22)} style={{ marginRight: hs(6) }} />
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

export function Home({ navigation }: RootScreenProps<Paths.Home>) {
  return (
    <SafeScreen style={{ backgroundColor: '#FFFFFF' }}>
      <HomeContent 
        onSwitchTab={(tab, params) => {
          if (tab === 'learn') navigation.navigate(Paths.Learn, params as any);
          else if (tab === 'game') navigation.navigate(Paths.Game, params as any);
          else if (tab === 'stats') navigation.navigate(Paths.Statistics, params as any);
          else if (tab === 'profile') navigation.navigate(Paths.Profile, params as any);
          else navigation.navigate(Paths.Home, params as any);
        }}
        onNavigateToProfile={() => navigation.navigate(Paths.Profile)} 
      />
    </SafeScreen>
  );
}

export default Home;
