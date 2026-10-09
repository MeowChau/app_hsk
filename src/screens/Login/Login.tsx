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

import { Alert } from 'react-native';
import { useLogin } from '@/services/auth';

function Login({ navigation }: RootScreenProps<Paths.Login>) {
  const { colors, fonts, gutters, layout } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    loginMutation.mutate(
      { email: trimmedEmail, password: trimmedPassword },
      {
        onSuccess: () => {
          navigation.navigate(Paths.MainTabs);
        },
        onError: (err: any) => {
          const defaultMsg = 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.';
          if (err?.response) {
            err.response
              .json()
              .then((data: any) => {
                let apiMsg = data?.message || data?.errors?.email || data?.errors?.password;
                if (data?.errors?.status === 'accountPendingApproval' || data?.errors?.status === 'accountNotActive') {
                  apiMsg = data?.message || 'Tài khoản của bạn đang chờ duyệt từ phía admin. Vui lòng quay lại sau khi tài khoản được duyệt.';
                }
                Alert.alert('Đăng nhập thất bại', apiMsg || defaultMsg);
              })
              .catch(() => {
                Alert.alert('Đăng nhập thất bại', defaultMsg);
              });
            return;
          }
          Alert.alert('Đăng nhập thất bại', err?.message || defaultMsg);
        },
      },
    );
  };

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
            <TouchableOpacity 
              style={{ alignSelf: 'flex-end', marginTop: vs(12) }}
              onPress={() => navigation.navigate(Paths.ForgotPassword)}
            >
              <Text style={{ color: '#1E40AF', fontSize: ms(14), fontWeight: '600' }}>
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Action Button */}
          <Button
            fullWidth
            loading={loginMutation.isPending}
            onPress={handleLogin}
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
