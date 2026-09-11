import React from 'react';
import { View, Text } from 'react-native';
import { hs, vs, ms } from '@/theme';

export interface LeaderboardRowProps {
  rank: number;
  name: string;
  level: number;
  xp: string;
  bg: string;
  color: string;
}

export const LeaderboardRow = ({ rank, name, level, xp, bg, color }: LeaderboardRowProps) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F5F6F8', paddingBottom: vs(16) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={{ width: hs(40), alignItems: 'center' }}>
          <View style={{ backgroundColor: bg, borderRadius: ms(12), height: vs(24), width: hs(24), alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: color, fontSize: ms(11), fontWeight: '800' }}>{rank}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: '#E0E0E0', borderRadius: ms(16), height: vs(32), width: hs(32), marginLeft: hs(16), marginRight: hs(12) }} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#111827', fontSize: ms(15), fontWeight: '700' }} numberOfLines={1}>{name}</Text>
          <Text style={{ color: '#9E9E9E', fontSize: ms(12), marginTop: vs(1) }}>Level {level}</Text>
        </View>
      </View>
      <Text style={{ color: '#4B5563', fontSize: ms(14), fontWeight: '700', width: hs(80), textAlign: 'right' }}>{xp} XP</Text>
    </View>
  );
};
