import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { hs, vs, ms } from '@/theme';
import { MatchingPlayerCard } from './MatchingPlayerCard';
import { MatchingOpponentCard } from './MatchingOpponentCard';
import { MatchingVsBadge } from './MatchingVsBadge';
import { MatchingProgressBar } from './MatchingProgressBar';

interface GameMatchingViewProps {
  onCancel: () => void;
  onMatchSuccess?: (opponent: { name: string }) => void;
  userName?: string;
}

export const GameMatchingView = ({
  onCancel,
  onMatchSuccess,
  userName = 'Hoàng Văn Hùng',
}: GameMatchingViewProps) => {
  const [isMatched, setIsMatched] = React.useState(false);

  // Demo: Sau 3s là tìm thấy đối thủ thành công
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsMatched(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: hs(16),
          paddingVertical: vs(12),
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6',
        }}
      >
        <TouchableOpacity
          onPress={onCancel}
          activeOpacity={0.7}
          style={{
            width: hs(40),
            height: vs(40),
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: hs(8),
          }}
        >
          <Svg height="26" viewBox="0 0 24 24" width="26" fill="none">
            <Path
              d="M19 12H5M12 19l-7-7 7-7"
              stroke="#0E84F2"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text style={{ fontSize: ms(18), fontWeight: '700', color: '#111827' }}>
          {isMatched ? 'Ghép trận thành công' : 'Tìm đối thủ'}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          paddingHorizontal: hs(20),
          paddingTop: vs(40),
          alignItems: 'center',
        }}
      >
        {/* ================= KHỐI 2 NGƯỜI CHƠI & VS ================= */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginBottom: vs(40),
          }}
        >
          <MatchingPlayerCard userName={userName} />
          <MatchingVsBadge />
          <MatchingOpponentCard isMatched={isMatched} opponentName="Hạ Ngân" />
        </View>

        {/* ================= TIÊU ĐỀ TRẠNG THÁI ================= */}
        <Text
          style={{
            fontSize: ms(22),
            fontWeight: '800',
            color: isMatched ? '#059669' : '#111827',
            marginBottom: vs(8),
            textAlign: 'center',
          }}
        >
          {isMatched ? 'Ghép trận thành công!' : 'Đang tìm đối thủ ...'}
        </Text>
        <Text
          style={{
            fontSize: ms(14),
            color: isMatched ? '#059669' : '#6B7280',
            textAlign: 'center',
            marginBottom: vs(28),
          }}
        >
          {isMatched
            ? 'Đã tìm thấy đối thủ Hạ Ngân. Bạn có thể vào trận hoặc huỷ.'
            : 'Đang dò những người chơi đang chờ trong game.'}
        </Text>

        {/* ================= THANH TIẾN ĐỘ & TIMER ================= */}
        <MatchingProgressBar isMatched={isMatched} />

        {/* ================= NÚT THAO TÁC DƯỚI ================= */}
        {isMatched ? (
          <View style={{ width: '100%', alignItems: 'center' }}>
            {/* Nút Vào trận ngay */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onMatchSuccess?.({ name: 'Hạ Ngân' })}
              style={{
                width: '85%',
                borderRadius: ms(999),
                paddingVertical: vs(14),
                backgroundColor: '#059669',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#059669',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 4,
                marginBottom: vs(12),
              }}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: ms(16),
                  fontWeight: '800',
                }}
              >
                Vào trận ngay
              </Text>
            </TouchableOpacity>

            {/* Nút Huỷ trận */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onCancel}
              style={{
                width: '85%',
                borderColor: '#FCA5A5',
                borderWidth: 1.5,
                borderRadius: ms(999),
                paddingVertical: vs(12),
                backgroundColor: '#FFF5F5',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: '#DC2626',
                  fontSize: ms(15),
                  fontWeight: '700',
                }}
              >
                Huỷ trận đấu
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onCancel}
            style={{
              borderColor: '#E5E7EB',
              borderWidth: 1.5,
              borderRadius: ms(999),
              paddingHorizontal: hs(32),
              paddingVertical: vs(12),
              backgroundColor: '#FFFFFF',
            }}
          >
            <Text
              style={{
                color: '#4B5563',
                fontSize: ms(15),
                fontWeight: '700',
              }}
            >
              Huỷ tìm kiếm
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default GameMatchingView;
