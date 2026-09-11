import React from 'react';
import { View, Text, Switch } from 'react-native';
import { useTheme, hs, vs, ms } from '@/theme';

interface DisplaySettingsCardProps {
  showPinyin: boolean;
  setShowPinyin: (show: boolean) => void;
}

export function DisplaySettingsCard({ showPinyin, setShowPinyin }: DisplaySettingsCardProps) {
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
        Hiển thị khi học
      </Text>
      <Text
        style={{
          color: '#6B7280',
          fontSize: ms(14),
          marginBottom: vs(14),
        }}
      >
        Cách các bài học hiển thị mặc định trên mọi thiết bị của bạn.
      </Text>

      {/* Toggle Setting Row */}
      <View style={[layout.row, layout.justifyBetween, layout.itemsCenter, { marginBottom: vs(6) }]}>
        <Text style={{ color: '#000000', fontSize: ms(16), fontWeight: '700' }}>
          Hiện pinyin trong bài học
        </Text>
        <Switch
          onValueChange={setShowPinyin}
          thumbColor="#FFFFFF"
          trackColor={{ false: '#D1D5DB', true: '#1E293B' }}
          value={showPinyin}
        />
      </View>
      <Text
        style={{
          color: '#6B7280',
          fontSize: ms(14),
          lineHeight: ms(16),
        }}
      >
        Tắt để ẩn pinyin ngay từ đầu ở trang bài học và trang chủ đề, giúp bạn tập nhớ mặt chữ. Khi cần, bạn vẫn bấm được nút <Text style={{ fontWeight: '700' }}>Hiện pinyin</Text> ngay trên trang để xem tạm thời.
      </Text>
    </View>
  );
}
