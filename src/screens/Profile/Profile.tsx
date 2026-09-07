import type { RootScreenProps } from '@/navigation/types';

import React, { useState } from 'react';
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { SafeScreen } from '@/components/templates';
import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';

export function ProfileContent({ onLogout }: { onLogout?: () => void }) {
  const { layout } = useTheme();

  const [displayName, setDisplayName] = useState('Hoàng Văn Hùng');
  const [email] = useState('hunghv@gmail.com');
  const [showPinyin, setShowPinyin] = useState(true);
  const [anonymousActivity, setAnonymousActivity] = useState(true);

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
              Tài khoản người dùng
            </Text>

            {/* Subtitle */}
            <Text
              style={{
                color: '#4B5563',
                fontSize: 13,
                lineHeight: 18,
              }}
            >
              Thông tin tài khoản, cài đặt & cập nhật thông tin
            </Text>
          </View>

          {/* ================= CARD 1: HỒ SƠ ================= */}
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
              {/* Title & Subtitle */}
              <Text
                style={{
                  color: '#111827',
                  fontSize: 15,
                  fontWeight: '700',
                  marginBottom: 2,
                }}
              >
                Hồ sơ
              </Text>
              <Text
                style={{
                  color: '#6B7280',
                  fontSize: 12,
                  marginBottom: 16,
                }}
              >
                Tên và ảnh đại diện của bạn hiển thị trên bảng xếp hạng trò chơi.
              </Text>

              {/* Avatar Section */}
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                {/* Circular Avatar */}
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#F3E8FF',
                    borderColor: '#E9D5FF',
                    borderRadius: 44,
                    borderWidth: 1.5,
                    height: 88,
                    justifyContent: 'center',
                    marginBottom: 12,
                    overflow: 'hidden',
                    width: 88,
                  }}
                >
                  <Svg height="88" viewBox="0 0 100 100" width="88">
                    {/* Background */}
                    <Rect fill="#FDF4FF" height="100" width="100" />
                    {/* Head / Hair */}
                    <Circle cx="50" cy="46" fill="#3E2723" r="28" />
                    {/* Face */}
                    <Circle cx="50" cy="50" fill="#FFDFC4" r="20" />
                    {/* Anime hair front */}
                    <Path
                      d="M32 40c4-10 14-16 26-14 8 2 14 8 16 16-4-2-9-2-14 1-5 3-10 3-14-1-6-1-10 0-14-2z"
                      fill="#2D1B16"
                    />
                    {/* Eyes */}
                    <Circle cx="44" cy="50" fill="#2D1B16" r="3.5" />
                    <Circle cx="56" cy="50" fill="#2D1B16" r="3.5" />
                    <Circle cx="45" cy="49" fill="#FFFFFF" r="1.2" />
                    <Circle cx="57" cy="49" fill="#FFFFFF" r="1.2" />
                    {/* Smile */}
                    <Path
                      d="M48 57c1 1 3 1 4 0"
                      fill="none"
                      stroke="#A35948"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                    />
                    {/* Clothes */}
                    <Path
                      d="M26 88c2-12 12-18 24-18s22 6 24 18z"
                      fill="#374151"
                    />
                    <Path
                      d="M44 70l6 8 6-8z"
                      fill="#FFDFC4"
                    />
                  </Svg>
                </View>

                {/* Avatar Action Buttons */}
                <View style={[layout.row, layout.itemsCenter]}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      alignItems: 'center',
                      backgroundColor: '#FAF8F5',
                      borderColor: '#E5E7EB',
                      borderRadius: 8,
                      borderWidth: 1,
                      flexDirection: 'row',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                    }}
                  >
                    <Svg height="14" style={{ marginRight: 6 }} viewBox="0 0 24 24" width="14">
                      <Path
                        d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z"
                        fill="#374151"
                      />
                      <Path
                        d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                        fill="#374151"
                      />
                    </Svg>
                    <Text style={{ color: '#374151', fontSize: 12, fontWeight: '600' }}>
                      Đổi ảnh
                    </Text>
                  </TouchableOpacity>

                  {/* Delete Button */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      alignItems: 'center',
                      height: 32,
                      justifyContent: 'center',
                      marginLeft: 10,
                      width: 32,
                    }}
                  >
                    <Svg height="16" viewBox="0 0 24 24" width="16">
                      <Path
                        d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                        fill="#EF4444"
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>

                {/* File format hint */}
                <Text
                  style={{
                    color: '#9CA3AF',
                    fontSize: 10,
                    marginTop: 8,
                    textAlign: 'center',
                  }}
                >
                  JPG, PNG hoặc WebP. Ảnh sẽ được cắt vuông tự động.
                </Text>
              </View>

              {/* Input: Tên hiển thị */}
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    color: '#374151',
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: 6,
                  }}
                >
                  Tên hiển thị
                </Text>
                <TextInput
                  onChangeText={setDisplayName}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB',
                    borderRadius: 8,
                    borderWidth: 1,
                    color: '#111827',
                    fontSize: 13,
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                  }}
                  value={displayName}
                />
              </View>

              {/* Input: Email */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  style={{
                    color: '#374151',
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: 6,
                  }}
                >
                  Email
                </Text>
                <TextInput
                  editable={false}
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderColor: '#E5E7EB',
                    borderRadius: 8,
                    borderWidth: 1,
                    color: '#9CA3AF',
                    fontSize: 13,
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                  }}
                  value={email}
                />
              </View>

              {/* Bottom Actions Row */}
              <View style={[layout.row, { columnGap: 10 }]}>
                {/* Save Changes Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#64748B',
                    borderRadius: 8,
                    justifyContent: 'center',
                    paddingHorizontal: 18,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
                    Lưu thay đổi
                  </Text>
                </TouchableOpacity>

                {/* Change Password Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    alignItems: 'center',
                    backgroundColor: '#FAF8F5',
                    borderColor: '#E5E7EB',
                    borderRadius: 8,
                    borderWidth: 1,
                    flexDirection: 'row',
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  }}
                >
                  <Svg height="14" style={{ marginRight: 6 }} viewBox="0 0 24 24" width="14">
                    <Path
                      d="M12.65 10A5.99 5.99 0 007 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 005.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                      fill="#4B5563"
                    />
                  </Svg>
                  <Text style={{ color: '#374151', fontSize: 12, fontWeight: '700' }}>
                    Đổi mật khẩu
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* ================= CARD 2: HIỂN THỊ KHI HỌC ================= */}
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
                  fontSize: 15,
                  fontWeight: '700',
                  marginBottom: 2,
                }}
              >
                Hiển thị khi học
              </Text>
              <Text
                style={{
                  color: '#6B7280',
                  fontSize: 12,
                  marginBottom: 14,
                }}
              >
                Cách các bài học hiển thị mặc định trên mọi thiết bị của bạn.
              </Text>

              {/* Toggle Setting Row */}
              <View style={[layout.row, layout.justifyBetween, layout.itemsCenter, { marginBottom: 6 }]}>
                <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>
                  Hiện pinyin trong bài học
                </Text>
                <Switch
                  onValueChange={setShowPinyin}
                  thumbColor="#FFFFFF"
                  trackColor={{ false: '#D1D5DB', true: '#1E293B' }}
                  value={showPinyin}
                />
              </View>
              <Text
                style={{
                  color: '#6B7280',
                  fontSize: 11,
                  lineHeight: 16,
                }}
              >
                Tắt để ẩn pinyin ngay từ đầu ở trang bài học và trang chủ đề, giúp bạn tập nhớ mặt chữ. Khi cần, bạn vẫn bấm được nút <Text style={{ fontWeight: '700' }}>Hiện pinyin</Text> ngay trên trang để xem tạm thời.
              </Text>
            </View>
          </View>

          {/* ================= CARD 3: QUYỀN RIÊNG TƯ ================= */}
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
              <Text
                style={{
                  color: '#111827',
                  fontSize: 15,
                  fontWeight: '700',
                  marginBottom: 2,
                }}
              >
                Quyền riêng tư
              </Text>
              <Text
                style={{
                  color: '#6B7280',
                  fontSize: 12,
                  marginBottom: 14,
                }}
              >
                Kiểm soát thông tin hiển thị công khai trên trang chủ.
              </Text>

              {/* Toggle Setting Row */}
              <View style={[layout.row, layout.justifyBetween, layout.itemsCenter, { marginBottom: 6 }]}>
                <Text style={{ color: '#111827', fontSize: 13, fontWeight: '700' }}>
                  Hiển thị hoạt động ẩn danh trên trang chủ
                </Text>
                <Switch
                  onValueChange={setAnonymousActivity}
                  thumbColor="#FFFFFF"
                  trackColor={{ false: '#D1D5DB', true: '#1E293B' }}
                  value={anonymousActivity}
                />
              </View>
              <Text
                style={{
                  color: '#6B7280',
                  fontSize: 11,
                  lineHeight: 16,
                }}
              >
                Khi bật, hoạt động của bạn (đăng ký, tải worksheet, luyện chữ) sẽ hiển thị trên trang chủ với tên ẩn danh: <Text style={{ fontWeight: '700' }}>Ng***n V. A.</Text> Tên đầy đủ và email không bao giờ bị tiết lộ.
              </Text>
            </View>
          </View>

          {/* ================= LOGOUT ACTION BUTTON ================= */}
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              delayPressIn={0}
              onPress={onLogout}
              style={{
                alignItems: 'center',
                backgroundColor: '#0E84F2',
                borderRadius: 24,
                flexDirection: 'row',
                justifyContent: 'center',
                paddingHorizontal: 28,
                paddingVertical: 12,
              }}
            >
              <Svg height="18" style={{ marginRight: 8 }} viewBox="0 0 24 24" width="18">
                <Path
                  d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                  fill="#FFFFFF"
                />
              </Svg>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
  );
}

function Profile({ navigation }: RootScreenProps<Paths.Profile>) {
  const { layout } = useTheme();

  return (
    <SafeScreen style={{ backgroundColor: '#FFFFFF' }}>
      <View style={[layout.flex_1, { backgroundColor: '#FFFFFF' }]}>
        <ProfileContent onLogout={() => navigation.navigate(Paths.Login)} />

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
            onPress={() => navigation.navigate(Paths.Home, { tab: 'stats' })}
            style={{ alignItems: 'center', flex: 1, paddingVertical: 4 }}
          >
            <Svg height="22" viewBox="0 0 24 24" width="22">
              <Path
                d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"
                fill="#9E9E9E"
              />
            </Svg>
          </TouchableOpacity>

          {/* Tab 5: Settings / Profile */}
          <TouchableOpacity
            activeOpacity={0.7}
            delayPressIn={0}
            style={{ alignItems: 'center', flex: 1, paddingVertical: 4 }}
          >
            <Svg height="22" viewBox="0 0 24 24" width="22">
              <Path
                d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
                fill="#0E84F2"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
}

export default Profile;
