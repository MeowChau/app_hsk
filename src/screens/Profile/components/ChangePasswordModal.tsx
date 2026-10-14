import React, { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Button } from '@/components/atoms';
import { InputField } from '@/components/molecules';
import { hs, ms, vs } from '@/theme';
import type { ChangePasswordDto } from '@/services/auth/types';

interface ChangePasswordModalProps {
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (dto: ChangePasswordDto) => Promise<void>;
}

const getPasswordError = async (error: unknown): Promise<string> => {
  const response = (error as { response?: Response } | null)?.response;
  if (response) {
    if (response.status === 401) return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    try {
      const data = await response.clone().json();
      if (data.errors?.oldPassword === 'incorrectOldPassword') return 'Mật khẩu hiện tại không đúng.';
      if (data.errors?.oldPassword === 'missingOldPassword') return 'Vui lòng nhập mật khẩu hiện tại.';
      if (data.errors?.password) return 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    } catch {
      // Keep the message readable when the server returns a non-JSON response.
    }
  }
  if (error instanceof Error && error.message.startsWith('Phiên đăng nhập')) return error.message;
  return 'Không thể đổi mật khẩu. Vui lòng kiểm tra kết nối và thử lại.';
};

export function ChangePasswordModal({ isSaving, onClose, onSubmit }: ChangePasswordModalProps) {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const busy = useRef(false);
  const pending = isSaving || submitting;

  const handleClose = () => {
    if (busy.current || isSaving) return;
    Keyboard.dismiss();
    onClose();
  };

  const handleSubmit = async () => {
    if (busy.current || isSaving) return;
    if (!oldPassword || !password || !confirmation) {
      setErrorMessage('Vui lòng nhập đầy đủ các trường mật khẩu.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== password.trim()) {
      setErrorMessage('Mật khẩu mới không được bắt đầu hoặc kết thúc bằng khoảng trắng.');
      return;
    }
    if (password !== confirmation) {
      setErrorMessage('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (password === oldPassword) {
      setErrorMessage('Mật khẩu mới phải khác mật khẩu hiện tại.');
      return;
    }

    busy.current = true;
    setSubmitting(true);
    setErrorMessage('');
    Keyboard.dismiss();
    try {
      await onSubmit({ oldPassword, password });
      setOldPassword('');
      setPassword('');
      setConfirmation('');
    } catch (error) {
      setErrorMessage(await getPasswordError(error));
    } finally {
      busy.current = false;
      setSubmitting(false);
    }
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: hs(24), paddingVertical: vs(24) }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View accessibilityViewIsModal style={{ backgroundColor: '#FFFFFF', borderRadius: ms(16), padding: ms(20) }}>
            <Text accessibilityRole="header" style={{ color: '#111827', fontSize: ms(20), fontWeight: '700', marginBottom: vs(8) }}>
              Đổi mật khẩu
            </Text>
            <Text style={{ color: '#6B7280', fontSize: ms(14), lineHeight: ms(20), marginBottom: vs(20) }}>
              Nhập mật khẩu hiện tại và mật khẩu mới cho tài khoản của bạn.
            </Text>
            <View style={{ marginBottom: vs(16) }}>
              <Text style={{ color: '#111827', fontSize: ms(14), fontWeight: '600', marginBottom: vs(6) }}>Mật khẩu hiện tại</Text>
              <InputField
                accessibilityLabel="Mật khẩu hiện tại"
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect={false}
                editable={!pending}
                onChangeText={setOldPassword}
                secureTextEntry
                style={{ height: 48, borderColor: '#E5E7EB' }}
                textContentType="password"
                value={oldPassword}
              />
            </View>
            <View style={{ marginBottom: vs(16) }}>
              <Text style={{ color: '#111827', fontSize: ms(14), fontWeight: '600', marginBottom: vs(6) }}>Mật khẩu mới</Text>
              <InputField
                accessibilityLabel="Mật khẩu mới"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect={false}
                editable={!pending}
                onChangeText={setPassword}
                secureTextEntry
                style={{ height: 48, borderColor: '#E5E7EB' }}
                textContentType="newPassword"
                value={password}
              />
              <Text style={{ color: '#6B7280', fontSize: ms(12), marginTop: vs(6) }}>Tối thiểu 6 ký tự.</Text>
            </View>
            <View style={{ marginBottom: vs(20) }}>
              <Text style={{ color: '#111827', fontSize: ms(14), fontWeight: '600', marginBottom: vs(6) }}>Xác nhận mật khẩu mới</Text>
              <InputField
                accessibilityLabel="Xác nhận mật khẩu mới"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect={false}
                editable={!pending}
                onChangeText={setConfirmation}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                secureTextEntry
                style={{ height: 48, borderColor: '#E5E7EB' }}
                textContentType="newPassword"
                value={confirmation}
              />
            </View>
            {!!errorMessage && (
              <Text accessibilityLiveRegion="polite" style={{ color: '#C13333', fontSize: ms(14), lineHeight: ms(20), marginBottom: vs(16) }}>
                {errorMessage}
              </Text>
            )}
            <View style={{ flexDirection: 'row', gap: hs(10) }}>
              <Button accessibilityRole="button" disabled={pending} onPress={handleClose} title="Hủy" variant="outline" style={{ flex: 1, borderRadius: ms(12), borderColor: '#D1D5DB' }} />
              <Button accessibilityLabel="Lưu mật khẩu mới" accessibilityRole="button" loading={pending} onPress={handleSubmit} title="Lưu mật khẩu" style={{ flex: 1, borderRadius: ms(12), backgroundColor: '#1E3A8A' }} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
