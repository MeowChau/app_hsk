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


import { AppAlert } from '@/services/feedback/appAlert';
import { useRegister } from '@/services/auth';
import InputError from '@/components/atoms/InputError';
import { getFormErrors, validateEmail } from '@/services/auth/formErrors';
import type { FormErrors } from '@/services/auth/formErrors';

function Register({ navigation }: RootScreenProps<Paths.Register>) {
  const { colors, fonts, gutters, layout } = useTheme();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const registerMutation = useRegister();

  const handleRegister = () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const nextErrors: FormErrors = {
      username: !trimmedUsername ? 'Vui lòng nhập tên người dùng.' : undefined,
      email: validateEmail(trimmedEmail),
      password: !trimmedPassword ? 'Vui lòng nhập mật khẩu.' : trimmedPassword.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự.' : undefined,
      confirmPassword: !confirmPassword.trim() ? 'Vui lòng xác nhận mật khẩu.' : trimmedPassword !== confirmPassword.trim() ? 'Mật khẩu xác nhận không khớp.' : undefined,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    registerMutation.mutate(
      {
        username: trimmedUsername,
        email: trimmedEmail,
        password: trimmedPassword,
      },
      {
        onSuccess: () => {
          AppAlert.success(
            'Đăng ký thành công',
            'Tài khoản đã được tạo thành công! Vui lòng chờ quản trị viên duyệt trước khi đăng nhập.',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate(Paths.Login),
              },
            ],
          );
        },
        onError: async (error) => setErrors(await getFormErrors(error, 'Đăng ký không thành công. Vui lòng thử lại.')),
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
              error={errors.username}
              onChangeText={value => { setUsername(value); setErrors(current => ({ ...current, username: undefined, form: undefined })); }}
              placeholder="Tên người dùng"
              value={username}
            />
            <InputField
              autoCapitalize="none"
              iconType="mail"
              keyboardType="email-address"
              error={errors.email}
              onChangeText={value => { setEmail(value); setErrors(current => ({ ...current, email: undefined, form: undefined })); }}
              placeholder="Email"
              value={email}
            />
            <InputField
              iconType="lock"
              error={errors.password}
              onChangeText={value => { setPassword(value); setErrors(current => ({ ...current, password: undefined, confirmPassword: undefined, form: undefined })); }}
              placeholder="Mật khẩu"
              secureTextEntry
              value={password}
            />
            <InputField
              iconType="lock"
              error={errors.confirmPassword}
              onChangeText={value => { setConfirmPassword(value); setErrors(current => ({ ...current, confirmPassword: undefined, form: undefined })); }}
              placeholder="Xác nhận mật khẩu"
              secureTextEntry
              value={confirmPassword}
            />
            <InputError message={errors.form} />
          </View>

          {/* Main Action Button */}
          <Button
            fullWidth
            loading={registerMutation.isPending}
            onPress={handleRegister}
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
