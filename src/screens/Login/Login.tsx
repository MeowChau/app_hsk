import type { RootScreenProps } from '@/navigation/types';

import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Paths } from '@/navigation/paths';
import { useTheme, hs, vs, ms } from '@/theme';
import { Button, Logo } from '@/components/atoms';
import { InputField } from '@/components/molecules';
import { SafeScreen } from '@/components/templates';

function Login({ navigation }: RootScreenProps<Paths.Login>) {
  const { colors, fonts, gutters, layout } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeScreen style={{ backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[layout.flex_1]}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: hs(24), paddingTop: vs(40), paddingBottom: vs(20) }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View
            style={[
              layout.row,
              layout.justifyBetween,
              layout.itemsCenter,
              gutters.marginBottom_40,
            ]}
          >
            <Logo variant="primary" />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(Paths.Register)}
              style={{
                borderColor: colors.primary,
                borderRadius: ms(20),
                borderWidth: 1.5,
                paddingHorizontal: hs(14),
                paddingVertical: vs(6),
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: ms(12),
                  fontWeight: '600',
                }}
              >
                Chưa có tài khoản?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text
            style={[
              fonts.bold,
              {
                color: '#000000',
                fontSize: ms(22),
                marginBottom: vs(32),
              },
            ]}
          >
            Chào mừng bạn đã quay trở lại
          </Text>

          {/* Input Fields */}
          <View style={{ marginBottom: vs(28) }}>
            <InputField
              autoCapitalize="none"
              iconType="mail"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email"
              style={{ marginBottom: vs(16) }}
              value={email}
            />
            <InputField
              iconType="lock"
              onChangeText={setPassword}
              placeholder="Mật khẩu"
              secureTextEntry
              value={password}
            />
          </View>

          {/* Main Action Button */}
          <Button
            fullWidth
            onPress={() => {
              navigation.navigate(Paths.MainTabs);
            }}
            title="Đăng nhập"
            variant="primary"
          />

          {/* Divider "HOẶC" */}
          <View
            style={[
              layout.row,
              layout.itemsCenter,
              layout.justifyCenter,
              { marginVertical: vs(32) },
            ]}
          >
            <View style={{ backgroundColor: '#2B2B2B', flex: 1, height: 1.5 }} />
            <Text
              style={{
                color: '#4D4D4D',
                fontSize: ms(14),
                fontWeight: '600',
                marginHorizontal: hs(16),
              }}
            >
              HOẶC
            </Text>
            <View style={{ backgroundColor: '#2B2B2B', flex: 1, height: 1.5 }} />
          </View>

          {/* Google Sign-in */}
          <View style={[layout.row, layout.justifyCenter]}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                alignItems: 'center',
                height: vs(48),
                justifyContent: 'center',
                width: hs(48),
              }}
            >
              <Svg height={38} viewBox="0 0 48 48" width={38}>
                <Path
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  fill="#EA4335"
                />
                <Path
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  fill="#4285F4"
                />
                <Path
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  fill="#FBBC05"
                />
                <Path
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  fill="#34A853"
                />
                <Path d="M0 0h48v48H0z" fill="none" />
              </Svg>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

export default Login;
