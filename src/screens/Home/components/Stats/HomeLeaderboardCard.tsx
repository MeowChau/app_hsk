import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { UserAvatar } from '@/components/atoms';
import { useTheme, hs, vs, ms } from '@/theme';
import { useProfile } from '@/services/auth';
import { useStreakLeaderboard } from '@/services/leaderboard';

interface HomeLeaderboardCardProps {
  onSeeAll: () => void;
  userXp?: number;
  userLevel?: number;
  userRank?: number;
}

const RANK_COLORS = ['#F5A623', '#7E57C2', '#FF7043'];

export const HomeLeaderboardCard = ({
  onSeeAll,
  userXp: propUserXp,
  userLevel: propUserLevel,
  userRank: propUserRank,
}: HomeLeaderboardCardProps) => {
  const { layout } = useTheme();
  const { data: profile } = useProfile();
  const { data, isLoading } = useStreakLeaderboard();

  const leaderboardList = data?.leaderboard || [];
  const top3 = leaderboardList.slice(0, 3);

  // Tìm vị trí của người dùng hiện tại trong bảng xếp hạng
  const userIndex = leaderboardList.findIndex((item) => item.id === profile?.id);
  const userRank =
    propUserRank ??
    (userIndex !== -1
      ? userIndex + 1
      : leaderboardList.length > 0
        ? leaderboardList.length + 1
        : 1);

  const currentUserItem = userIndex !== -1 ? leaderboardList[userIndex] : null;
  const currentUserStreak = currentUserItem?.currentStreak ?? 0;
  const currentUserLevel =
    propUserLevel ??
    (profile?.currentHskLevel || currentUserItem?.currentHskLevel || profile?.level || 1);
  const currentUserXp =
    propUserXp ?? (profile?.currentExp ?? currentUserItem?.currentExp ?? 0);

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
        {/* Header */}
        <View style={[layout.row, layout.justifyBetween, layout.itemsCenter, { marginBottom: vs(14) }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSeeAll}
            style={[layout.row, layout.itemsCenter]}
          >
            <View
              style={{
                alignItems: 'center',
                backgroundColor: '#FFF8E1',
                borderRadius: ms(21),
                height: vs(42),
                justifyContent: 'center',
                width: hs(42),
              }}
            >
              <Text style={{ fontSize: ms(22) }}>🏆</Text>
            </View>
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

        {/* Danh sách Top 3 */}
        <View style={{ rowGap: vs(12) }}>
          {isLoading ? (
            <ActivityIndicator color="#1E3A8A" style={{ marginVertical: vs(20) }} />
          ) : top3.length > 0 ? (
            top3.map((r, index) => (
              <View key={r.id || index} style={[layout.row, layout.itemsCenter, layout.justifyBetween]}>
                <View style={[layout.row, layout.itemsCenter]}>
                  {/* Badge hạng */}
                  <View
                    style={{
                      alignItems: 'center',
                      backgroundColor: RANK_COLORS[index] || '#BDBDBD',
                      borderRadius: ms(12),
                      height: vs(24),
                      justifyContent: 'center',
                      width: hs(24),
                    }}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: ms(11), fontWeight: '800' }}>
                      {index + 1}
                    </Text>
                  </View>

                  {/* Avatar */}
                  <View
                    style={{
                      backgroundColor: '#E0E0E0',
                      borderRadius: ms(16),
                      height: vs(32),
                      marginLeft: hs(10),
                      marginRight: hs(10),
                      width: hs(32),
                      overflow: 'hidden',
                    }}
                  >
                    <UserAvatar size={ms(32)} />
                  </View>

                  {/* Tên & Level */}
                  <View>
                    <Text style={{ color: '#111827', fontSize: ms(15), fontWeight: '700' }}>
                      {r.fullName || r.email || `Học viên #${r.id}`}
                    </Text>
                    <Text style={{ color: '#9E9E9E', fontSize: ms(12), marginTop: vs(1) }}>
                      HSK {r.currentHskLevel || r.level || 1}
                    </Text>
                  </View>
                </View>

                {/* Số ngày streak */}
                <Text style={{ color: '#4B5563', fontSize: ms(14), fontWeight: '700' }}>
                  {r.currentStreak ?? 0} ngày
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: '#9E9E9E', fontSize: ms(14), textAlign: 'center', marginVertical: vs(12) }}>
              Chưa có dữ liệu bảng xếp hạng
            </Text>
          )}

          {/* Dòng User Hiện Tại (Bạn) */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#FFF5F5',
              borderColor: '#FFEBEE',
              borderRadius: ms(12),
              borderWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: vs(4),
              paddingHorizontal: hs(12),
              paddingVertical: vs(8),
            }}
          >
            <View style={[layout.row, layout.itemsCenter]}>
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
                <Text style={{ color: '#FFFFFF', fontSize: ms(11), fontWeight: '800' }}>
                  {userRank}
                </Text>
              </View>

              <UserAvatar size={ms(32)} style={{ marginRight: hs(10) }} />
              <View>
                <Text style={{ color: '#111827', fontSize: ms(15), fontWeight: '700' }}>
                  {profile?.fullName || profile?.username || 'Bạn'} <Text style={{ color: '#E53935' }}>(Bạn)</Text>
                </Text>
                <Text style={{ color: '#9E9E9E', fontSize: ms(12), marginTop: vs(1) }}>
                  HSK {currentUserLevel} • {currentUserXp.toLocaleString('vi-VN')} XP
                </Text>
              </View>
            </View>

            <Text style={{ color: '#E53935', fontSize: ms(14), fontWeight: '700' }}>
              {currentUserStreak} ngày
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default HomeLeaderboardCard;
