import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { hs, vs, ms } from '@/theme';
import { LeaderboardRow } from '@/components/molecules/cards/LeaderboardRow';
import { GameMatchCard } from '@/components/molecules/cards/GameMatchCard';

export function GameContent({ targetView }: { targetView?: 'main' | 'rules' | 'leaderboard' }) {
  const { height: screenHeight } = useWindowDimensions();
  // Quản lý trạng thái màn hình: 'main' (màn hình tìm người) | 'rules' (luật chơi) | 'leaderboard' (bảng xếp hạng)
  const [viewState, setViewState] = useState<'main' | 'rules' | 'leaderboard'>('main');

  // Cập nhật view khi có yêu cầu chuyển trang từ màn hình khác
  React.useEffect(() => {
    if (targetView) {
      setViewState(targetView);
    }
  }, [targetView]);

  // Màn hình Luật chơi
  if (viewState === 'rules') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
        <ScrollView contentContainerStyle={{ padding: ms(16) }} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(24) }}>
            <TouchableOpacity 
              onPress={() => setViewState('main')} 
              style={{ width: hs(45), height: vs(45), alignItems: 'center', justifyContent: 'center', marginLeft: hs(-12), marginRight: hs(4) }}
            >
              <Svg height="28" viewBox="0 0 24 24" width="28" fill="none">
                <Path d="M19 12H5M12 19l-7-7 7-7" stroke="#0E84F2" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <Text style={{ fontSize: ms(18), fontWeight: '700', color: '#111827' }}>Thông tin luật chơi</Text>
          </View>

          {/* Box 1: Chế độ thi đấu */}
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: ms(16), padding: ms(20), marginBottom: vs(20), elevation: 1, shadowColor: '#000', shadowOffset: { width: hs(0), height: vs(1) }, shadowOpacity: 0.05, shadowRadius: 3 }}>
            <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827', marginBottom: vs(16) }}>
              Chế độ thi đấu
            </Text>

            {/* Rule 1 */}
            <View style={{ borderColor: '#F0F2F5', borderWidth: 1, borderRadius: ms(12), padding: ms(14), marginBottom: vs(12) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(6) }}>
                <View style={{ backgroundColor: '#F3E8FF', borderRadius: ms(8), height: vs(28), width: hs(28), alignItems: 'center', justifyContent: 'center', marginRight: hs(10) }}>
                  <Svg height="14" viewBox="0 0 24 24" width="14">
                    <Path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" fill="#9333EA" />
                  </Svg>
                </View>
                <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#111827' }}>30 câu mỗi trận</Text>
              </View>
              <Text style={{ fontSize: ms(13), color: '#4B5563', lineHeight: ms(20) }}>Luân phiên từng câu, mỗi người trả lời 15 câu.</Text>
            </View>

            {/* Rule 2 */}
            <View style={{ borderColor: '#F0F2F5', borderWidth: 1, borderRadius: ms(12), padding: ms(14), marginBottom: vs(12) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(6) }}>
                <View style={{ backgroundColor: '#FEF3C7', borderRadius: ms(8), height: vs(28), width: hs(28), alignItems: 'center', justifyContent: 'center', marginRight: hs(10) }}>
                  <Svg height="14" viewBox="0 0 24 24" width="14">
                    <Path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#D97706" />
                  </Svg>
                </View>
                <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#111827' }}>10 giây mỗi lượt</Text>
              </View>
              <Text style={{ fontSize: ms(13), color: '#4B5563', lineHeight: ms(20) }}>Hết giờ mà chưa bấm là mất câu đó, lượt chuyển sang đối thủ.</Text>
            </View>

            {/* Rule 3 */}
            <View style={{ borderColor: '#F0F2F5', borderWidth: 1, borderRadius: ms(12), padding: ms(14), marginBottom: vs(12) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(6) }}>
                <View style={{ backgroundColor: '#D1FAE5', borderRadius: ms(8), height: vs(28), width: hs(28), alignItems: 'center', justifyContent: 'center', marginRight: hs(10) }}>
                  <Svg height="14" viewBox="0 0 24 24" width="14">
                    <Path d="M7 2v11h3v9l7-12h-4l4-8z" fill="#059669" />
                  </Svg>
                </View>
                <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#111827' }}>Nhanh và đúng ăn nhiều điểm</Text>
              </View>
              <Text style={{ fontSize: ms(13), color: '#4B5563', lineHeight: ms(20) }}>100 điểm nền, cộng tối đa 50 theo tốc độ; đúng liên tiếp lên hệ số tới x3.</Text>
            </View>

            {/* Rule 4 */}
            <View style={{ borderColor: '#F0F2F5', borderWidth: 1, borderRadius: ms(12), padding: ms(14) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(6) }}>
                <View style={{ backgroundColor: '#FFE4E6', borderRadius: ms(8), height: vs(28), width: hs(28), alignItems: 'center', justifyContent: 'center', marginRight: hs(10) }}>
                  <Svg height="14" viewBox="0 0 24 24" width="14">
                    <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.11-1.36-3.11-2.92v-1.46h2.67v1.25c0 .6.67 1.05 1.78 1.05 1.25 0 1.78-.4 1.78-.96 0-1.46-5.11-1.11-5.11-4.04 0-1.6 1.25-2.62 2.98-2.98V6h2.67v1.98c1.51.31 2.8 1.2 2.8 2.62v1.38h-2.67v-1.11c0-.49-.53-.89-1.51-.89-1.33 0-1.78.49-1.78.98 0 1.46 5.11 1.07 5.11 4.13 0 1.55-1.25 2.62-2.94 3z" fill="#E11D48" />
                  </Svg>
                </View>
                <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#111827' }}>Thắng 60 xu</Text>
              </View>
              <Text style={{ fontSize: ms(13), color: '#4B5563', lineHeight: ms(20) }}>Hoà 25, thua 10 — chơi là có xu, không sợ mất trắng.</Text>
            </View>
          </View>

          {/* Box 2: Thông tin chi tiết */}
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: ms(16), padding: ms(20), marginBottom: vs(20), elevation: 1, shadowColor: '#000', shadowOffset: { width: hs(0), height: vs(1) }, shadowOpacity: 0.05, shadowRadius: 3 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(16) }}>
              <Svg height="24" viewBox="0 0 24 24" width="24" style={{ marginRight: hs(8) }}>
                <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#8B5CF6" />
              </Svg>
              <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827', flex: 1 }}>Đấu trường PK tiếng Trung hoạt động thế nào?</Text>
            </View>
            <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: ms(24), marginBottom: vs(12) }}>Đấu trường PK là chế độ thi đấu trực tiếp của Hanbeego: hai người vào cùng một trận và trả lời LUÂN PHIÊN từng câu — bạn một câu, đối thủ một câu, mỗi người mười lăm câu trong bộ ba mươi câu từ vựng HSK...</Text>
            <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: ms(24) }}>Bạn có ba cách vào trận: ghép nhanh với một người bất kỳ đang chờ ở cùng cấp HSK, mở phòng riêng để lấy mã sáu ký tự mời bạn bè...</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Màn hình Bảng xếp hạng
  if (viewState === 'leaderboard') {


    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <View style={{ padding: ms(16), flex: 1, paddingBottom: vs(24) }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(24) }}>
            <TouchableOpacity 
              onPress={() => setViewState('main')} 
              style={{ width: hs(45), height: vs(45), alignItems: 'center', justifyContent: 'center', marginLeft: hs(-12), marginRight: hs(4) }}
            >
              <Svg height="28" viewBox="0 0 24 24" width="28" fill="none">
                <Path d="M19 12H5M12 19l-7-7 7-7" stroke="#0E84F2" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            <Text style={{ fontSize: ms(24), fontWeight: '900', color: '#111827' }}>Game PK (1 vs 1)</Text>
          </View>

          <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: vs(16) }}>BẢNG XẾP HẠNG NGƯỜI CHƠI</Text>

          {/* Bảng xếp hạng (Box) */}
          <View style={{ backgroundColor: '#FAFAFA', borderRadius: ms(12), borderWidth: 1, borderColor: '#F0F2F5', overflow: 'hidden', flex: 1 }}>
            {/* Table Header */}
            <View style={{ flexDirection: 'row', paddingHorizontal: hs(16), paddingVertical: vs(12), borderBottomWidth: 1, borderBottomColor: '#EEEEEE' }}>
              <Text style={{ color: '#9E9E9E', fontSize: ms(10), fontWeight: '700', width: hs(40) }}>HẠNG</Text>
              <Text style={{ color: '#9E9E9E', fontSize: ms(10), fontWeight: '700', flex: 1 }}>NGƯỜI CHƠI</Text>
              <Text style={{ color: '#9E9E9E', fontSize: ms(10), fontWeight: '700', textAlign: 'right', width: hs(80) }}>ĐIỂM GAME</Text>
            </View>
            
            <ScrollView contentContainerStyle={{ padding: ms(16), rowGap: vs(16) }} showsVerticalScrollIndicator={false}>
              <LeaderboardRow rank={1} name="Thùy Dương" score="120.083" bg="#F5A623" color="#FFFFFF" />
              <LeaderboardRow rank={2} name="Đào Thị Ngọc Hân" score="82.856" bg="#D6B4E6" color="#FFFFFF" />
              <LeaderboardRow rank={3} name="HD Travel Hoàng Hùng" score="33.856" bg="#FF7043" color="#FFFFFF" />
              <LeaderboardRow rank={4} name="Kiều Chấn Minh 2k17 Fan Cr7" score="29.817" bg="#F0F2F5" color="#4B5563" />
              <LeaderboardRow rank={5} name="LOAN THẢO NGUYỄN" score="26.761" bg="#F0F2F5" color="#4B5563" />
              <LeaderboardRow rank={6} name="Thị Huyền Diệu Nguyễn" score="24.295" bg="#F0F2F5" color="#4B5563" />
              <LeaderboardRow rank={7} name="Băng Hải" score="22.783" bg="#F0F2F5" color="#4B5563" />
              <LeaderboardRow rank={8} name="Trang Minh" score="21.490" bg="#F0F2F5" color="#4B5563" />
            </ScrollView>
          </View>
          
          {/* Current User Row */}
          <View style={{ alignItems: 'center', backgroundColor: '#FFF5F5', borderRadius: ms(999), flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: hs(16), paddingVertical: vs(12), marginTop: vs(24), alignSelf: 'center', width: '90%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#4B5563', borderRadius: ms(16), height: vs(32), width: hs(32), marginRight: hs(10) }} />
              <View>
                <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '800' }}>Hoàng Văn Hùng <Text style={{ color: '#E53935' }}>(Bạn)</Text></Text>
                <Text style={{ color: '#9E9E9E', fontSize: ms(11), marginTop: vs(1), fontWeight: '500' }}>Level 1</Text>
              </View>
            </View>
            <Text style={{ color: '#111827', fontSize: ms(13), fontWeight: '800' }}>0 XP</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Màn hình chính Game PK
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={{ padding: ms(16), paddingTop: vs(32) }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: screenHeight > 750 ? 60 : 30, position: 'relative' }}>
          <Text style={{ fontSize: ms(24), fontWeight: '900', color: '#111827' }}>Game PK (1 vs 1)</Text>
        </View>

        {/* Cụm Bắt đầu tìm người */}
        <GameMatchCard onSearch={() => {}} />

        {/* Nút Luật chơi */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setViewState('rules')}
          style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginBottom: screenHeight > 750 ? 60 : 40 }}
        >
          <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginRight: hs(6) }}>
            <Circle cx="12" cy="12" r="10" fill="none" stroke="#6B7280" strokeWidth="2" />
            <Path d="M12 16v-4M12 8h.01" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
          </Svg>
          <Text style={{ color: '#6B7280', fontSize: ms(13), fontWeight: '500' }}>
            Thông tin luật chơi của game
          </Text>
        </TouchableOpacity>

        {/* Lịch sử thi đấu & Xem bảng xếp hạng */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(16) }}>
          <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827' }}>Lịch sử thi đấu</Text>
          <TouchableOpacity onPress={() => setViewState('leaderboard')}>
            <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#1F4086' }}>Xem bảng xếp hạng &gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Empty state box */}
        <View
          style={{
            backgroundColor: '#FAFAFA',
            borderColor: '#F0F2F5',
            borderWidth: 1,
            borderRadius: ms(12),
            padding: ms(32),
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: screenHeight > 750 ? 250 : 180,
          }}
        >
          <Text style={{ color: '#6B7280', fontSize: ms(13), fontWeight: '500' }}>
            Hãy bắt đầu chơi ngay nào!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default GameContent;
