import type { RootScreenProps } from '@/navigation/types';

import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { UserProfileCard } from './components/UserProfileCard';
import { DisplaySettingsCard } from './components/DisplaySettingsCard';
import { PrivacySettingsCard } from './components/PrivacySettingsCard';
import { HskLevelSettingsCard } from './components/HskLevelSettingsCard';
import { SafeScreen } from '@/components/templates';
import { Paths } from '@/navigation/paths';
import { useTheme, hs, vs, ms } from '@/theme';

export function ProfileContent({ onLogout }: { onLogout?: () => void }) {

  const [displayName, setDisplayName] = useState('Hoàng Văn Hùng');
  const [email] = useState('hunghv@gmail.com');
  const [currentHskLevel, setCurrentHskLevel] = useState(1);
  const [showPinyin, setShowPinyin] = useState(true);
  const [anonymousActivity, setAnonymousActivity] = useState(true);

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: vs(24) }}
      showsVerticalScrollIndicator={false}
    >
          {/* ================= HEADER ================= */}
          <View style={{ paddingHorizontal: hs(16), paddingTop: vs(16), paddingBottom: vs(16) }}>
            {/* Title */}
            <Text
              style={{
                color: '#000000',
                fontSize: ms(28),
                fontWeight: '800',
                marginBottom: vs(4),
              }}
            >
              Tài khoản người dùng
            </Text>

            {/* Subtitle */}
            <Text
              style={{
                color: '#000000',
                fontSize: ms(16),
                lineHeight: ms(18),
              }}
            >
              Thông tin tài khoản, cài đặt & cập nhật thông tin
            </Text>
          </View>

          {/* ================= CARD 1: HỒ SƠ ================= */}
          <View style={{ paddingHorizontal: hs(16), marginBottom: vs(16) }}>
            <UserProfileCard
              displayName={displayName}
              email={email}
              setDisplayName={setDisplayName}
            />
          </View>

          {/* ================= CARD 1.5: TRÌNH ĐỘ HSK ================= */}
          <View style={{ paddingHorizontal: hs(16), marginBottom: vs(16) }}>
            <HskLevelSettingsCard 
              currentLevel={currentHskLevel}
              onLevelChange={setCurrentHskLevel}
            />
          </View>

          {/* ================= CARD 2: HIỂN THỊ KHI HỌC ================= */}
          <View style={{ paddingHorizontal: hs(16), marginBottom: vs(16) }}>
            <DisplaySettingsCard
              setShowPinyin={setShowPinyin}
              showPinyin={showPinyin}
            />
          </View>

          {/* ================= CARD 3: QUYỀN RIÊNG TƯ ================= */}
          <View style={{ paddingHorizontal: hs(16), marginBottom: vs(20) }}>
            <PrivacySettingsCard
              anonymousActivity={anonymousActivity}
              setAnonymousActivity={setAnonymousActivity}
            />
          </View>

          {/* ================= LOGOUT ACTION BUTTON ================= */}
          <View style={{ alignItems: 'center', marginBottom: vs(16) }}>
            <TouchableOpacity
              activeOpacity={0.8}
              delayPressIn={0}
              onPress={onLogout}
              style={{
                alignItems: 'center',
                backgroundColor: '#0E84F2',
                borderRadius: ms(24),
                flexDirection: 'row',
                justifyContent: 'center',
                paddingHorizontal: hs(28),
                paddingVertical: vs(12),
              }}
            >
              <Svg height="18" style={{ marginRight: hs(8) }} viewBox="0 0 24 24" width="18">
                <Path
                  d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                  fill="#FFFFFF"
                />
              </Svg>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: ms(14),
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
            paddingBottom: vs(8),
            paddingTop: vs(8),
          }}
        >
          {/* Tab 1: Home */}
          <TouchableOpacity
            activeOpacity={0.7}
            delayPressIn={0}
            onPress={() => navigation.navigate(Paths.Home)}
            style={{ alignItems: 'center', flex: 1, paddingVertical: vs(4) }}
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
            onPress={() => navigation.navigate(Paths.Learn)}
            style={{ alignItems: 'center', flex: 1, paddingVertical: vs(4) }}
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
            onPress={() => navigation.navigate(Paths.Game)}
            style={{ alignItems: 'center', flex: 1, paddingVertical: vs(4) }}
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
            onPress={() => navigation.navigate(Paths.Statistics)}
            style={{ alignItems: 'center', flex: 1, paddingVertical: vs(4) }}
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
            style={{ alignItems: 'center', flex: 1, paddingVertical: vs(4) }}
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
