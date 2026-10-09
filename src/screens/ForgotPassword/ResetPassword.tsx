import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeScreen } from '@/components/templates';
import { InputField } from '@/components/molecules';
import { Button, Logo } from '@/components/atoms';
import { useTheme } from '@/theme';
import type { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { instance } from '@/services/instance';

const ResetPassword = ({ route, navigation }: RootScreenProps<Paths.ResetPassword>) => {
  const { fonts, layout } = useTheme();
  const hash = route?.params?.hash;
  const email = route?.params?.email;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!hash) {
      Alert.alert(
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

    if (!trimmedPassword || !trimmedConfirm) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mật khẩu mới');
      return;
    }

    if (trimmedPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có độ dài tối thiểu 6 ký tự');
      return;
    }
    
    if (trimmedPassword !== trimmedConfirm) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setIsLoading(true);
      await instance.post('auth/reset/password', {
        json: { hash, password: trimmedPassword }
      });
      
      Alert.alert(
        'Đổi mật khẩu thành công',
        'Mật khẩu của bạn đã được cập nhật thành công! Vui lòng đăng nhập với mật khẩu mới.',
        [
          { text: 'Đăng nhập ngay', onPress: () => navigation.navigate(Paths.Login) }
        ]
      );
    } catch (e: any) {
      let errorMessage = 'Không thể đổi mật khẩu. Liên kết có thể đã hết hạn.';
      if (e.response) {
        try {
          const errData = await e.response.json();
          errorMessage = errData.message || (errData.errors?.hash ? 'Liên kết đổi mật khẩu không hợp lệ hoặc đã hết hạn.' : errorMessage);
        } catch (_) {}
      } else if (e.message) {
        errorMessage = e.message;
      }
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsLoading(false);
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
              onChangeText={setPassword}
              placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
              secureTextEntry
              value={password}
              style={{ marginBottom: 16 }}
            />
            <InputField
              iconType="lock"
              onChangeText={setConfirmPassword}
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry
              value={confirmPassword}
            />
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
