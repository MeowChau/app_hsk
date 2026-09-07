import type { RootScreenProps } from '@/navigation/types';

import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { SafeScreen } from '@/components/templates';
import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';

// Dummy data for 21 bars in the 7 days chart
const barChartData = [
  { height: 50, isEstimate: true },
  { height: 50, isEstimate: true },
  { height: 50, isEstimate: true },
  { height: 50, isEstimate: true },
  { height: 50, isEstimate: true },
  { height: 50, isEstimate: true },
  { height: 50, isEstimate: true },
  { height: 4, isEstimate: false },
  { height: 50, isEstimate: false },
  { height: 12, isEstimate: false },
  { height: 18, isEstimate: false },
  { height: 26, isEstimate: false },
  { height: 50, isEstimate: true },
  { height: 50, isEstimate: true },
  { height: 50, isEstimate: true },
  { height: 22, isEstimate: false },
  { height: 16, isEstimate: false },
  { height: 20, isEstimate: false },
  { height: 50, isEstimate: true },
  { height: 48, isEstimate: false },
  { height: 18, isEstimate: false },
  { height: 56, isEstimate: false },
  { height: 10, isEstimate: false },
];

export function StatisticsContent() {
  const { layout } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
          {/* ================= HEADER ================= */}
          <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 }}>
            {/* Title */}
            <Text
              style={{
                color: '#111827',
                fontSize: 22,
                fontWeight: '800',
                marginBottom: 4,
              }}
            >
              Thống kê học tập
            </Text>

            {/* Subtitle */}
            <Text
              style={{
                color: '#4B5563',
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              Toàn bộ hành trình học của bạn, tính đến hôm nay.
            </Text>
          </View>

          {/* ================= CARD 1: THỜI GIAN HỌC ================= */}
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
                  Thời gian học
                </Text>
              </View>

              {/* Grid Tiles */}
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
                      Hôm nay
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
                      7 ngày qua
                    </Text>
                  </View>
                </View>

                {/* Row 2 - Full Width */}
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#F5F6F8',
                    borderRadius: 10,
                    paddingVertical: 12,
                  }}
                >
                  <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>
                    "Số lượng"
                  </Text>
                  <Text style={{ color: '#6B7280', fontSize: 11, marginTop: 2 }}>
                    Tổng cộng
                  </Text>
                </View>
              </View>

              {/* Info Note */}
              <View
                style={{
                  alignItems: 'flex-start',
                  flexDirection: 'row',
                  marginTop: 14,
                }}
              >
                <Svg
                  height="14"
                  style={{ marginRight: 6, marginTop: 2 }}
                  viewBox="0 0 24 24"
                  width="14"
                >
                  <Path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                    fill="#6B7280"
                  />
                </Svg>
                <Text
                  style={{
                    color: '#4B5563',
                    flex: 1,
                    fontSize: 11,
                    lineHeight: 16,
                  }}
                >
                  Chỉ tính lúc bạn thực sự đang học: ôn tập, bài học, chép chính tả và luyện gõ. Tab ẩn hoặc ngồi không quá 1 phút thì đồng hồ tự dừng.
                </Text>
              </View>
            </View>
          </View>

          {/* ================= CARD 2: 7 NGÀY GẦN NHẤT ================= */}
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
              {/* Header */}
              <Text
                style={{
                  color: '#111827',
                  fontSize: 14,
                  fontWeight: '700',
                  marginBottom: 12,
                }}
              >
                7 ngày gần nhất
              </Text>

              {/* Bar Chart Visualization */}
              <View
                style={{
                  alignItems: 'flex-end',
                  flexDirection: 'row',
                  height: 64,
                  justifyContent: 'space-between',
                  marginBottom: 6,
                  paddingHorizontal: 4,
                }}
              >
                {barChartData.map((bar, idx) => (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: bar.isEstimate ? '#E2E8F0' : '#0E84F2',
                      borderRadius: 2,
                      height: bar.height,
                      width: 5,
                    }}
                  />
                ))}
              </View>
              <Text
                style={{
                  color: '#94A3B8',
                  fontSize: 10,
                  marginBottom: 14,
                }}
              >
                Cột nhạt là ngày được ước tính.
              </Text>

              {/* 2x2 Stats Grid */}
              <View style={{ rowGap: 8 }}>
                {/* Row 1 */}
                <View style={[layout.row, { columnGap: 8 }]}>
                  <View
                    style={{
                      alignItems: 'center',
                      backgroundColor: '#F5F6F8',
                      borderRadius: 10,
                      flex: 1,
                      paddingVertical: 10,
                    }}
                  >
                    <Text style={{ color: '#6B7280', fontSize: 10 }}>
                      Trung bình mỗi ngày học
                    </Text>
                    <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700', marginTop: 2 }}>
                      "Số lượng"
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      backgroundColor: '#F5F6F8',
                      borderRadius: 10,
                      flex: 1,
                      paddingVertical: 10,
                    }}
                  >
                    <Text style={{ color: '#6B7280', fontSize: 10 }}>
                      Số ngày có học
                    </Text>
                    <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700', marginTop: 2 }}>
                      "Số lượng"
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
                      paddingVertical: 10,
                    }}
                  >
                    <Text style={{ color: '#6B7280', fontSize: 10 }}>
                      Ngày học nhiều nhất
                    </Text>
                    <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700', marginTop: 2 }}>
                      "Số lượng"
                    </Text>
                  </View>
                  <View
                    style={{
                      alignItems: 'center',
                      backgroundColor: '#F5F6F8',
                      borderRadius: 10,
                      flex: 1,
                      paddingVertical: 10,
                    }}
                  >
                    <Text style={{ color: '#6B7280', fontSize: 10 }}>
                      Chuỗi ngày dài nhất
                    </Text>
                    <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700', marginTop: 2 }}>
                      "Số lượng"
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* ================= CARD 3: THỜI GIAN THEO HOẠT ĐỘNG ================= */}
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
              <Text
                style={{
                  color: '#111827',
                  fontSize: 14,
                  fontWeight: '700',
                  marginBottom: 14,
                }}
              >
                Thời gian theo hoạt động
              </Text>

              {/* Progress List */}
              <View style={{ rowGap: 14 }}>
                {/* Activity 1: Ôn tập */}
                <View>
                  <View style={[layout.row, layout.justifyBetween, { marginBottom: 4 }]}>
                    <Text style={{ color: '#374151', fontSize: 12, fontWeight: '600' }}>
                      Ôn tập
                    </Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 11 }}>
                      {'<1 phút • 0%'}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#F1F5F9',
                      borderRadius: 3,
                      height: 6,
                      width: '100%',
                    }}
                  />
                </View>

                {/* Activity 2: Bài học */}
                <View>
                  <View style={[layout.row, layout.justifyBetween, { marginBottom: 4 }]}>
                    <Text style={{ color: '#374151', fontSize: 12, fontWeight: '600' }}>
                      Bài học
                    </Text>
                    <Text style={{ color: '#6B7280', fontSize: 11 }}>
                      1 giờ 1 phút • 63%
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#F1F5F9',
                      borderRadius: 3,
                      height: 6,
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: '#10B981',
                        borderRadius: 3,
                        height: '100%',
                        width: '63%',
                      }}
                    />
                  </View>
                </View>

                {/* Activity 3: Chép chính tả */}
                <View>
                  <View style={[layout.row, layout.justifyBetween, { marginBottom: 4 }]}>
                    <Text style={{ color: '#374151', fontSize: 12, fontWeight: '600' }}>
                      Chép chính tả
                    </Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 11 }}>
                      {'<1 phút • 0%'}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#F1F5F9',
                      borderRadius: 3,
                      height: 6,
                      width: '100%',
                    }}
                  />
                </View>

                {/* Activity 4: Luyện gõ */}
                <View>
                  <View style={[layout.row, layout.justifyBetween, { marginBottom: 4 }]}>
                    <Text style={{ color: '#374151', fontSize: 12, fontWeight: '600' }}>
                      Luyện gõ
                    </Text>
                    <Text style={{ color: '#6B7280', fontSize: 11 }}>
                      35 phút • 36%
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: '#F1F5F9',
                      borderRadius: 3,
                      height: 6,
                      overflow: 'hidden',
                      width: '100%',
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: '#F59E0B',
                        borderRadius: 3,
                        height: '100%',
                        width: '36%',
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* ================= CARD 4: THỐNG KÊ HỌC TẬP TỪ VỰNG ================= */}
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
            </View>
          </View>
        </ScrollView>
  );
}

