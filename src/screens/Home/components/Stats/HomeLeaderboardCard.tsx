import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { UserAvatar } from '@/components/atoms';
import { useTheme, hs, vs, ms } from '@/theme';

interface HomeLeaderboardCardProps {
  onSeeAll: () => void;
  userXp?: number;
  userLevel?: number;
  userRank?: number;
}

export const HomeLeaderboardCard = ({
  onSeeAll,
  userXp = 3850,
  userLevel = 6,
  userRank = 4,
}: HomeLeaderboardCardProps) => {
  const { layout } = useTheme();

  return (
    <View style={{ paddingHorizontal: hs(16), marginBottom: vs(24) }}>
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
        <View style={[layout.row, layout.justifyBetween, layout.itemsCenter, { marginBottom: vs(14) }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSeeAll}
            style={[layout.row, layout.itemsCenter]}
          >
            <View style={{ backgroundColor: '#FFB74D', borderRadius: ms(21), height: vs(42), width: hs(42) }} />
            <Text style={{ color: '#111827', fontSize: ms(16), fontWeight: '700', marginLeft: hs(12) }}>
              Bảng xếp hạng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={onSeeAll}>
            <Text style={{ color: '#1F4086', fontSize: ms(14), fontWeight: '700' }}>
              Xem tất cả {'>'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ rowGap: vs(12) }}>
          {/* Rank 1 */}
          <View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
            <View style={[layout.row, layout.itemsCenter]}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: '#F5A623',
                  borderRadius: ms(12),
                  height: vs(24),
                  justifyContent: 'center',
                  width: hs(24),
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: ms(11), fontWeight: '800' }}>1</Text>
              </View>
              <View
                style={{
                  backgroundColor: '#E0E0E0',
                  borderRadius: ms(16),
                  height: vs(32),
                  marginLeft: hs(10),
                  marginRight: hs(10),
                  width: hs(32),
                }}
              />
              <View>
                <Text style={{ color: '#111827', fontSize: ms(16), fontWeight: '700' }}>Thư</Text>
                <Text style={{ color: '#9E9E9E', fontSize: ms(12), marginTop: vs(1) }}>Level 14</Text>
              </View>
            </View>
            <Text style={{ color: '#4B5563', fontSize: ms(14), fontWeight: '700' }}>5.665 XP</Text>
          </View>

          {/* Rank 2 */}
          <View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
            <View style={[layout.row, layout.itemsCenter]}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: '#7E57C2',
                  borderRadius: ms(12),
                  height: vs(24),
                  justifyContent: 'center',
                  width: hs(24),
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: ms(11), fontWeight: '800' }}>2</Text>
              </View>
              <View
                style={{
                  backgroundColor: '#E0E0E0',
                  borderRadius: ms(16),
                  height: vs(32),
                  marginLeft: hs(10),
                  marginRight: hs(10),
                  width: hs(32),
                }}
              />
              <View>
                <Text style={{ color: '#111827', fontSize: ms(16), fontWeight: '700' }}>12 Minh</Text>
                <Text style={{ color: '#9E9E9E', fontSize: ms(12), marginTop: vs(1) }}>Level 8</Text>
              </View>
            </View>
            <Text style={{ color: '#4B5563', fontSize: ms(14), fontWeight: '700' }}>5.010 XP</Text>
          </View>

          {/* Rank 3 */}
          <View style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
            <View style={[layout.row, layout.itemsCenter]}>
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: '#FF7043',
                  borderRadius: ms(12),
                  height: vs(24),
                  justifyContent: 'center',
                  width: hs(24),
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: ms(11), fontWeight: '800' }}>3</Text>
              </View>
              <View
                style={{
                  backgroundColor: '#E0E0E0',
                  borderRadius: ms(16),
                  height: vs(32),
                  marginLeft: hs(10),
                  marginRight: hs(10),
                  width: hs(32),
                }}
              />
              <View>
                <Text style={{ color: '#111827', fontSize: ms(16), fontWeight: '700' }}>Quỳnh Chu</Text>
                <Text style={{ color: '#9E9E9E', fontSize: ms(12), marginTop: vs(1) }}>Level 7</Text>
              </View>
            </View>
            <Text style={{ color: '#4B5563', fontSize: ms(14), fontWeight: '700' }}>4.435 XP</Text>
          </View>

          {/* Current User Row (Mock Rank 4) */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#FFF5F5',
              borderRadius: ms(12),
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: vs(4),
              paddingHorizontal: hs(12),
              paddingVertical: vs(8),
            }}
          >
            <View style={[layout.row, layout.itemsCenter]}>
              {/* Huy hiệu Hạng 4 đồng bộ với Rank 1, 2, 3 */}
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: '#E53935',
                  borderRadius: ms(12),
                  height: vs(24),
                  justifyContent: 'center',
                  marginRight: hs(10),
                  width: hs(24),
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: ms(11), fontWeight: '800' }}>{userRank}</Text>
              </View>

              <UserAvatar size={ms(32)} style={{ marginRight: hs(10) }} />
              <View>
                <Text style={{ color: '#111827', fontSize: ms(16), fontWeight: '700' }}>
                  Hoàng Văn Hùng <Text style={{ color: '#E53935' }}>(Bạn)</Text>
                </Text>
                <Text style={{ color: '#9E9E9E', fontSize: ms(12), marginTop: vs(1) }}>
                  Level {userLevel}
                </Text>
              </View>
            </View>
            <Text style={{ color: '#111827', fontSize: ms(14), fontWeight: '700' }}>
              {userXp.toLocaleString('vi-VN')} XP
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
