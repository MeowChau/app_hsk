import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { UserAvatar } from '@/components/atoms';
import { hs, vs, ms } from '@/theme';

export interface MatchResultData {
  myScore: number;
  opponentScore: number;
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
  opponentName: string;
  isWin: boolean;
}

interface BattleResultViewProps {
  myScore: number;
  opponentScore: number;
  opponentName?: string;
  correctCount?: number;
  totalUserQuestions?: number;
  coinReward?: number;
  onPlayAgain: () => void;
  onExit: (result?: MatchResultData) => void;
}

export const BattleResultView = ({
  myScore,
  opponentScore,
  opponentName = 'Hạ Ngân',
  correctCount = 1,
  totalUserQuestions = 4,
  coinReward = 10,
  onPlayAgain,
  onExit,
}: BattleResultViewProps) => {
  const isWinner = myScore > opponentScore;
  const isDraw = myScore === opponentScore;

  const resultTitle = isWinner ? 'BẠN THẮNG' : isDraw ? 'HÒA TRẬN' : 'BẠN THUA';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: hs(16),
          paddingTop: vs(12),
          paddingBottom: vs(24),
          flexGrow: 1,
          justifyContent: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= KHUNG ĐEN BO TRÒN KẾT QUẢ ================= */}
        <View
          style={{
            backgroundColor: '#120F24',
            borderRadius: ms(24),
            paddingHorizontal: hs(20),
            paddingTop: vs(36),
            paddingBottom: vs(28),
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#241E45',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          {/* Vòng tròn Cúp Trophy trên cùng */}
          <View
            style={{
              width: hs(88),
              height: vs(88),
              borderRadius: ms(44),
              backgroundColor: '#1E193C',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: vs(16),
              borderWidth: 2,
              borderColor: '#433A74',
              shadowColor: '#6366F1',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            {/* Outline Trophy Icon */}
            <Svg height="46" viewBox="0 0 24 24" width="46" fill="none">
              <Path
                d="M6 9V3h12v6c0 3.31-2.69 6-6 6s-6-2.69-6-6z"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M6 5H3c0 2.21 1.79 4 4 4M18 5h3c0 2.21-1.79 4-4 4M12 15v4M8 21h8"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* Tiêu đề lớn: BẠN THẮNG / BẠN THUA / HÒA TRẬN */}
          <Text
            style={{
              fontSize: ms(30),
              fontWeight: '900',
              color: '#FFFFFF',
              letterSpacing: 1.5,
              marginBottom: vs(24),
              textAlign: 'center',
            }}
          >
            {resultTitle}
          </Text>

          {/* ================= THẺ TỈ SỐ & THỐNG KÊ (Card giữa) ================= */}
          <View
            style={{
              width: '100%',
              backgroundColor: '#1C173B',
              borderRadius: ms(20),
              paddingHorizontal: hs(16),
              paddingTop: vs(20),
              paddingBottom: vs(16),
              marginBottom: vs(28),
              borderWidth: 1.5,
              borderColor: '#2D265C',
            }}
          >
            {/* Hàng 2 người chơi và điểm số */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: vs(20),
              }}
            >
              {/* Bên Bạn */}
              <View style={{ alignItems: 'center', flex: 1 }}>
                <UserAvatar size={ms(54)} backgroundColor="#3730A3" style={{ marginBottom: vs(8), borderWidth: 2, borderColor: '#818CF8' }} />
                <Text
                  style={{
                    color: '#9CA3AF',
                    fontSize: ms(13),
                    fontWeight: '700',
                    marginBottom: vs(4),
                  }}
                >
                  Bạn
                </Text>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: ms(28),
                    fontWeight: '900',
                  }}
                >
                  {myScore}
                </Text>
              </View>

              {/* Huy hiệu vs ở giữa */}
              <View
                style={{
                  width: hs(30),
                  height: vs(30),
                  borderRadius: ms(15),
                  backgroundColor: '#120F24',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#2D265C',
                  marginHorizontal: hs(4),
                }}
              >
                <Text
                  style={{
                    color: '#6B7280',
                    fontSize: ms(11),
                    fontWeight: '900',
                  }}
                >
                  vs
                </Text>
              </View>

              {/* Bên Đối thủ Hạ Ngân */}
              <View style={{ alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: hs(54),
                    height: vs(54),
                    borderRadius: ms(27),
                    backgroundColor: '#0E7490',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: vs(8),
                    borderWidth: 2,
                    borderColor: '#22D3EE',
                    shadowColor: '#22D3EE',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.5,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontSize: ms(24),
                      fontWeight: '900',
                    }}
                  >
                    H
                  </Text>
                </View>
                <Text
                  style={{
                    color: '#9CA3AF',
                    fontSize: ms(13),
                    fontWeight: '700',
                    marginBottom: vs(4),
                  }}
                >
                  {opponentName}
                </Text>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: ms(28),
                    fontWeight: '900',
                  }}
                >
                  {opponentScore}
                </Text>
              </View>
            </View>

            {/* Hàng 2 khối thống kê: CÂU ĐÚNG & XU NHẬN ĐƯỢC */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: hs(10),
              }}
            >
              {/* Khối 1: CÂU ĐÚNG */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#14102D',
                  borderRadius: ms(14),
                  paddingHorizontal: hs(12),
                  paddingVertical: vs(10),
                  borderWidth: 1,
                  borderColor: '#2A2353',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: vs(4),
                  }}
                >
                  {/* Icon hồng tâm / bia ngắm */}
                  <Svg height="14" viewBox="0 0 24 24" width="14" fill="none" style={{ marginRight: hs(5) }}>
                    <Circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth={2} />
                    <Circle cx="12" cy="12" r="5" stroke="#9CA3AF" strokeWidth={2} />
                    <Circle cx="12" cy="12" r="1.5" fill="#9CA3AF" />
                  </Svg>
                  <Text
                    style={{
                      color: '#9CA3AF',
                      fontSize: ms(10),
                      fontWeight: '800',
                      letterSpacing: 0.5,
                    }}
                  >
                    CÂU ĐÚNG
                  </Text>
                </View>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: ms(17),
                    fontWeight: '900',
                  }}
                >
                  {correctCount}/{totalUserQuestions}
                </Text>
              </View>

              {/* Khối 2: XU NHẬN ĐƯỢC */}
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#14102D',
                  borderRadius: ms(14),
                  paddingHorizontal: hs(12),
                  paddingVertical: vs(10),
                  borderWidth: 1,
                  borderColor: '#2A2353',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: vs(4),
                  }}
                >
                  {/* Icon đồng xu vàng */}
                  <Svg height="14" viewBox="0 0 24 24" width="14" fill="none" style={{ marginRight: hs(5) }}>
                    <Circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth={2} />
                    <Path d="M12 7v10M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2 2-2 3M9.5 15h5" stroke="#9CA3AF" strokeWidth={1.5} strokeLinecap="round" />
                  </Svg>
                  <Text
                    style={{
                      color: '#9CA3AF',
                      fontSize: ms(10),
                      fontWeight: '800',
                      letterSpacing: 0.5,
                    }}
                  >
                    XU NHẬN ĐƯỢC
                  </Text>
                </View>
                <Text
                  style={{
                    color: '#FBBF24',
                    fontSize: ms(17),
                    fontWeight: '900',
                  }}
                >
                  +{coinReward} xu
                </Text>
              </View>
            </View>
          </View>

          {/* ================= 2 NÚT THAO TÁC DƯỚI ================= */}
          {/* Nút 1: ĐẤU VÁN NỮA (Tím gradient/vibrant) */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPlayAgain}
            style={{
              width: '100%',
              borderRadius: ms(999),
              paddingVertical: vs(14),
              backgroundColor: '#8257E5',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#8257E5',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 6,
              marginBottom: vs(12),
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: ms(16),
                fontWeight: '900',
                letterSpacing: 0.8,
              }}
            >
              ĐẤU VÁN NỮA
            </Text>
          </TouchableOpacity>

          {/* Nút 2: VỀ SẢNH TRÒ CHƠI (Tối viền xám) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              const xp = isWinner ? 100 : isDraw ? 50 : 30;
              onExit({
                myScore,
                opponentScore,
                correctCount,
                totalQuestions: totalUserQuestions,
                xpEarned: xp,
                opponentName,
                isWin: isWinner,
              });
            }}
            style={{
              width: '100%',
              borderRadius: ms(999),
              paddingVertical: vs(14),
              backgroundColor: '#1E193C',
              borderWidth: 1.5,
              borderColor: '#322A5C',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: ms(15),
                fontWeight: '800',
                letterSpacing: 0.5,
              }}
            >
              VỀ SẢNH TRÒ CHƠI
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BattleResultView;