function Statistics({ navigation }: RootScreenProps<Paths.Statistics>) {
  const { layout } = useTheme();

  return (
    <SafeScreen style={{ backgroundColor: '#FFFFFF' }}>
      <View style={[layout.flex_1, { backgroundColor: '#FFFFFF' }]}>
        <StatisticsContent />

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
            onPress={() => navigation.navigate(Paths.Home, { tab: 'home' })}
            style={{ alignItems: 'center', flex: 1, paddingVertical: 4 }}
          >
            <Svg height="22" viewBox="0 0 24 24" width="22">
              <Path
                d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
                fill="#9E9E9E"
              />
            </Svg>
          </TouchableOpacity>

          {/* Tab 2: Học tập */}
          <TouchableOpacity
            activeOpacity={0.7}
            delayPressIn={0}
            onPress={() => navigation.navigate(Paths.Home, { tab: 'learn' })}
            style={{ alignItems: 'center', flex: 1, paddingVertical: 4 }}
          >
            <Svg height="22" viewBox="0 0 24 24" width="22">
              <Path
                d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 13.5l-6-3.27V17c0 3.31 2.69 6 6 6s6-2.69 6-6v-3.77l-6 3.27z"
                fill="#9E9E9E"
              />
            </Svg>
          </TouchableOpacity>

          {/* Tab 3: Game */}
          <TouchableOpacity
            activeOpacity={0.7}
            delayPressIn={0}
            onPress={() => navigation.navigate(Paths.Home, { tab: 'game' })}
            style={{ alignItems: 'center', flex: 1, paddingVertical: 4 }}
          >
            <Svg height="22" viewBox="0 0 24 24" width="22">
              <Path
                d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5S17.67 9 18.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
                fill="#9E9E9E"
              />
            </Svg>
          </TouchableOpacity>

          {/* Tab 4: Thống kê */}
          <TouchableOpacity
            activeOpacity={0.7}
            delayPressIn={0}
            style={{ alignItems: 'center', flex: 1, paddingVertical: 4 }}
          >
            <Svg height="22" viewBox="0 0 24 24" width="22">
              <Path
                d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"
                fill="#0E84F2"
              />
            </Svg>
          </TouchableOpacity>

          {/* Tab 5: Settings / Profile */}
          <TouchableOpacity
            activeOpacity={0.7}
            delayPressIn={0}
            onPress={() => navigation.navigate(Paths.Home, { tab: 'profile' })}
            style={{ alignItems: 'center', flex: 1, paddingVertical: 4 }}
          >
            <Svg height="22" viewBox="0 0 24 24" width="22">
              <Path
                d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                fill="#9E9E9E"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
}

export default Statistics;
