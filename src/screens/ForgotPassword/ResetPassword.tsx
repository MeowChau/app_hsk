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
  const { hash, email } = route.params;

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!otp || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setIsLoading(true);
      await instance.post('auth/reset/password', {
        json: { hash, otp, password }
      });
      
      Alert.alert('Thành công', 'Mật khẩu của bạn đã được cập nhật', [
        { text: 'Đăng nhập ngay', onPress: () => navigation.navigate(Paths.Login) }
      ]);
    } catch (e: any) {
      // Ky error parsing
      let errorMessage = e.message;
      if (e.response) {
        try {
          const errData = await e.response.json();
          errorMessage = errData.message || errorMessage;
        } catch (_) {}
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
              Nhập mã xác nhận đã được gửi đến email <Text style={{ fontWeight: 'bold' }}>{email}</Text> và tạo mật khẩu mới.
            </Text>
          </View>

          <View style={{ marginBottom: 24 }}>
            <InputField
              autoCapitalize="none"
              iconType="mail"
              keyboardType="number-pad"
              onChangeText={setOtp}
              placeholder="Mã xác nhận (OTP)"
              value={otp}
              style={{ marginBottom: 16 }}
            />
            <InputField
              iconType="lock"
              onChangeText={setPassword}
              placeholder="Mật khẩu mới"
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
