import React, { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, Alert, ScrollView, Text, TouchableOpacity } from 'react-native';
import { hs, vs, ms } from '@/theme';
import { BattleHeader } from './BattleHeader';
import { BattleQuestionCard } from './BattleQuestionCard';
import { BattleScoreBar } from './BattleScoreBar';
import { BattleResultView, type MatchResultData } from './BattleResultView';
import { useProfile } from '@/services/auth';
import { useStudyTimer } from '@/hooks/useStudyTimer';
import type { PkMatchingState } from '@/services/game/pkMatchmaking';

interface GameBattleViewProps {
  state: PkMatchingState;
  onAnswer: (questionId: number, optionId: string) => Promise<void>;
  onExit: (result?: MatchResultData) => void;
  onPlayAgain: () => void;
  onComplete: (result: MatchResultData, durationInSeconds: number) => Promise<void>;
}

export const GameBattleView = ({ state, onAnswer, onExit, onPlayAgain, onComplete }: GameBattleViewProps) => {
  const { data: profile } = useProfile();
  const [now, setNow] = useState(Date.now());
  const [pending, setPending] = useState(false);
  const [localChoice, setLocalChoice] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const pendingRef = useRef(false);
  const completedRoom = useRef<string | null>(null);
  const room = state.room;
  const match = state.match;
  const question = match?.questions[room?.index || 0];
  const myId = profile?.id;
  const ownReward = state.result?.rewards?.find(reward => reward.userId === myId);
  const xpEarned = ownReward?.expAwarded ?? 0;
  const myScore = room?.scores.find(score => score.userId === myId);
  const opponent = match?.players.find(player => player.id !== myId);
  const peerScore = room?.scores.find(score => score.userId !== myId);
  const opponentName = opponent?.name || 'Đối thủ';
  const isMyTurn = room?.turnUserId === myId;
  const { takeSeconds, markActivity } = useStudyTimer(state.phase === 'playing', 'game_battle');
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => { setLocalChoice(null); setPending(false); pendingRef.current = false; }, [room?.index]);
  useEffect(() => {
    if (state.phase !== 'finished' || !state.result || !myScore || !peerScore || completedRoom.current === state.result.roomId) return;
    completedRoom.current = state.result.roomId;
    setIsSaving(true);
    const result: MatchResultData = { myScore: myScore.score, opponentScore: peerScore.score, correctCount: myScore.correctCount, totalQuestions: myScore.totalQuestions, xpEarned, opponentName, isWin: state.result.winnerId === myId, isDraw: state.result.winnerId === null };
    void onComplete(result, takeSeconds()).finally(() => setIsSaving(false));
  }, [state.phase, state.result, myScore, peerScore, myId, opponentName, onComplete, takeSeconds, xpEarned]);

  const handleSelect = async (index: number) => {
    if (!question || !isMyTurn || room?.stage !== 'playing' || pendingRef.current) return;
    pendingRef.current = true; setPending(true); setLocalChoice(index);
    try { await onAnswer(question.id, question.options[index].id); }
    catch (error) { Alert.alert('Chưa nhận được đáp án', error instanceof Error ? error.message : 'Vui lòng thử lại.'); }
    finally { pendingRef.current = false; setPending(false); }
  };
  const handleForfeit = () => Alert.alert('Rời trận PK', 'Rời trận đang đấu sẽ được tính là đầu hàng.', [
    { text: 'Tiếp tục đấu', style: 'cancel' },
    { text: 'Rời trận', style: 'destructive', onPress: () => onExit() },
  ]);

  if (state.phase === 'finished' && state.result && myScore && peerScore) {
    return <BattleResultView photoUrl={profile?.photo?.path} isSaving={isSaving} myScore={myScore.score} opponentScore={peerScore.score}
      opponentName={opponentName} correctCount={myScore.correctCount} totalUserQuestions={myScore.totalQuestions} xpReward={xpEarned}
      outcome={state.result.winnerId === null ? 'draw' : state.result.winnerId === myId ? 'win' : 'loss'} onPlayAgain={onPlayAgain} onExit={onExit} />;
  }
  if (!question || !room || !myScore || !peerScore) {
    return <SafeAreaView onTouchStart={markActivity} onTouchMove={markActivity} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: ms(24), backgroundColor: '#FFFFFF' }}>
      <Text style={{ color: '#475569', fontSize: ms(16), marginBottom: vs(16) }}>Không còn dữ liệu trận đấu.</Text>
      <TouchableOpacity onPress={() => onExit()}><Text style={{ color: '#1F4086', fontSize: ms(16) }}>Về sảnh</Text></TouchableOpacity>
    </SafeAreaView>;
  }
  const answer = state.lastAnswer?.index === room.index ? state.lastAnswer : undefined;
  const selectedOption = answer ? question.options.findIndex(option => option.id === answer.optionId) : localChoice;
  const timeLeft = room.stage === 'playing' ? Math.max(0, Math.ceil((room.deadline - (now + (state.clockOffsetMs || 0))) / 1000)) : 0;
  const cardQuestion = { id: question.id, hanzi: question.hanzi, pinyin: question.pinyin, prompt: question.prompt, options: question.options.map(option => option.text), correctIndex: answer ? question.options.findIndex(option => option.id === answer.correctOptionId) : -1 };
  return (
    <SafeAreaView onTouchStart={markActivity} onTouchMove={markActivity} style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(12), paddingBottom: vs(24), flexGrow: 1, justifyContent: 'space-between' }} showsVerticalScrollIndicator={false}>
        <View style={{ borderRadius: ms(20), overflow: 'hidden', borderWidth: 1.5, borderColor: '#2D2764', backgroundColor: '#1E1A46', marginBottom: vs(20) }}>
          <BattleHeader isMyTurn={isMyTurn} opponentName={opponentName} timeLeft={timeLeft} turnNumber={Math.floor(room.index / 2) + 1} maxTurnsPerPlayer={myScore.totalQuestions} onForfeit={handleForfeit} />
          <BattleQuestionCard question={cardQuestion} isMyTurn={isMyTurn && !pending && room.stage === 'playing'} selectedOption={selectedOption === -1 ? null : selectedOption} onSelectOption={handleSelect} showResult={!!answer} questionNumber={room.index + 1} totalQuestions={match!.questions.length} />
        </View>
        <BattleScoreBar photoUrl={profile?.photo?.path} myScore={myScore.score} opponentScore={peerScore.score} opponentName={opponentName} myCombo={myScore.combo} opponentCombo={peerScore.combo} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default GameBattleView;
