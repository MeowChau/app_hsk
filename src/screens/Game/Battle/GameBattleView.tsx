import React, { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, Alert, ScrollView } from 'react-native';
import { hs, vs, ms } from '@/theme';
import { BattleHeader } from './BattleHeader';
import { BattleQuestionCard } from './BattleQuestionCard';
import { BattleScoreBar } from './BattleScoreBar';
import { BattleResultView, type MatchResultData } from './BattleResultView';
import { MOCK_QUESTIONS } from './mockQuestions';

interface GameBattleViewProps {
  onExit: (result?: MatchResultData) => void;
  opponentName?: string;
}

const QUESTIONS_PER_PLAYER = 4;
const TOTAL_MATCH_QUESTIONS = QUESTIONS_PER_PLAYER * 2;

export const GameBattleView = ({
  onExit,
  opponentName = 'Hạ Ngân',
}: GameBattleViewProps) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [myCombo, setMyCombo] = useState(0);
  const [opponentCombo, setOpponentCombo] = useState(0);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [myCorrectCount, setMyCorrectCount] = useState(0);

  const currentQuestion = MOCK_QUESTIONS[questionIndex % MOCK_QUESTIONS.length];
  // Số thứ tự câu hỏi của người chơi hiện tại (1 -> 4)
  const currentTurnForPlayer = Math.floor(questionIndex / 2) + 1;

  const timeLeftRef = useRef(timeLeft);
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  // Timer đếm ngược 15s mỗi câu
  useEffect(() => {
    if (showResult || isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Hết giờ
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isMyTurn, questionIndex, showResult, isGameOver]);

  // Giả lập đối thủ suy nghĩ và trả lời với thời gian random từ 2.0s đến 4.5s
  useEffect(() => {
    if (!isMyTurn && !showResult && !isGameOver) {
      // Random thời gian đối thủ trả lời từ 2000ms đến 4500ms
      const randomDelayMs = Math.floor(Math.random() * 2500) + 2000;

      const oppThinkingTimer = setTimeout(() => {
        // Đối thủ chọn đáp án đúng
        const oppChoice = currentQuestion.correctIndex;
        setSelectedOption(oppChoice);
        setShowResult(true);

        // Cơ chế tính điểm theo tốc độ: càng trả lời sớm điểm càng cao
        const currentRemainingTime = Math.max(1, timeLeftRef.current);
        const oppSpeedBonus = currentRemainingTime * 10;

        setOpponentCombo((prevCombo) => {
          const oppStreakBonus = prevCombo * 15;
          const oppEarned = 100 + oppSpeedBonus + oppStreakBonus;
          setOpponentScore((prevScore) => prevScore + oppEarned);
          return prevCombo + 1;
        });

        // Chuyển sang câu tiếp theo hoặc kết thúc sau 1.5s
        setTimeout(() => {
          nextTurn();
        }, 1500);
      }, randomDelayMs);

      return () => clearTimeout(oppThinkingTimer);
    }
  }, [isMyTurn, questionIndex, showResult, isGameOver]);

  const handleTimeOut = () => {
    setShowResult(true);
    if (isMyTurn) {
      setMyCombo(0);
    } else {
      setOpponentCombo(0);
    }
    setTimeout(() => {
      nextTurn();
    }, 1500);
  };

  const handleSelectOption = (index: number) => {
    if (!isMyTurn || selectedOption !== null || isGameOver) return;

    setSelectedOption(index);
    setShowResult(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      // Cơ chế tính điểm: 100 điểm gốc + (giây còn lại * 10 điểm tốc độ) + thưởng chuỗi combo
      const speedBonus = timeLeft * 10;
      const streakBonus = myCombo * 15;
      const pointsEarned = 100 + speedBonus + streakBonus;

      setMyCorrectCount((prev) => prev + 1);
      setMyScore((prev) => prev + pointsEarned);
      setMyCombo((prev) => prev + 1);
    } else {
      setMyCombo(0);
    }

    // Sau 1.5s chuyển lượt hoặc kết thúc
    setTimeout(() => {
      nextTurn();
    }, 1500);
  };

  const nextTurn = () => {
    // Khi cả 2 người chơi đã hoàn thành đủ 4 câu hỏi mỗi người (tổng 8 câu) thì kết thúc
    if (questionIndex + 1 >= TOTAL_MATCH_QUESTIONS) {
      setIsGameOver(true);
      return;
    }
    setSelectedOption(null);
    setShowResult(false);
    setTimeLeft(15);
    setIsMyTurn((prev) => !prev);
    setQuestionIndex((prev) => prev + 1);
  };

  const handlePlayAgain = () => {
    setQuestionIndex(0);
    setIsMyTurn(true);
    setTimeLeft(15);
    setMyScore(0);
    setOpponentScore(0);
    setMyCombo(0);
    setOpponentCombo(0);
    setMyCorrectCount(0);
    setSelectedOption(null);
    setShowResult(false);
    setIsGameOver(false);
  };

  const handleForfeit = () => {
    Alert.alert(
      'Rời trận đấu',
      'Bạn có chắc chắn muốn đầu hàng và rời khỏi trận đấu PK này?',
      [
        { text: 'Tiếp tục đấu', style: 'cancel' },
        { text: 'Rời trận', style: 'destructive', onPress: () => onExit() },
      ]
    );
  };

  // Khi hết số câu hỏi của cả 2 bên, hiển thị màn hình Tổng kết kết quả trận đấu
  if (isGameOver) {
    const coinReward = myScore > opponentScore ? 20 : 10;
    return (
      <BattleResultView
        myScore={myScore}
        opponentScore={opponentScore}
        opponentName={opponentName}
        correctCount={myCorrectCount}
        totalUserQuestions={QUESTIONS_PER_PLAYER}
        coinReward={coinReward}
        onPlayAgain={handlePlayAgain}
        onExit={onExit}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: hs(16),
          paddingTop: vs(12),
          paddingBottom: vs(24),
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= KHỐI CÂU HỎI TRÊN ================= */}
        <View
          style={{
            borderRadius: ms(20),
            overflow: 'hidden',
            borderWidth: 1.5,
            borderColor: '#2D2764',
            backgroundColor: '#1E1A46',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
            marginBottom: vs(20),
          }}
        >
          {/* Header đếm ngược & lượt chơi */}
          <BattleHeader
            isMyTurn={isMyTurn}
            opponentName={opponentName}
            timeLeft={timeLeft}
            turnNumber={currentTurnForPlayer}
            maxTurnsPerPlayer={QUESTIONS_PER_PLAYER}
            onForfeit={handleForfeit}
          />

          {/* Nội dung câu hỏi và 4 đáp án */}
          <BattleQuestionCard
            question={currentQuestion}
            isMyTurn={isMyTurn}
            selectedOption={selectedOption}
            onSelectOption={handleSelectOption}
            showResult={showResult}
            questionNumber={questionIndex + 1}
            totalQuestions={TOTAL_MATCH_QUESTIONS}
          />
        </View>

        {/* ================= THANH TỈ SỐ ĐỐI ĐẦU DƯỚI ================= */}
        <BattleScoreBar
          myScore={myScore}
          opponentScore={opponentScore}
          opponentName={opponentName}
          myCombo={myCombo}
          opponentCombo={opponentCombo}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default GameBattleView;
