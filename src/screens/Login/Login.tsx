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

import { Paths } from '@/navigation/paths';
import { useTheme, hs, vs, ms } from '@/theme';
import { Button, Logo } from '@/components/atoms';
import { InputField, AuthDivider, GoogleSignInButton } from '@/components/molecules';
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
          <AuthDivider />

          {/* Google Sign-in */}
          <GoogleSignInButton />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

export default Login;
