import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { hs, vs, ms } from '@/theme';

interface BattleHeaderProps {
  isMyTurn: boolean;
  opponentName: string;
  timeLeft: number;
  turnNumber?: number;
  maxTurnsPerPlayer?: number;
  onForfeit?: () => void;
}

export const BattleHeader = ({
  isMyTurn,
  opponentName,
  timeLeft,
  turnNumber,
  maxTurnsPerPlayer = 4,
  onForfeit,
}: BattleHeaderProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: hs(16),
        paddingTop: vs(12),
        paddingBottom: vs(16),
        backgroundColor: '#201C48',
        borderTopLeftRadius: ms(20),
        borderTopRightRadius: ms(20),
        borderBottomWidth: 1,
        borderBottomColor: '#2C275E',
      }}
    >
      {/* Left: Info turn */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: hs(12) }}>
        {/* Forfeit button icon */}
        {onForfeit && (
          <TouchableOpacity
            onPress={onForfeit}
            activeOpacity={0.7}
            style={{
              marginRight: hs(8),
              padding: ms(4),
            }}
          >
            <Svg height="20" viewBox="0 0 24 24" width="20" fill="none">
              <Path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="#A5B4FC"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        )}

        {/* Icon status (Timer or Eye) */}
        <View style={{ marginRight: hs(8) }}>
          {isMyTurn ? (
            <Svg height="20" viewBox="0 0 24 24" width="20" fill="none">
              <Circle cx="12" cy="13" r="8" stroke="#FBBF24" strokeWidth={2} />
              <Path d="M12 9v4l2.5 2.5" stroke="#FBBF24" strokeWidth={2} strokeLinecap="round" />
              <Path d="M12 5V2M10 2h4" stroke="#FBBF24" strokeWidth={2} strokeLinecap="round" />
            </Svg>
          ) : (
            <Svg height="20" viewBox="0 0 24 24" width="20" fill="none">
              <Path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                stroke="#818CF8"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle cx="12" cy="12" r="3" stroke="#818CF8" strokeWidth={2} />
            </Svg>
          )}
        </View>

        {/* Text */}
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              color: '#FFFFFF',
              fontSize: ms(13.5),
              fontWeight: '800',
              letterSpacing: 0.2,
            }}
          >
            {isMyTurn
              ? `Lượt của bạn — chọn đáp án ngay${turnNumber ? ` (${turnNumber}/${maxTurnsPerPlayer})` : ''}`
              : `Lượt của ${opponentName} — bạn theo dõi${turnNumber ? ` (${turnNumber}/${maxTurnsPerPlayer})` : ''}`}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: '#A5B4FC',
              fontSize: ms(12),
              marginTop: vs(2),
              fontWeight: '500',
            }}
          >
            {isMyTurn
              ? 'Đối thủ đang theo dõi lượt của bạn'
              : 'Câu này không tính điểm của bạn.'}
          </Text>
        </View>
      </View>

      {/* Right: Circular Countdown Badge */}
      <View
        style={{
          width: hs(38),
          height: vs(38),
          borderRadius: ms(19),
          backgroundColor: '#27225B',
          borderColor: timeLeft <= 5 ? '#EF4444' : '#6366F1',
          borderWidth: 2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            color: timeLeft <= 5 ? '#F87171' : '#FFFFFF',
            fontSize: ms(16),
            fontWeight: '900',
          }}
        >
          {timeLeft}
        </Text>
      </View>
    </View>
  );
};

export default BattleHeader;
