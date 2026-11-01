import React from 'react';
import { View, Text } from 'react-native';
import { hs, vs, ms } from '@/theme';
import { UserAvatar } from '@/components/atoms';

export interface LeaderboardRowProps {
  rank: number | null;
  name: string;
  level: number;
  totalExp: number;
  photoUrl?: string | null;
  bg: string;
  color: string;
}

export const LeaderboardRow = ({ rank, name, level, totalExp, photoUrl, bg, color }: LeaderboardRowProps) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F5F6F8', paddingBottom: vs(16) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={{ width: hs(40), alignItems: 'center' }}>
          <View style={{ backgroundColor: bg, borderRadius: ms(12), height: vs(24), width: hs(24), alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: color, fontSize: ms(11), fontWeight: '800' }}>{rank ?? '—'}</Text>
          </View>
        </View>
        <UserAvatar photoUrl={photoUrl} size={ms(32)} style={{ marginLeft: hs(16), marginRight: hs(12) }} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#111827', fontSize: ms(15), fontWeight: '700' }} numberOfLines={1}>{name}</Text>
          <Text style={{ color: '#9E9E9E', fontSize: ms(12), marginTop: vs(1) }}>Level {level}</Text>
        </View>
      </View>
      <Text style={{ color: '#4B5563', fontSize: ms(14), fontWeight: '700', marginLeft: hs(8), textAlign: 'right' }}>{totalExp.toLocaleString('vi-VN')} EXP</Text>
    </View>
  );
};
