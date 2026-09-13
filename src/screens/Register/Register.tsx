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

function Register({ navigation }: RootScreenProps<Paths.Register>) {
  const { colors, fonts, gutters, layout } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
              gutters.marginBottom_32,
            ]}
          >
            <Logo variant="primary" />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate(Paths.Login)}
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
                Đã có tài khoản?
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
                marginBottom: vs(28),
              },
            ]}
          >
            Chào mừng bạn đã đến
          </Text>

          {/* Input Fields */}
          <View style={{ marginBottom: vs(24), rowGap: vs(14) }}>
            <InputField
              iconType="user"
              onChangeText={setUsername}
              placeholder="Tên người dùng"
              value={username}
            />
            <InputField
              autoCapitalize="none"
              iconType="mail"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email"
              value={email}
            />
            <InputField
              iconType="lock"
              onChangeText={setPassword}
              placeholder="Mật khẩu"
              secureTextEntry
              value={password}
            />
            <InputField
              iconType="lock"
              onChangeText={setConfirmPassword}
              placeholder="Xác nhận mật khẩu"
              secureTextEntry
              value={confirmPassword}
            />
          </View>

          {/* Main Action Button */}
          <Button
            fullWidth
            onPress={() => {
              navigation.navigate(Paths.Survey);
            }}
            title="Đăng ký"
            variant="primary"
          />

          {/* Divider "HOẶC" */}
          <AuthDivider />

          {/* Google Sign-in */}
          <GoogleSignInButton style={{ paddingBottom: vs(16) }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

export default Register;
