import type { RootScreenProps } from '@/navigation/types';

import React from 'react';
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { Paths } from '@/navigation/paths';
import { useTheme, hs, vs, ms } from '@/theme';
import { AssetByVariant, Logo } from '@/components/atoms';
import { SafeScreen } from '@/components/templates';

function Onboarding({ navigation }: RootScreenProps<Paths.Onboarding>) {
  const { layout } = useTheme();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();

  // Tỉ lệ tương thích với kích thước màn hình
  const isSmallScreen = screenHeight < 720;
  const scale = Math.min(screenWidth / 414, 1);

  // Kích thước chuẩn theo tỉ lệ Figma 428 x 932
  const containerWidth = 370 * scale;
  const containerHeight = (isSmallScreen ? 430 : 510) * scale;

  // Bạn nữ: 236 x 500 chuẩn Figma
  const girlWidth = 236 * scale;
  const girlHeight = (isSmallScreen ? 430 : 510) * scale;
  const girlLeft = 8 * scale;

  // Chồng sách: rộng hơn và đẩy sát sâu vào sau lưng bạn nữ
  const booksWidth = 310 * scale;
  const booksHeight = (isSmallScreen ? 345 : 415) * scale;
  const booksLeft = 60 * scale; // Trượt sang trái để mép sách ôm sát sau lưng bạn nữ
  const booksBottom = (isSmallScreen ? 28 : 38) * scale; // Đỉnh ly cà phê cao đúng ngang tai/tóc bạn nữ

  return (
    <SafeScreen style={{ backgroundColor: '#0E84F2' }}>
      <View style={[layout.flex_1, layout.col]}>
        {/* Spacer trên */}
        <View style={{ flex: 0.4 }} />

        {/* Header Logo - sát ngay trên cụm ảnh */}
        <View
          style={[
            layout.row,
            layout.justifyCenter,
            layout.itemsCenter,
            { marginBottom: vs(12) },
          ]}
        >
          <Logo variant="light" />
        </View>

        {/* Illustration (Bạn nữ + Chồng sách) */}
        <View
          style={[
            layout.itemsCenter,
            { overflow: 'hidden', width: '100%' },
          ]}
        >
          <View
            style={{
              height: containerHeight,
              position: 'relative',
              width: containerWidth,
            }}
          >
            {/* Chồng sách 3D (nằm phía sau) */}
            <AssetByVariant
              path="books"
              resizeMode="contain"
              style={{
                bottom: booksBottom,
                height: booksHeight,
                left: booksLeft,
                position: 'absolute',
                width: booksWidth,
              }}
            />
            {/* Bạn nữ 3D (nằm phía trước, tựa vào sách) */}
            <AssetByVariant
              path="student"
              resizeMode="contain"
              style={{
                bottom: vs(0),
                height: girlHeight,
                left: girlLeft,
                position: 'absolute',
                width: girlWidth,
              }}
            />
          </View>
        </View>

        {/* Bottom Actions - sát ngay dưới chân bạn nữ */}
        <View
          style={{
            alignSelf: 'center',
            columnGap: hs(24),
            flexDirection: 'row',
            maxWidth: 338,
            marginTop: vs(16),
            paddingBottom: isSmallScreen ? 16 : 28,
            paddingHorizontal: hs(16),
            width: '100%',
          }}
        >
          {/* Nút Đăng nhập */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate(Paths.Login)}
            style={{
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.16)',
              borderColor: 'rgba(255, 255, 255, 0.85)',
              borderRadius: ms(24),
              borderWidth: 1.5,
              flex: 1,
              height: vs(48),
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '600' }}>
              Đăng nhập
            </Text>
          </TouchableOpacity>

          {/* Nút Đăng ký */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate(Paths.Register)}
            style={{
              alignItems: 'center',
              backgroundColor: '#CCE3EB',
              borderRadius: ms(24),
              flex: 1,
              height: vs(48),
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#2C3E50', fontSize: ms(16), fontWeight: '600' }}>
              Đăng ký
            </Text>
          </TouchableOpacity>
        </View>

        {/* Spacer dưới */}
        <View style={{ flex: 0.6 }} />
      </View>
    </SafeScreen>
  );
}

export default Onboarding;
