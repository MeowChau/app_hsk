import React from 'react';
import { View, Text } from 'react-native';
import { UserAvatar } from '@/components/atoms';
import { hs, vs, ms } from '@/theme';

interface MatchingPlayerCardProps {
  userName: string;
}

export const MatchingPlayerCard = ({ userName }: MatchingPlayerCardProps) => {
  return (
    <View
      style={{
        width: hs(130),
        height: vs(160),
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
        borderWidth: 1.5,
        borderRadius: ms(16),
        alignItems: 'center',
        justifyContent: 'center',
        padding: ms(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <UserAvatar size={ms(54)} style={{ marginBottom: vs(8) }} />

      {/* Tên Người dùng */}
      <Text
        numberOfLines={1}
        style={{
          fontSize: ms(13),
          fontWeight: '700',
          color: '#111827',
          marginBottom: vs(10),
          textAlign: 'center',
        }}
      >
        {userName}
      </Text>

      {/* Badge Sẵn sàng */}
      <View
        style={{
          backgroundColor: '#1E293B',
          borderRadius: ms(6),
          paddingHorizontal: hs(10),
          paddingVertical: vs(5),
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: '#34D399',
            fontSize: ms(11),
            fontWeight: '800',
            marginRight: hs(4),
          }}
        >
          ✓
        </Text>
        <Text
          style={{
            color: '#34D399',
            fontSize: ms(11),
            fontWeight: '700',
          }}
        >
          Sẵn sàng
        </Text>
      </View>
    </View>
  );
};

export default MatchingPlayerCard;
