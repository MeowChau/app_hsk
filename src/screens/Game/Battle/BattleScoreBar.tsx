// @refresh reset
import React from 'react';
import { View, Text } from 'react-native';
import { UserAvatar } from '@/components/atoms';
import { hs, vs, ms, useTheme } from '@/theme';

interface BattleScoreBarProps {
  myScore: number;
  opponentScore: number;
  opponentName: string;
  myCombo?: number;
  opponentCombo?: number;
  photoUrl?: string | null;
}

export const BattleScoreBar = ({
  myScore,
  opponentScore,
  opponentName,
  myCombo = 0,
  opponentCombo = 0,
  photoUrl,
}: BattleScoreBarProps) => {
  const { colors } = useTheme();
  const total = myScore + opponentScore;
  const myRatio =
    total === 0 ? 0.5 : Math.max(0.15, Math.min(0.85, myScore / total));
  const myPercent = `${Math.round(myRatio * 100)}%`;
  const opponentPercent = `${Math.round((1 - myRatio) * 100)}%`;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: ms(18),
        paddingHorizontal: hs(16),
        paddingTop: vs(14),
        paddingBottom: vs(12),
        borderWidth: 1,
        borderColor: colors.gray100,
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
          <UserAvatar
            photoUrl={photoUrl}
            size={ms(40)}
            backgroundColor={colors.accentLightBlue}
            style={{
              marginRight: hs(10),
              borderWidth: 1,
              borderColor: colors.gray100,
            }}
          />
          <View>
            <Text
              style={{
                color: colors.text,
                fontSize: ms(12),
                fontWeight: '600',
              }}
            >
              Bạn
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  color: colors.gray800,
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
                    backgroundColor: colors.primary,
                    borderRadius: ms(6),
                    paddingHorizontal: hs(5),
                    paddingVertical: vs(1),
                  }}
                >
                  <Text
                    style={{
                      color: colors.onPrimary,
                      fontSize: ms(10),
                      fontWeight: '800',
                    }}
                  >
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
            width: ms(28),
            height: ms(28),
            borderRadius: ms(14),
            backgroundColor: colors.accentLightBlue,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: hs(8),
            borderWidth: 1,
            borderColor: colors.gray100,
          }}
        >
          <Text
            style={{
              color: colors.onAccent,
              fontSize: ms(11),
              fontWeight: '900',
            }}
          >
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
            <Text
              style={{
                color: colors.text,
                fontSize: ms(12),
                fontWeight: '600',
              }}
            >
              {opponentName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {opponentCombo > 1 && (
                <View
                  style={{
                    backgroundColor: colors.accentLightBlue,
                    borderRadius: ms(6),
                    paddingHorizontal: hs(5),
                    paddingVertical: vs(1),
                    marginRight: hs(6),
                  }}
                >
                  <Text
                    style={{
                      color: colors.onAccent,
                      fontSize: ms(10),
                      fontWeight: '800',
                    }}
                  >
                    x{opponentCombo}
                  </Text>
                </View>
              )}
              <Text
                style={{
                  color: colors.gray800,
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
              width: ms(40),
              height: ms(40),
              borderRadius: ms(20),
              backgroundColor: colors.accentLightBlue,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: hs(10),
              borderWidth: 1,
              borderColor: colors.gray100,
            }}
          >
            <Text
              style={{
                color: colors.onAccent,
                fontSize: ms(18),
                fontWeight: '900',
              }}
            >
              {opponentName.trim().charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom: Tug-of-war split battle bar */}
      <View
        style={{
          height: vs(6),
          borderRadius: ms(3),
          backgroundColor: colors.gray100,
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: myPercent as any,
            backgroundColor: colors.primary,
            borderTopLeftRadius: ms(3),
            borderBottomLeftRadius: ms(3),
          }}
        />
        <View
          style={{
            width: opponentPercent as any,
            backgroundColor: colors.primaryLight,
            borderTopRightRadius: ms(3),
            borderBottomRightRadius: ms(3),
          }}
        />
      </View>
    </View>
  );
};

export default BattleScoreBar;
