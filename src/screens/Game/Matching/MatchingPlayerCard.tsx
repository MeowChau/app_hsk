import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { UserAvatar } from '@/components/atoms';
import { hs, vs, ms, useTheme } from '@/theme';

interface MatchingPlayerCardProps {
  userName: string;
  photoUrl?: string | null;
  statusText?: string;
  tone?: 'pending' | 'matched' | 'error';
  placeholder?: boolean;
  busy?: boolean;
}

export const MatchingPlayerCard = ({ userName, photoUrl, statusText = 'Đang kết nối', tone = 'pending', placeholder, busy }: MatchingPlayerCardProps) => {
  const { colors } = useTheme();
  const color = tone === 'matched' ? '#047857' : tone === 'error' ? colors.red500 : '#1F4086';
  const statusBackground = tone === 'matched' ? '#ECFDF5' : tone === 'error' ? '#FFF5F5' : colors.accentLightBlue;
  return (
    <View style={{ flex: 1, minWidth: 0, minHeight: vs(164), backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: ms(16), alignItems: 'center', justifyContent: 'center', paddingHorizontal: hs(10), paddingVertical: vs(16) }}>
      {placeholder ? (
        <View style={{ width: ms(56), height: ms(56), borderRadius: ms(28), backgroundColor: colors.accentLightBlue, justifyContent: 'center', alignItems: 'center', marginBottom: vs(12) }}>
          <Text style={{ color: colors.primary, fontSize: ms(24), fontWeight: '700' }}>?</Text>
        </View>
      ) : <UserAvatar photoUrl={photoUrl} size={ms(56)} style={{ marginBottom: vs(12) }} />}
      <View style={{ minHeight: ms(38), justifyContent: 'center', alignSelf: 'stretch', marginBottom: vs(10) }}>
        <Text numberOfLines={2} style={{ fontSize: ms(14), lineHeight: ms(19), fontWeight: '700', color: '#111827', textAlign: 'center' }}>{userName}</Text>
      </View>
      <View style={{ maxWidth: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: hs(4), minHeight: ms(28), paddingHorizontal: hs(8), paddingVertical: vs(5), borderRadius: ms(999), backgroundColor: statusBackground }}>
        {busy ? <ActivityIndicator size="small" color={color} style={{ transform: [{ scale: 0.7 }] }} /> : null}
        <Text style={{ color, fontSize: ms(12), lineHeight: ms(16), fontWeight: '600', textAlign: 'center', flexShrink: 1 }}>{statusText}</Text>
      </View>
    </View>
  );
};

export default MatchingPlayerCard;
