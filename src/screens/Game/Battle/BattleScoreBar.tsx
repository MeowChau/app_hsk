import React from 'react';
import { View, Text } from 'react-native';
import { UserAvatar } from '@/components/atoms';
import { hs, vs, ms } from '@/theme';

interface BattleScoreBarProps {
  myScore: number;
  opponentScore: number;
  opponentName: string;
  myCombo?: number;
  opponentCombo?: number;
}

export const BattleScoreBar = ({
  myScore,
  opponentScore,
  opponentName,
  myCombo = 0,
  opponentCombo = 0,
}: BattleScoreBarProps) => {
  const total = myScore + opponentScore;
  const myRatio = total === 0 ? 0.5 : Math.max(0.15, Math.min(0.85, myScore / total));
  const myPercent = `${Math.round(myRatio * 100)}%`;
  const opponentPercent = `${Math.round((1 - myRatio) * 100)}%`;

  return (
    <View
      style={{
        backgroundColor: '#1E1A46',
        borderRadius: ms(18),
        paddingHorizontal: hs(16),
        paddingTop: vs(14),
        paddingBottom: vs(12),
        borderWidth: 1.5,
        borderColor: '#2E2766',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
      }}
    >
      {/* Upper row: Players and VS */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: vs(12),
        }}
      >
        {/* Left: Player */}
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <UserAvatar size={ms(40)} backgroundColor="#3730A3" style={{ marginRight: hs(10), borderWidth: 1.5, borderColor: '#818CF8' }} />
          <View>
            <Text style={{ color: '#A5B4FC', fontSize: ms(12), fontWeight: '600' }}>
              Bạn
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: ms(20),
                  fontWeight: '900',
                  marginRight: hs(6),
                }}
              >
                {myScore}
              </Text>
              {myCombo > 1 && (
                <View
                  style={{
                    backgroundColor: '#6366F1',
                    borderRadius: ms(6),
                    paddingHorizontal: hs(5),
                    paddingVertical: vs(1),
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: ms(10), fontWeight: '800' }}>
                    x{myCombo}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Center: VS Badge */}
        <View
          style={{
            width: hs(28),
            height: vs(28),
            borderRadius: ms(14),
            backgroundColor: '#2D2764',
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: hs(8),
            borderWidth: 1,
            borderColor: '#4338CA',
          }}
        >
          <Text style={{ color: '#A5B4FC', fontSize: ms(11), fontWeight: '900' }}>
            VS
          </Text>
        </View>

        {/* Right: Opponent */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flex: 1,
          }}
        >
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#A5B4FC', fontSize: ms(12), fontWeight: '600' }}>
              {opponentName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {opponentCombo > 1 && (
                <View
                  style={{
                    backgroundColor: '#06B6D4',
                    borderRadius: ms(6),
                    paddingHorizontal: hs(5),
                    paddingVertical: vs(1),
                    marginRight: hs(6),
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: ms(10), fontWeight: '800' }}>
                    x{opponentCombo}
                  </Text>
                </View>
              )}
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: ms(20),
                  fontWeight: '900',
                }}
              >
                {opponentScore}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: hs(40),
              height: vs(40),
              borderRadius: ms(20),
              backgroundColor: '#0E7490',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: hs(10),
              borderWidth: 1.5,
              borderColor: '#22D3EE',
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: ms(18),
                fontWeight: '900',
              }}
            >
              H
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom: Tug-of-war split battle bar */}
      <View
        style={{
          height: vs(6),
          borderRadius: ms(3),
          backgroundColor: '#131131',
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: myPercent as any,
            backgroundColor: '#818CF8',
            borderTopLeftRadius: ms(3),
            borderBottomLeftRadius: ms(3),
          }}
        />
        <View
          style={{
            width: opponentPercent as any,
            backgroundColor: '#22D3EE',
            borderTopRightRadius: ms(3),
            borderBottomRightRadius: ms(3),
          }}
        />
      </View>
    </View>
  );
};

export default BattleScoreBar;
