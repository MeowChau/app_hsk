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

  const handleSendLink = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }

    try {
      setIsLoading(true);
      await instance.post('auth/forgot/password', {
        json: { email: trimmedEmail }
      });
      
      Alert.alert(
        'Đã gửi liên kết',
        `Liên kết đặt lại mật khẩu đã được gửi đến email ${trimmedEmail}.\n\nVui lòng kiểm tra hộp thư và nhấn vào liên kết để chuyển về màn hình đổi mật khẩu!`,
        [
          {
            text: 'Về trang đăng nhập',
            onPress: () => navigation.navigate(Paths.Login),
          },
          {
            text: 'Ở lại',
            style: 'cancel',
          },
        ]
      );
    } catch (e: any) {
      let errorMessage = 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau.';
      if (e.response) {
        try {
          const errData = await e.response.json();
          errorMessage = errData.message || (errData.errors?.email ? 'Email không tồn tại trong hệ thống.' : errorMessage);
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
              Quên mật khẩu?
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280', lineHeight: 20 }}>
              Đừng lo lắng! Vui lòng nhập địa chỉ email liên kết với tài khoản của bạn để nhận liên kết đổi mật khẩu.
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
            onPress={handleSendLink}
            title="Gửi liên kết đổi mật khẩu"
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
