import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
import { hs, vs, ms, useTheme } from '@/theme';
import { Button } from '@/components/atoms';
import { ScreenHeader } from '@/components/molecules';
import { useProfile } from '@/services/auth/useAuth';
import { type PkMatchingState } from '@/services/game/pkMatchmaking';
import { MatchingPlayerCard } from './MatchingPlayerCard';
import { MatchingOpponentCard } from './MatchingOpponentCard';
import { MatchingVsBadge } from './MatchingVsBadge';
import { MatchingProgressBar } from './MatchingProgressBar';

interface GameMatchingViewProps {
  onCancel: () => void;
  state: PkMatchingState;
  onReady: () => Promise<void>;
}

export const GameMatchingView = ({ onCancel, state, onReady }: GameMatchingViewProps) => {
  const { colors } = useTheme();
  const profileQuery = useProfile();
  const profile = profileQuery.data;
  const [readyBusy, setReadyBusy] = useState(false);
  const level = state.hskLevel || profile?.currentHskLevel || 1;
  const matched = state.phase === 'matched';
  const failed = state.phase === 'error' || (!profile && !!profileQuery.error);
  const searching = !failed && !matched;
  const opponentId = state.match?.users.find(id => id !== profile?.id);
  const opponent = state.match?.players.find(user => user.id === opponentId);
  const opponentName = opponent?.name || (opponentId ? 'Người chơi #' + opponentId : 'Đối thủ');
  const myReady = !!state.room?.readyUserIds.includes(profile?.id || 0);
  const peerReady = !!state.room?.readyUserIds.includes(opponentId || 0);
  const handleReady = async () => {
    if (readyBusy || myReady) return;
    setReadyBusy(true);
    try { await onReady(); }
    catch (error) { Alert.alert('Chưa thể sẵn sàng', error instanceof Error ? error.message : 'Vui lòng thử lại.'); }
    finally { setReadyBusy(false); }
  };
  const title = failed ? 'Chưa thể ghép trận' : matched ? 'Đã tìm thấy đối thủ' : state.phase === 'connecting' ? 'Đang kết nối PK' : 'Đang tìm đối thủ';
  const subtitle = failed ? state.message || 'Không thể tải tài khoản. Vui lòng quay lại sảnh.'
    : matched ? 'Đối thủ: ' + opponentName + '. ' + (myReady ? 'Đang chờ đối thủ xác nhận sẵn sàng.' : 'Bấm Sẵn sàng để bắt đầu khi cả hai đã xác nhận.')
    : state.phase === 'connecting' ? 'Đang kết nối máy chủ để tìm người chơi thật.'
    : 'Đang tìm người chơi cùng HSK ' + level + '.' + (state.onlineCount !== undefined ? ' Có ' + state.onlineCount + ' người đang kết nối.' : '');
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScreenHeader title={matched ? 'Đã ghép trận' : 'Tìm đối thủ PK'} onBack={onCancel} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: hs(20), paddingTop: vs(32), paddingBottom: vs(24), alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: vs(28) }}>
          <MatchingPlayerCard userName={profile?.fullName || profile?.username || 'Bạn'} photoUrl={profile?.photo?.path}
            statusText={failed ? 'Kết nối gián đoạn' : matched ? myReady ? 'Sẵn sàng' : 'Chờ sẵn sàng' : state.phase === 'connecting' ? 'Đang kết nối' : 'Đang chờ ghép'}
            tone={failed ? 'error' : myReady ? 'matched' : 'pending'} busy={searching} />
          <MatchingVsBadge active={searching} />
          <MatchingOpponentCard isMatched={matched} opponentName={opponentName} photoUrl={opponent?.photoUrl} ready={peerReady} busy={searching} failed={failed} />
        </View>
        <Text accessibilityRole="header" style={{ fontSize: ms(24), fontWeight: '800', color: failed ? colors.red500 : '#111827', textAlign: 'center', marginBottom: vs(12) }}>{title}</Text>
        <Text accessibilityLiveRegion="polite" style={{ fontSize: ms(14), lineHeight: ms(22), color: colors.text, textAlign: 'center', marginBottom: vs(24), paddingHorizontal: hs(8) }}>{subtitle}</Text>
        <MatchingProgressBar isMatched={matched} active={searching} readyCount={state.room?.readyUserIds.length || 0} />
        {matched && (
          <Button
            title={myReady ? 'Đang chờ đối thủ' : 'Sẵn sàng vào trận'}
            onPress={handleReady}
            disabled={myReady || readyBusy}
            loading={readyBusy}
            fullWidth
            accessibilityRole="button"
            accessibilityLabel={readyBusy ? 'Đang xác nhận sẵn sàng' : myReady ? 'Đang chờ đối thủ' : 'Sẵn sàng vào trận'}
            accessibilityState={{ disabled: myReady || readyBusy, busy: readyBusy }}
            style={{ minHeight: vs(52), backgroundColor: myReady ? colors.gray50 : '#1F4086', marginBottom: vs(12) }}
          />
        )}
        <Button
          title={failed ? 'Về sảnh' : matched ? 'Rời màn ghép trận' : 'Dừng tìm kiếm'}
          onPress={onCancel}
          variant={failed ? 'primary' : 'outline'}
          fullWidth
          accessibilityRole="button"
          style={{ minHeight: vs(52), ...(failed ? { backgroundColor: '#1F4086' } : { borderColor: colors.gray100 }) }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default GameMatchingView;
