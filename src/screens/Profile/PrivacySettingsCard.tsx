import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useTheme, hs, vs, ms } from '@/theme';

interface PrivacySettingsCardProps {
  anonymousActivity: boolean;
  setAnonymousActivity: (anonymous: boolean) => void;
}

export function PrivacySettingsCard({ anonymousActivity, setAnonymousActivity }: PrivacySettingsCardProps) {
  const { layout } = useTheme();

  return (
    <View
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#F0F2F5',
        borderRadius: ms(16),
        borderWidth: 1,
        elevation: 1.5,
        padding: ms(16),
        shadowColor: '#000',
        shadowOffset: { width: hs(0), height: vs(2) },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      }}
    >
      <Text
        style={{
          color: '#000000',
          fontSize: ms(16),
          fontWeight: '700',
          marginBottom: vs(2),
        }}
      >
        Quyền riêng tư
      </Text>
      <Text
        style={{
          color: '#6B7280',
          fontSize: ms(14),
          marginBottom: vs(14),
        }}
      >
        Kiểm soát thông tin hiển thị công khai trên trang chủ.
      </Text>

      {/* Toggle Setting Row */}
      <View style={[layout.row, layout.justifyBetween, layout.itemsCenter, { marginBottom: vs(6) }]}>
        <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '700' }}>
          Hiển thị hoạt động ẩn danh trên trang chủ
        </Text>
        <Switch
          onValueChange={setAnonymousActivity}
          thumbColor="#FFFFFF"
          trackColor={{ false: '#D1D5DB', true: '#1E293B' }}
          value={anonymousActivity}
        />
      </View>
      <Text
        style={{
          color: '#6B7280',
          fontSize: ms(14),
          lineHeight: ms(16),
        }}
      >
        Khi bật, hoạt động của bạn (đăng ký, tải worksheet, luyện chữ) sẽ hiển thị trên trang chủ với tên ẩn danh: <Text style={{ fontWeight: '700' }}>Ng***n V. A.</Text> Tên đầy đủ và email không bao giờ bị tiết lộ.
      </Text>
    </View>
  );
}
