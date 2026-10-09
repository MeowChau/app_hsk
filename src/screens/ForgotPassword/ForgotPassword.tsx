import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeScreen } from '@/components/templates';
import { InputField } from '@/components/molecules';
import { Button, Logo } from '@/components/atoms';
import { useTheme } from '@/theme';
import type { RootScreenProps } from '@/navigation/types';
import { Paths } from '@/navigation/paths';
import { instance } from '@/services/instance';

const ForgotPassword = ({ navigation }: RootScreenProps<Paths.ForgotPassword>) => {
  const { fonts, layout } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    try {
      setIsLoading(true);
      const data = await instance.post('auth/forgot/password', {
        json: { email }
      }).json<{ hash: string }>();
      
      // data contains { hash: string }
      navigation.navigate(Paths.ResetPassword, { hash: data.hash, email });
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
              Quên mật khẩu?
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 20 }}>
              Đừng lo lắng! Vui lòng nhập địa chỉ email liên kết với tài khoản của bạn để nhận mã khôi phục.
            </Text>
          </View>

          <View style={{ marginBottom: 24 }}>
            <InputField
              autoCapitalize="none"
              iconType="mail"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Email của bạn"
              value={email}
            />
          </View>

          <Button
            fullWidth
            loading={isLoading}
            onPress={handleSendOtp}
            title="Gửi mã xác nhận"
            variant="primary"
          />

          <TouchableOpacity
            style={{ marginTop: 24, alignItems: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#6B7280', fontSize: 14, fontWeight: '600' }}>
              Quay lại đăng nhập
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

export default ForgotPassword;
