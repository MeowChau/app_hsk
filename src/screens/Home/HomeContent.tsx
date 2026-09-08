import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

import { Logo } from '@/components/atoms';
import { DailyProgressCard } from '@/components/molecules/cards/DailyProgressCard';
import { ContinueLearningCard } from '@/components/molecules/cards/ContinueLearningCard';
import { VocabularyStatsCard } from '@/components/molecules/cards/VocabularyStatsCard';
import { useTheme, hs, vs, ms } from '@/theme';

interface HomeContentProps {
  onSwitchTab: (tab: 'home' | 'learn' | 'game' | 'stats' | 'profile') => void;
  onNavigateToProfile: () => void;
}

export function HomeContent({ onSwitchTab, onNavigateToProfile }: HomeContentProps) {
  const { layout } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const bannerWidth = screenWidth - 32;
  const bannerHeight = (bannerWidth * 484) / 804;

  const days = [
    { label: 'T2', active: true },
    { label: 'T3', active: false },
    { label: 'T4', active: false },
    { label: 'T5', active: false },
    { label: 'T6', active: false },
    { label: 'T7', active: false },
    { label: 'CN', active: false },
  ];

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
                <Path d="M32 40c4-10 14-16 26-14 8 2 14 8 16 16-4-2-9-2-14 1-5 3-10 3-14-1-6-1-10 0-14-2z" fill="#2D1B16" />
                <Circle cx="44" cy="50" fill="#2D1B16" r="3.5" />
                <Circle cx="56" cy="50" fill="#2D1B16" r="3.5" />
                <Path d="M26 88c2-12 12-18 24-18s22 6 24 18z" fill="#374151" />
              </Svg>
            </View>
            <Text style={{ color: '#212121', fontSize: ms(11), fontWeight: '600' }}>
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

      {/* ================= CARD 1 & 2 ================= */}
      <DailyProgressCard userName="Hoàng Văn Hùng" onStartLearning={() => onSwitchTab('learn')} />
      <ContinueLearningCard onContinue={() => onSwitchTab('learn')} />

      {/* ================= CARD 3: THỐNG KÊ ================= */}
      <View style={{ paddingHorizontal: hs(16), marginBottom: vs(20) }}>
        <VocabularyStatsCard onPressDetail={() => onSwitchTab('stats')} />
      </View>

      {/* ================= SECTION: BÀI HỌC ================= */}
      <View style={{ paddingHorizontal: hs(16), marginBottom: vs(20) }}>
        <View style={[layout.row, layout.justifyBetween, layout.itemsCenter, { marginBottom: vs(12) }]}>
          <View style={[layout.row, layout.itemsCenter]}>
            <View style={{ backgroundColor: '#DFF0FE', borderRadius: ms(16), height: vs(32), width: hs(32) }} />
            <Text style={{ color: '#111827', fontSize: ms(14), fontWeight: '700', marginLeft: hs(10) }}>
              Bài học đề xuất cho bạn
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => onSwitchTab('learn')}>
            <Text style={{ color: '#0E84F2', fontSize: ms(12), fontWeight: '700' }}>Xem tất cả {'>'}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ rowGap: vs(10) }}>
          <View style={[layout.row, { columnGap: hs(10) }]}>
            <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: '#F0F7FF', borderColor: '#D4E8FC', borderRadius: ms(14), borderWidth: 1, flex: 1, height: vs(96) }} />
            <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: '#F0F7FF', borderColor: '#D4E8FC', borderRadius: ms(14), borderWidth: 1, flex: 1, height: vs(96) }} />
          </View>
        </View>
      </View>

      {/* ================= CARD 4: STREAK ================= */}
      <View style={{ paddingHorizontal: hs(16), marginBottom: vs(20) }}>
        <View style={{ backgroundColor: '#FFFFFF', borderColor: '#F0F2F5', borderRadius: ms(16), borderWidth: 1, elevation: 1.5, padding: ms(16), shadowColor: '#000', shadowOffset: { width: hs(0), height: vs(2) }, shadowOpacity: 0.05, shadowRadius: 5 }}>
          <View style={[layout.row, layout.itemsCenter, { marginBottom: vs(14) }]}>
            <View style={{ backgroundColor: '#FFB74D', borderRadius: ms(16), height: vs(32), width: hs(32) }} />
            <Text style={{ color: '#111827', fontSize: ms(14), fontWeight: '700', marginLeft: hs(10) }}>Streak của bạn</Text>
          </View>
          <View style={[layout.row, layout.itemsCenter, { marginBottom: vs(16) }]}>
            <View style={{ backgroundColor: '#FFB74D', borderRadius: ms(18), height: vs(36), marginRight: hs(10), width: hs(36) }} />
            <View>
              <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '700' }}>"Số lượng" ngày liên tiếp</Text>
              <Text style={{ color: '#E53935', fontSize: ms(12), fontWeight: '700', marginTop: vs(1) }}>Cố gắng quá!</Text>
            </View>
          </View>
          <View style={[layout.row, layout.justifyBetween, { marginBottom: vs(14), paddingHorizontal: hs(4) }]}>
            {days.map((item, index) => (
              <View key={index} style={{ alignItems: 'center' }}>
                <Text style={{ color: item.active ? '#E53935' : '#9E9E9E', fontSize: ms(11), fontWeight: '600', marginBottom: vs(6) }}>{item.label}</Text>
                <View style={{ alignItems: 'center', borderColor: item.active ? '#E53935' : '#E0E0E0', borderRadius: ms(14), borderWidth: 1.5, height: vs(28), justifyContent: 'center', width: hs(28) }} />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ================= CARD 5: BẢNG XẾP HẠNG ================= */}
      <View style={{ paddingHorizontal: hs(16), marginBottom: vs(24) }}>
        <View style={{ backgroundColor: '#FFFFFF', borderColor: '#F0F2F5', borderRadius: ms(16), borderWidth: 1, elevation: 1.5, padding: ms(16), shadowColor: '#000', shadowOffset: { width: hs(0), height: vs(2) }, shadowOpacity: 0.05, shadowRadius: 5 }}>
          <View style={[layout.row, layout.justifyBetween, layout.itemsCenter, { marginBottom: vs(14) }]}>
            <View style={[layout.row, layout.itemsCenter]}>
              <View style={{ backgroundColor: '#FFB74D', borderRadius: ms(16), height: vs(32), width: hs(32) }} />
              <Text style={{ color: '#111827', fontSize: ms(14), fontWeight: '700', marginLeft: hs(10) }}>Bảng xếp hạng</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} onPress={() => onSwitchTab('game')}>
              <Text style={{ color: '#0E84F2', fontSize: ms(12), fontWeight: '700' }}>Xem tất cả {'>'}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ rowGap: vs(12) }}>
            <View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
              <View style={[layout.row, layout.itemsCenter]}>
                <View style={{ alignItems: 'center', backgroundColor: '#F5A623', borderRadius: ms(12), height: vs(24), justifyContent: 'center', width: hs(24) }}>
                  <Text style={{ color: '#FFFFFF', fontSize: ms(11), fontWeight: '800' }}>1</Text>
                </View>
                <View style={{ backgroundColor: '#E0E0E0', borderRadius: ms(16), height: vs(32), marginLeft: hs(10), marginRight: hs(10), width: hs(32) }} />
                <View>
                  <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '700' }}>Thư</Text>
                  <Text style={{ color: '#9E9E9E', fontSize: ms(10), marginTop: vs(1) }}>Level 14</Text>
                </View>
              </View>
              <Text style={{ color: '#4B5563', fontSize: ms(12), fontWeight: '700' }}>5.665 XP</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default HomeContent;
