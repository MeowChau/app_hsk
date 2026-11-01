import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AppAlert } from '@/services/feedback/appAlert';
import { SafeScreen } from '@/components/templates';
import { InputField } from '@/components/molecules';
import { Button, Logo } from '@/components/atoms';
import { useTheme } from '@/theme';
import type { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { useResetPassword } from '@/services/auth/useAuth';
import InputError from '@/components/atoms/InputError';
import { getFormErrors } from '@/services/auth/formErrors';
import type { FormErrors } from '@/services/auth/formErrors';

const ResetPassword = ({ route, navigation }: RootScreenProps<Paths.ResetPassword>) => {
  const { fonts, layout } = useTheme();
  const hash = route?.params?.hash;
  const email = route?.params?.email;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const resetPasswordMutation = useResetPassword();
  const isLoading = resetPasswordMutation.isPending;

  const handleReset = async () => {
    if (!hash) {
      AppAlert.error(
        'Lỗi',
        'Liên kết đổi mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng thực hiện lại từ bước Quên mật khẩu.',
        [
          {
            text: 'Quay lại',
            onPress: () => navigation.navigate(Paths.ForgotPassword),
          },
        ],
      );
      return;
    }

    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    const nextErrors: FormErrors = {
      password: !trimmedPassword ? 'Vui lòng nhập mật khẩu mới.' : trimmedPassword.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự.' : undefined,
      confirmPassword: !trimmedConfirm ? 'Vui lòng xác nhận mật khẩu mới.' : trimmedPassword !== trimmedConfirm ? 'Mật khẩu xác nhận không khớp.' : undefined,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    try {
      await resetPasswordMutation.mutateAsync({
        hash,
        password: trimmedPassword,
      });
      
      AppAlert.success(
        'Đổi mật khẩu thành công',
        'Mật khẩu của bạn đã được cập nhật thành công! Vui lòng đăng nhập với mật khẩu mới.',
        [
          { text: 'Đăng nhập ngay', onPress: () => navigation.navigate(Paths.Login) }
        ]
      );
    } catch (error) {
      setErrors(await getFormErrors(error, 'Không thể đổi mật khẩu. Liên kết có thể đã hết hạn.'));
    }
  };

  return (
    <SafeScreen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[layout.flex_1]}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 20 }}>
          <View style={{ marginBottom: 40, flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Logo variant="primary" />
          </View>

          <View style={{ marginBottom: 40 }}>
            <Text style={[fonts.bold, { fontSize: 24, marginBottom: 8, color: '#111827' }]}>
              Khôi phục mật khẩu
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 20 }}>
              {email ? (
                <>
                  Tài khoản: <Text style={{ fontWeight: 'bold' }}>{email}</Text>. Vui lòng nhập mật khẩu mới bên dưới.
                </>
              ) : (
                'Vui lòng nhập mật khẩu mới cho tài khoản của bạn.'
              )}
            </Text>
          </View>

          <View style={{ marginBottom: 24 }}>
            <InputField
              iconType="lock"
              error={errors.password}
              onChangeText={value => { setPassword(value); setErrors(current => ({ ...current, password: undefined, confirmPassword: undefined, form: undefined })); }}
              placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
              secureTextEntry
              value={password}
              containerStyle={{ marginBottom: 16 }}
            />
            <InputField
              iconType="lock"
              error={errors.confirmPassword}
              onChangeText={value => { setConfirmPassword(value); setErrors(current => ({ ...current, confirmPassword: undefined, form: undefined })); }}
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry
              value={confirmPassword}
            />
            <InputError message={errors.form} />
          </View>

          <Button
            fullWidth
            loading={isLoading}
            onPress={handleReset}
            title="Đổi mật khẩu"
            variant="primary"
          />

          <TouchableOpacity
            style={{ marginTop: 24, alignItems: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#6B7280', fontSize: 14, fontWeight: '600' }}>
              Quay lại
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

export default ResetPassword;
