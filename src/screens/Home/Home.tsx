import type { RootScreenProps } from '@/navigation/types';

import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Logo } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';
import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';
import { StatisticsContent } from '@/screens/Statistics/Statistics';
import { ProfileContent } from '@/screens/Profile/Profile';
import { EducationContent } from '@/screens/Education/Education';
import { GameContent } from '@/screens/Game/Game';

function Home({ navigation, route }: RootScreenProps<Paths.Home>) {
  const { layout } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const bannerWidth = screenWidth - 32;
  const bannerHeight = (bannerWidth * 484) / 804;

  const initialTab = route.params?.tab ?? 'home';
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'game' | 'stats' | 'profile'>(initialTab);
  const [visitedTabs, setVisitedTabs] = useState<Record<string, boolean>>({
    [initialTab]: true,
    home: true,
  });

  const switchTab = (tab: 'home' | 'learn' | 'game' | 'stats' | 'profile') => {
    setVisitedTabs((prev) => (prev[tab] ? prev : { ...prev, [tab]: true }));
    setActiveTab(tab);
  };

  useEffect(() => {
    if (route.params?.tab) {
      switchTab(route.params.tab);
    }
  }, [route.params?.tab]);

  useEffect(() => {
    const onBackPress = () => {
      if (activeTab !== 'home') {
        setActiveTab('home');
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [activeTab]);

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
    <SafeScreen style={{ backgroundColor: '#FFFFFF' }}>
      <View style={[layout.flex_1, { backgroundColor: '#FFFFFF', justifyContent: 'space-between' }]}>
        {/* ================= TAB VIEWS CONTAINER (FORCE REBUILD) ================= */}
        <View style={layout.flex_1}>
          {/* ================= TAB 1: HOME ================= */}
          <View style={[layout.flex_1, { display: activeTab === 'home' ? 'flex' : 'none' }]}>
            <ScrollView
              contentContainerStyle={{ paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}
            >
              {/* ================= HEADER ================= */}
              <View
                style={[
                  layout.row,
                  layout.justifyBetween,
                  layout.itemsCenter,
                  {
                    paddingHorizontal: 16,
                    paddingTop: 8,
                    paddingBottom: 12,
                  },
                ]}
              >
                {/* Logo hsk masta */}
                <Logo variant="primary" />

                {/* Right actions: User Avatar + Name Badge + Menu */}
                <View style={[layout.row, layout.itemsCenter, { columnGap: 10 }]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    delayPressIn={0}
                    onPress={() => switchTab('profile')}
                    style={{
                      alignItems: 'center',
                      borderColor: '#D0D7DE',
                      borderRadius: 20,
                      borderWidth: 1,
                      flexDirection: 'row',
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                    }}
                  >
                    {/* Circular Avatar */}
                    <View
                      style={{
                        backgroundColor: '#F3E8FF',
                        borderRadius: 11,
                        height: 22,
                        marginRight: 6,
                        overflow: 'hidden',
                        width: 22,
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

                    {/* User Name */}
                    <Text style={{ color: '#212121', fontSize: 11, fontWeight: '600' }}>
                      Hoàng Văn Hùng
                    </Text>
                  </TouchableOpacity>


                </View>
              </View>

              {/* ================= HERO BANNER ================= */}
              <View style={{ alignItems: 'center', marginTop: 4, paddingHorizontal: 16 }}>
                <Image
                  resizeMode="contain"
                  source={require('@/theme/assets/images/banner.png')}
                  style={{
                    borderRadius: 16,
                    height: bannerHeight,
                    width: bannerWidth,
                  }}
                />
              </View>

              {/* ================= SLOGAN ================= */}
              <View style={{ alignItems: 'center', marginBottom: 20, marginTop: 24 }}>
                <Text
                  style={{
                    color: '#111827',
                    fontSize: 28,
                    fontWeight: '700',
                    letterSpacing: 0.5,
                    lineHeight: 40,
                    textAlign: 'center',
                  }}
                >
                  Công cụ học và luyện viết{'\n'}chữ Hán & tiếng Trung{'\n'}
                  <Text style={{ color: '#1F4086' }}>cho người Việt</Text>
                </Text>
              </View>

              {/* ================= CARD 1: NÂNG CAO MỖI NGÀY ================= */}
              <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                <View
                  style={{
                    backgroundColor: '#DFF3FF',
                    borderRadius: 16,
                    padding: 20,
                  }}
                >
                  <Text
                    style={{
                      color: '#111827',
                      fontSize: 22,
                      fontWeight: '700',
                      marginBottom: 4,
                    }}
                  >
                    Nâng cao mỗi ngày
                  </Text>
                  <Text
                    style={{
                      color: '#1F4086',
                      fontSize: 22,
                      fontWeight: '700',
                      marginBottom: 10,
                    }}
                  >
                    Tiến bộ không ngừng!
                  </Text>
                  <Text
                    style={{
                      color: '#111827',
                      fontSize: 15,
                      lineHeight: 28,
                      marginBottom: 20,
                    }}
                  >
                    Học tiếng Trung mỗi ngày giúp bạn mở ra những cơ hội mới, "Hoàng Văn Hùng".
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      alignItems: 'center',
                      alignSelf: 'center',
                      backgroundColor: '#1F4086',
                      borderRadius: 999,
                      justifyContent: 'center',
                      paddingVertical: 16,
                      width: '90%',
                    }}
                  >
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontSize: 15,
                          fontWeight: '700',
                          letterSpacing: 0.5,
                        }}
                      >
                        BẮT ĐẦU HỌC NGAY
                      </Text>
                      <Svg height="16" style={{ marginLeft: 6, marginTop: 1 }} viewBox="0 0 24 24" width="16">
                        <Path
                          d="M5 12h14M12 5l7 7-7 7"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                        />
                      </Svg>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ================= CARD 2: TIẾP TỤC HỌC ================= */}
              <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#F0F2F5',
                    borderRadius: 16,
                    borderWidth: 1,
                    elevation: 1.5,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 5,
                  }}
                >
                  {/* Card Title */}
                  <View style={[layout.row, layout.itemsCenter, { marginBottom: 16 }]}>
                    <View
                      style={{
                        alignItems: 'center',
                        backgroundColor: '#DFF3FF',
                        borderRadius: 21,
                        height: 42,
                        justifyContent: 'center',
                        width: 42,
                      }}
                    >
                      <Svg height="22" viewBox="6 4 14 16" width="22">
                        <Path
                          d="M8 6.82v10.36c0 1.54 1.68 2.49 3 1.57l7.4-5.18c1.17-.82 1.17-2.54 0-3.36l-7.4-5.18c-1.32-.92-3 .03-3 1.57z"
                          fill="#1F4086"
                        />
                      </Svg>
                    </View>
                    <Text
                      style={{
                        color: '#111827',
                        fontSize: 15,
                        fontWeight: '700',
                        marginLeft: 12,
                      }}
                    >
                      Tiếp tục học
                    </Text>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      alignItems: 'center',
                      alignSelf: 'center',
                      backgroundColor: '#1F4086',
                      borderRadius: 999,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      paddingVertical: 16,
                      width: '90%',
                    }}
                  >
                    <Svg height="18" style={{ marginRight: 8, marginTop: 1 }} viewBox="6 4 14 16" width="18">
                      <Path
                        d="M8 6.82v10.36c0 1.54 1.68 2.49 3 1.57l7.4-5.18c1.17-.82 1.17-2.54 0-3.36l-7.4-5.18c-1.32-.92-3 .03-3 1.57z"
                        fill="#FFFFFF"
                      />
                    </Svg>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontSize: 15,
                        fontWeight: '700',
                        letterSpacing: 0.5,
                      }}
                    >
                      BẮT ĐẦU HỌC
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ================= CARD 3: THỐNG KÊ HỌC TẬP TỪ VỰNG ================= */}
              <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#F0F2F5',
                    borderRadius: 16,
                    borderWidth: 1,
                    elevation: 1.5,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 5,
                  }}
                >
                  {/* Header */}
                  <View style={[layout.row, layout.itemsCenter, { marginBottom: 14 }]}>
                    <View
                      style={{
                        backgroundColor: '#DFF0FE',
                        borderRadius: 16,
                        height: 32,
                        width: 32,
                      }}
                    />
                    <Text
                      style={{
                        color: '#111827',
                        fontSize: 14,
                        fontWeight: '700',
                        marginLeft: 10,
                      }}
                    >
                      Thống kê học tập từ vựng
                    </Text>
                  </View>

                  {/* 2x2 Grid Tiles */}
                  <View style={{ rowGap: 8 }}>
                    {/* Row 1 */}
                    <View style={[layout.row, { columnGap: 8 }]}>
                      <View
                        style={{
                          alignItems: 'center',
                          backgroundColor: '#F5F6F8',
                          borderRadius: 10,
                          flex: 1,
                          paddingVertical: 12,
                        }}
                      >
                        <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>
                          "Số lượng"
                        </Text>
                        <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                          Đã học
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          backgroundColor: '#F5F6F8',
                          borderRadius: 10,
                          flex: 1,
                          paddingVertical: 12,
                        }}
                      >
                        <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>
                          "Số lượng"
                        </Text>
                        <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                          Đã thuộc
                        </Text>
                      </View>
                    </View>

                    {/* Row 2 */}
                    <View style={[layout.row, { columnGap: 8 }]}>
                      <View
                        style={{
                          alignItems: 'center',
                          backgroundColor: '#F5F6F8',
                          borderRadius: 10,
                          flex: 1,
                          paddingVertical: 12,
                        }}
                      >
                        <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>
                          "Số lượng"
                        </Text>
                        <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                          Đang học
                        </Text>
                      </View>
                      <View
                        style={{
                          alignItems: 'center',
                          backgroundColor: '#F5F6F8',
                          borderRadius: 10,
                          flex: 1,
                          paddingVertical: 12,
                        }}
                      >
                        <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>
                          "Số lượng"
                        </Text>
                        <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                          Cần ôn
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Detail button */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    delayPressIn={0}
                    onPress={() => switchTab('stats')}
                    style={{
                      alignItems: 'center',
                      backgroundColor: '#F5F6F8',
                      borderRadius: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                    }}
                  >
                    <Text style={{ color: '#374151', fontSize: 12, fontWeight: '600' }}>
                      Xem thống kê chi tiết
                    </Text>
                    <Svg height="14" viewBox="0 0 24 24" width="14">
                      <Path
                        d="M9 5l7 7-7 7"
                        fill="none"
                        stroke="#6B7280"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ================= SECTION: BÀI HỌC ĐỀ XUẤT ================= */}
              <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                <View
                  style={[
                    layout.row,
                    layout.justifyBetween,
                    layout.itemsCenter,
                    { marginBottom: 12 },
                  ]}
                >
                  <View style={[layout.row, layout.itemsCenter]}>
                    <View
                      style={{
                        backgroundColor: '#DFF0FE',
                        borderRadius: 16,
                        height: 32,
                        width: 32,
                      }}
                    />
                    <Text
                      style={{
                        color: '#111827',
                        fontSize: 14,
                        fontWeight: '700',
                        marginLeft: 10,
                      }}
                    >
                      Bài học đề xuất cho bạn
                    </Text>
                  </View>

                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={{ color: '#0E84F2', fontSize: 12, fontWeight: '700' }}>
                      Xem tất cả {'>'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* 2x2 Pastel Lesson Cards */}
                <View style={{ rowGap: 10 }}>
                  <View style={[layout.row, { columnGap: 10 }]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: '#F0F7FF',
                        borderColor: '#D4E8FC',
                        borderRadius: 14,
                        borderWidth: 1,
                        flex: 1,
                        height: 96,
                      }}
                    />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: '#F0F7FF',
                        borderColor: '#D4E8FC',
                        borderRadius: 14,
                        borderWidth: 1,
                        flex: 1,
                        height: 96,
                      }}
                    />
                  </View>
                  <View style={[layout.row, { columnGap: 10 }]}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: '#F0F7FF',
                        borderColor: '#D4E8FC',
                        borderRadius: 14,
                        borderWidth: 1,
                        flex: 1,
                        height: 96,
                      }}
                    />
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={{
                        backgroundColor: '#F0F7FF',
                        borderColor: '#D4E8FC',
                        borderRadius: 14,
                        borderWidth: 1,
                        flex: 1,
                        height: 96,
                      }}
                    />
                  </View>
                </View>
              </View>

              {/* ================= CARD 4: STREAK CỦA BẠN ================= */}
              <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#F0F2F5',
                    borderRadius: 16,
                    borderWidth: 1,
                    elevation: 1.5,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 5,
                  }}
                >
                  {/* Header */}
                  <View style={[layout.row, layout.itemsCenter, { marginBottom: 14 }]}>
                    <View
                      style={{
                        backgroundColor: '#FFB74D',
                        borderRadius: 16,
                        height: 32,
                        width: 32,
                      }}
                    />
                    <Text
                      style={{
                        color: '#111827',
                        fontSize: 14,
                        fontWeight: '700',
                        marginLeft: 10,
                      }}
                    >
                      Streak của bạn
                    </Text>
                  </View>

                  {/* Streak status */}
                  <View style={[layout.row, layout.itemsCenter, { marginBottom: 16 }]}>
                    <View
                      style={{
                        backgroundColor: '#FFB74D',
                        borderRadius: 18,
                        height: 36,
                        marginRight: 10,
                        width: 36,
                      }}
                    />
                    <View>
                      <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>
                        "Số lượng" ngày liên tiếp
                      </Text>
                      <Text style={{ color: '#E53935', fontSize: 12, fontWeight: '700', marginTop: 1 }}>
                        Cố gắng quá!
                      </Text>
                    </View>
                  </View>

                  {/* 7 Days of week */}
                  <View
                    style={[
                      layout.row,
                      layout.justifyBetween,
                      { marginBottom: 14, paddingHorizontal: 4 },
                    ]}
                  >
                    {days.map((item, index) => (
                      <View key={index} style={{ alignItems: 'center' }}>
                        <Text
                          style={{
                            color: item.active ? '#E53935' : '#9E9E9E',
                            fontSize: 11,
                            fontWeight: '600',
                            marginBottom: 6,
                          }}
                        >
                          {item.label}
                        </Text>
                        <View
                          style={{
                            alignItems: 'center',
                            borderColor: item.active ? '#E53935' : '#E0E0E0',
                            borderRadius: 14,
                            borderWidth: 1.5,
                            height: 28,
                            justifyContent: 'center',
                            width: 28,
                          }}
                        />
                      </View>
                    ))}
                  </View>

                  {/* Daily Check-in Card */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      alignItems: 'center',
                      backgroundColor: '#FFF5F5',
                      borderColor: '#FFCDD2',
                      borderRadius: 12,
                      borderWidth: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                    }}
                  >
                    <View style={[layout.row, layout.itemsCenter]}>
                      <Svg height="20" style={{ marginRight: 10 }} viewBox="0 0 24 24" width="20">
                        <Path
                          d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"
                          fill="#E53935"
                        />
                      </Svg>
                      <View>
                        <Text style={{ color: '#E53935', fontSize: 12, fontWeight: '700' }}>
                          Điểm danh hôm nay
                        </Text>
                        <Text style={{ color: '#757575', fontSize: 11, marginTop: 1 }}>
                          Để chuỗi ngày học +2 XP
                        </Text>
                      </View>
                    </View>
                    <Svg height="14" viewBox="0 0 24 24" width="14">
                      <Path
                        d="M9 5l7 7-7 7"
                        fill="none"
                        stroke="#E53935"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                      />
                    </Svg>
                  </TouchableOpacity>

                  {/* Record info */}
                  <View
                    style={{
                      alignItems: 'center',
                      backgroundColor: '#F9FAFB',
                      borderRadius: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <View style={[layout.row, layout.itemsCenter]}>
                      <Svg height="16" style={{ marginRight: 8 }} viewBox="0 0 24 24" width="16">
                        <Path
                          d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"
                          fill="#F5A623"
                        />
                      </Svg>
                      <Text style={{ color: '#4B5563', fontSize: 12, fontWeight: '600' }}>
                        Kỷ lục: 0 ngày
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

              {/* ================= CARD 5: BẢNG XẾP HẠNG ================= */}
              <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#F0F2F5',
                    borderRadius: 16,
                    borderWidth: 1,
                    elevation: 1.5,
                    padding: 16,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 5,
                  }}
                >
                  {/* Header */}
                  <View
                    style={[
                      layout.row,
                      layout.justifyBetween,
                      layout.itemsCenter,
                      { marginBottom: 14 },
                    ]}
                  >
                    <View style={[layout.row, layout.itemsCenter]}>
                      <View
                        style={{
                          backgroundColor: '#FFB74D',
                          borderRadius: 16,
                          height: 32,
                          width: 32,
                        }}
                      />
                      <Text
                        style={{
                          color: '#111827',
                          fontSize: 14,
                          fontWeight: '700',
                          marginLeft: 10,
                        }}
                      >
                        Bảng xếp hạng
                      </Text>
                    </View>

                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={{ color: '#0E84F2', fontSize: 12, fontWeight: '700' }}>
                        Xem tất cả {'>'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Leaderboard list */}
                  <View style={{ rowGap: 12 }}>
                    {/* Rank 1 */}
                    <View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
                      <View style={[layout.row, layout.itemsCenter]}>
                        <View
                          style={{
                            alignItems: 'center',
                            backgroundColor: '#F5A623',
                            borderRadius: 12,
                            height: 24,
                            justifyContent: 'center',
                            width: 24,
                          }}
                        >
                          <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>1</Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#E0E0E0',
                            borderRadius: 16,
                            height: 32,
                            marginLeft: 10,
                            marginRight: 10,
                            width: 32,
                          }}
                        />
                        <View>
                          <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>
                            Thư
                          </Text>
                          <Text style={{ color: '#9E9E9E', fontSize: 10, marginTop: 1 }}>
                            Level 14
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: '#4B5563', fontSize: 12, fontWeight: '700' }}>
                        5.665 XP
                      </Text>
                    </View>

                    {/* Rank 2 */}
                    <View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
                      <View style={[layout.row, layout.itemsCenter]}>
                        <View
                          style={{
                            alignItems: 'center',
                            backgroundColor: '#7E57C2',
                            borderRadius: 12,
                            height: 24,
                            justifyContent: 'center',
                            width: 24,
                          }}
                        >
                          <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>2</Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#E0E0E0',
                            borderRadius: 16,
                            height: 32,
                            marginLeft: 10,
                            marginRight: 10,
                            width: 32,
                          }}
                        />
                        <View>
                          <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>
                            Tú Minh
                          </Text>
                          <Text style={{ color: '#9E9E9E', fontSize: 10, marginTop: 1 }}>
                            Level 11
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: '#4B5563', fontSize: 12, fontWeight: '700' }}>
                        5.010 XP
                      </Text>
                    </View>

                    {/* Rank 3 */}
                    <View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
                      <View style={[layout.row, layout.itemsCenter]}>
                        <View
                          style={{
                            alignItems: 'center',
                            backgroundColor: '#FF7043',
                            borderRadius: 12,
                            height: 24,
                            justifyContent: 'center',
                            width: 24,
                          }}
                        >
                          <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>3</Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: '#E0E0E0',
                            borderRadius: 16,
                            height: 32,
                            marginLeft: 10,
                            marginRight: 10,
                            width: 32,
                          }}
                        />
                        <View>
                          <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>
                            Quỳnh Chu
                          </Text>
                          <Text style={{ color: '#9E9E9E', fontSize: 10, marginTop: 1 }}>
                            Level 7
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: '#4B5563', fontSize: 12, fontWeight: '700' }}>
                        4.495 XP
                      </Text>
                    </View>

                    {/* Current User Row */}
                    <View
                      style={{
                        alignItems: 'center',
                        backgroundColor: '#FFF5F5',
                        borderRadius: 12,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 4,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                      }}
                    >
                      <View style={[layout.row, layout.itemsCenter]}>
                        <View
                          style={{
                            backgroundColor: '#F3E8FF',
                            borderRadius: 16,
                            height: 32,
                            marginRight: 10,
                            overflow: 'hidden',
                            width: 32,
                          }}
                        >
                          <Svg height="32" viewBox="0 0 100 100" width="32">
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
                        <View>
                          <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>
                            Hoàng Văn Hùng <Text style={{ color: '#E53935' }}>(Bạn)</Text>
                          </Text>
                          <Text style={{ color: '#9E9E9E', fontSize: 10, marginTop: 1 }}>
                            Level 1
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: '#111827', fontSize: 12, fontWeight: '700' }}>
                        0 XP
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

            </ScrollView>
          </View>

          {/* ================= TAB 2: EDUCATION (LEARN) ================= */}
          {visitedTabs.learn && (
            <View style={[layout.flex_1, { display: activeTab === 'learn' ? 'flex' : 'none' }]}>
              <EducationContent />
            </View>
          )}

          {/* ================= TAB 3: GAME ================= */}
          {visitedTabs.game && (
            <View style={[layout.flex_1, { display: activeTab === 'game' ? 'flex' : 'none' }]}>
              <GameContent />
            </View>
          )}

          {/* ================= TAB 4: STATISTICS ================= */}
          {visitedTabs.stats && (
            <View style={[layout.flex_1, { display: activeTab === 'stats' ? 'flex' : 'none' }]}>
              <StatisticsContent />
            </View>
          )}

          {/* ================= TAB 5: PROFILE ================= */}
          {visitedTabs.profile && (
            <View style={[layout.flex_1, { display: activeTab === 'profile' ? 'flex' : 'none' }]}>
              <ProfileContent onLogout={() => navigation.navigate(Paths.Login)} />
            </View>
          )}
        </View>

        {/* ================= BOTTOM TAB NAVIGATION ================= */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderTopColor: '#EEEEEE',
            borderTopWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingBottom: 8,
            paddingTop: 8,
          }}
        >
          {/* Tab 1: Home */}
          <TouchableOpacity
            activeOpacity={0.7}
            delayPressIn={0}
            onPress={() => switchTab('home')}
            style={{ alignItems: 'center', flex: 1, paddingVertical: 4 }}
          >
            <Svg height="22" viewBox="0 0 24 24" width="22">
              <Path
                d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
                fill={activeTab === 'home' ? '#0E84F2' : '#9E9E9E'}
              />
            </Svg>
          </TouchableOpacity>

          {/* Tab 2: Học tập (Graduation cap / Book) */}
          <TouchableOpacity
            activeOpacity={0.7}
            delayPressIn={0}
            onPress={() => switchTab('learn')}
            style={{ alignItems: 'center', flex: 1, paddingVertical: 4 }}
          >
            <Svg height="22" viewBox="0 0 24 24" width="22">
              <Path
                d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13.5l-6-3.27V17c0 3.31 2.69 6 6 6s6-2.69 6-6v-3.77l-6 3.27z"
                fill={activeTab === 'learn' ? '#0E84F2' : '#9E9E9E'}
              />
            </Svg>
          </TouchableOpacity>

          {/* Tab 3: Game / Practice */}
          <TouchableOpacity
            activeOpacity={0.7}
            delayPressIn={0}
            onPress={() => switchTab('game')}
            style={{ alignItems: 'center', flex: 1, paddingVertical: 4 }}
          >
            <Svg height="22" viewBox="0 0 24 24" width="22">
              <Path
                d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                fill={activeTab === 'game' ? '#0E84F2' : '#9E9E9E'}
              />
            </Svg>
          </TouchableOpacity>

          {/* Tab 4: Thống kê (Bar chart 📊) */}
          <TouchableOpacity
            activeOpacity={0.7}
            delayPressIn={0}
            onPress={() => switchTab('stats')}
            style={{ alignItems: 'center', flex: 1, paddingVertical: 4 }}
          >
            <Svg height="22" viewBox="0 0 24 24" width="22">
              <Path
                d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"
                fill={activeTab === 'stats' ? '#0E84F2' : '#9E9E9E'}
              />
            </Svg>
          </TouchableOpacity>

          {/* Tab 5: Settings / Profile */}
          <TouchableOpacity
            activeOpacity={0.7}
            delayPressIn={0}
            onPress={() => switchTab('profile')}
            style={{ alignItems: 'center', flex: 1, paddingVertical: 4 }}
          >
            <Svg height="22" viewBox="0 0 24 24" width="22">
              <Path
                d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                fill={activeTab === 'profile' ? '#0E84F2' : '#9E9E9E'}
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
}

export default Home;
