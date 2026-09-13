import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { UserAvatar } from '@/components/atoms';
import { useTheme, hs, vs, ms } from '@/theme';

interface UserProfileCardProps {
  displayName: string;
  setDisplayName: (name: string) => void;
  email: string;
}

export function UserProfileCard({ displayName, setDisplayName, email }: UserProfileCardProps) {
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
      {/* Title & Subtitle */}
      <Text
        style={{
          color: '#000000',
          fontSize: ms(22),
          fontWeight: '700',
          marginBottom: vs(2),
        }}
      >
        Hồ sơ
      </Text>
      <Text
        style={{
          color: '#6B7280',
          fontSize: ms(14),
          marginBottom: vs(16),
        }}
      >
        Tên và ảnh đại diện của bạn hiển thị trên bảng xếp hạng trò chơi.
      </Text>

      {/* Avatar Section */}
      <View style={{ alignItems: 'center', marginBottom: vs(16) }}>
        {/* Circular Avatar */}
        <UserAvatar size={ms(88)} style={{ borderColor: '#E9D5FF', borderWidth: 1.5, marginBottom: vs(12) }} />

        {/* Avatar Action Buttons */}
        <View style={[layout.row, layout.itemsCenter]}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              alignItems: 'center',
              backgroundColor: '#FAF8F5',
              borderColor: '#E5E7EB',
              borderRadius: ms(8),
              borderWidth: 1,
              flexDirection: 'row',
              paddingHorizontal: hs(12),
              paddingVertical: vs(6),
            }}
          >
            <Svg height="14" style={{ marginRight: hs(6) }} viewBox="0 0 24 24" width="14">
              <Path
                d="M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4z"
                fill="#374151"
              />
              <Path
                d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"
                fill="#374151"
              />
            </Svg>
            <Text style={{ color: '#374151', fontSize: ms(14), fontWeight: '600' }}>
              Đổi ảnh
            </Text>
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              alignItems: 'center',
              height: vs(32),
              justifyContent: 'center',
              marginLeft: hs(10),
              width: hs(32),
            }}
          >
            <Svg height="16" viewBox="0 0 24 24" width="16">
              <Path
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                fill="#EF4444"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* File format hint */}
        <Text
          style={{
            color: '#9CA3AF',
            fontSize: ms(12),
            marginTop: vs(8),
            textAlign: 'center',
          }}
        >
          JPG, PNG hoặc WebP. Ảnh sẽ được cắt vuông tự động.
        </Text>
      </View>

      {/* Input: Tên hiển thị */}
      <View style={{ marginBottom: vs(12) }}>
        <Text
          style={{
            color: '#000000',
            fontSize: ms(16),
            fontWeight: '600',
            marginBottom: vs(6),
          }}
        >
          Tên hiển thị
        </Text>
        <TextInput
          onChangeText={setDisplayName}
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#E5E7EB',
            borderRadius: ms(8),
            borderWidth: 1,
            color: '#000000',
            fontSize: ms(14),
            paddingHorizontal: hs(12),
            paddingVertical: vs(9),
          }}
          value={displayName}
        />
      </View>

      {/* Input: Email */}
      <View style={{ marginBottom: vs(16) }}>
        <Text
          style={{
            color: '#000000',
            fontSize: ms(16),
            fontWeight: '600',
            marginBottom: vs(6),
          }}
        >
          Email
        </Text>
        <TextInput
          editable={false}
          style={{
            backgroundColor: '#F9FAFB',
            borderColor: '#E5E7EB',
            borderRadius: ms(8),
            borderWidth: 1,
            color: '#9CA3AF',
            fontSize: ms(14),
            paddingHorizontal: hs(12),
            paddingVertical: vs(9),
          }}
          value={email}
        />
      </View>

      {/* Bottom Actions Row */}
      <View style={[layout.row, { columnGap: hs(10) }]}>
        {/* Save Changes Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            alignItems: 'center',
            backgroundColor: '#64748B',
            borderRadius: ms(8),
            justifyContent: 'center',
            paddingHorizontal: hs(18),
            paddingVertical: vs(10),
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: ms(14), fontWeight: '700' }}>
            Lưu thay đổi
          </Text>
        </TouchableOpacity>

        {/* Change Password Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            alignItems: 'center',
            backgroundColor: '#FAF8F5',
            borderColor: '#E5E7EB',
            borderRadius: ms(8),
            borderWidth: 1,
            flexDirection: 'row',
            paddingHorizontal: hs(16),
            paddingVertical: vs(10),
          }}
        >
          <Svg height="14" style={{ marginRight: hs(6) }} viewBox="0 0 24 24" width="14">
            <Path
              d="M12.65 10A5.99 5.99 0 007 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 005.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
              fill="#4B5563"
            />
          </Svg>
          <Text style={{ color: '#000000', fontSize: ms(14), fontWeight: '700' }}>
            Đổi mật khẩu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
