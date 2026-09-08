import React from 'react';
import { View, Text } from 'react-native';
import { hs, vs, ms } from '@/theme';

export interface LeaderboardRowProps {
  rank: number;
  name: string;
  score: string;
  bg: string;
  color: string;
}

export const LeaderboardRow = ({ rank, name, score, bg, color }: LeaderboardRowProps) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F5F6F8', paddingBottom: vs(16) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={{ width: hs(40), alignItems: 'center' }}>
          <View style={{ backgroundColor: bg, borderRadius: ms(12), height: vs(24), width: hs(24), alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: color, fontSize: ms(11), fontWeight: '800' }}>{rank}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: '#E0E0E0', borderRadius: ms(12), height: vs(24), width: hs(24), marginLeft: hs(28), marginRight: hs(12) }} />
        <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '700', flex: 1 }} numberOfLines={1}>{name}</Text>
      </View>
      <Text style={{ color: '#111827', fontSize: ms(12), fontWeight: '700', width: hs(80), textAlign: 'right' }}>{score}</Text>
    </View>
  );
};
