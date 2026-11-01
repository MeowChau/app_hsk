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
import { hs, ms, vs, useTheme } from '@/theme';
import type { ChangePasswordDto } from '@/services/auth/types';
import InputError from '@/components/atoms/InputError';
import { getFormErrors } from '@/services/auth/formErrors';
import type { FormErrors } from '@/services/auth/formErrors';

interface ChangePasswordModalProps {
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (dto: ChangePasswordDto) => Promise<void>;
}

export function ChangePasswordModal({ isSaving, onClose, onSubmit }: ChangePasswordModalProps) {
  const { colors } = useTheme();
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
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
    const nextErrors: FormErrors = {
      oldPassword: !oldPassword ? 'Vui lòng nhập mật khẩu hiện tại.' : undefined,
      password: !password ? 'Vui lòng nhập mật khẩu mới.' : password.length < 6 ? 'Mật khẩu mới phải có ít nhất 6 ký tự.' : password !== password.trim() ? 'Mật khẩu mới không được bắt đầu hoặc kết thúc bằng khoảng trắng.' : password === oldPassword ? 'Mật khẩu mới phải khác mật khẩu hiện tại.' : undefined,
      confirmPassword: !confirmation ? 'Vui lòng xác nhận mật khẩu mới.' : password !== confirmation ? 'Mật khẩu xác nhận không khớp.' : undefined,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    busy.current = true;
    setSubmitting(true);
    Keyboard.dismiss();
    try {
      await onSubmit({ oldPassword, password });
      setOldPassword('');
      setPassword('');
      setConfirmation('');
    } catch (error) {
      setErrors(await getFormErrors(error, 'Không thể đổi mật khẩu. Vui lòng kiểm tra kết nối và thử lại.'));
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
          <View accessibilityViewIsModal style={{ backgroundColor: colors.dialogBackground, borderRadius: ms(16), padding: ms(20) }}>
            <Text accessibilityRole="header" style={{ color: colors.dialogText, fontSize: ms(20), fontWeight: '700', marginBottom: vs(8) }}>
              Đổi mật khẩu
            </Text>
            <Text style={{ color: colors.dialogText, fontSize: ms(14), lineHeight: ms(20), marginBottom: vs(20) }}>
              Nhập mật khẩu hiện tại và mật khẩu mới cho tài khoản của bạn.
            </Text>
            <View style={{ marginBottom: vs(16) }}>
              <Text style={{ color: colors.dialogText, fontSize: ms(14), fontWeight: '600', marginBottom: vs(6) }}>Mật khẩu hiện tại</Text>
              <InputField
                textColor={colors.dialogText}
                accessibilityLabel="Mật khẩu hiện tại"
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect={false}
                editable={!pending}
                error={errors.oldPassword}
                onChangeText={value => { setOldPassword(value); setErrors(current => ({ ...current, oldPassword: undefined, form: undefined })); }}
                secureTextEntry
                style={{ height: 48, borderColor: colors.dialogBorder }}
                textContentType="password"
                value={oldPassword}
              />
            </View>
            <View style={{ marginBottom: vs(16) }}>
              <Text style={{ color: colors.dialogText, fontSize: ms(14), fontWeight: '600', marginBottom: vs(6) }}>Mật khẩu mới</Text>
              <InputField
                textColor={colors.dialogText}
                accessibilityLabel="Mật khẩu mới"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect={false}
                editable={!pending}
                error={errors.password}
                onChangeText={value => { setPassword(value); setErrors(current => ({ ...current, password: undefined, confirmPassword: undefined, form: undefined })); }}
                secureTextEntry
                style={{ height: 48, borderColor: colors.dialogBorder }}
                textContentType="newPassword"
                value={password}
              />
              <Text style={{ color: colors.dialogText, fontSize: ms(12), marginTop: vs(6) }}>Tối thiểu 6 ký tự.</Text>
            </View>
            <View style={{ marginBottom: vs(20) }}>
              <Text style={{ color: colors.dialogText, fontSize: ms(14), fontWeight: '600', marginBottom: vs(6) }}>Xác nhận mật khẩu mới</Text>
              <InputField
                textColor={colors.dialogText}
                accessibilityLabel="Xác nhận mật khẩu mới"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect={false}
                editable={!pending}
                error={errors.confirmPassword}
                onChangeText={value => { setConfirmation(value); setErrors(current => ({ ...current, confirmPassword: undefined, form: undefined })); }}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                secureTextEntry
                style={{ height: 48, borderColor: colors.dialogBorder }}
                textContentType="newPassword"
                value={confirmation}
              />
            </View>
            <InputError message={errors.form} />
            <View style={{ flexDirection: 'row', gap: hs(10) }}>
              <Button accessibilityRole="button" disabled={pending} onPress={handleClose} title="Hủy" variant="outline" textColor={colors.dialogText} style={{ flex: 1, borderRadius: ms(12), borderColor: colors.dialogBorder }} />
              <Button accessibilityLabel="Lưu mật khẩu mới" accessibilityRole="button" loading={pending} onPress={handleSubmit} title="Lưu mật khẩu" style={{ flex: 1, borderRadius: ms(12), backgroundColor: colors.dialogAction }} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
