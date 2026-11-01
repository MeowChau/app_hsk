// @refresh reset
import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { UserAvatar } from '@/components/atoms';
import { hs, vs, ms, useTheme } from '@/theme';
import type { Colors } from '@/theme/types/colors';

export interface MatchResultData {
  myScore: number;
  opponentScore: number;
  correctCount: number;
  totalQuestions: number;
  xpEarned: number;
  opponentName: string;
  isWin: boolean;
  isDraw?: boolean;
}

interface BattleResultViewProps {
  myScore: number;
  opponentScore: number;
  opponentName?: string;
  correctCount?: number;
  totalUserQuestions?: number;
  xpReward?: number;
  onPlayAgain: () => void;
  onExit: (result?: MatchResultData) => void;
  photoUrl?: string | null;
  isSaving?: boolean;
  outcome?: 'win' | 'draw' | 'loss';
}

export const BattleResultView = ({
  myScore,
  opponentScore,
  opponentName = 'Đối thủ',
  correctCount = 1,
  totalUserQuestions = 4,
  xpReward = 0,
  onPlayAgain,
  onExit,
  photoUrl,
  isSaving = false,
  outcome,
}: BattleResultViewProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isWinner = outcome ? outcome === 'win' : myScore > opponentScore;
  const isDraw = outcome ? outcome === 'draw' : myScore === opponentScore;

  const resultTitle = isWinner ? 'BẠN THẮNG' : isDraw ? 'HÒA TRẬN' : 'BẠN THUA';

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.trophy}>
            <Svg height={ms(42)} viewBox="0 0 24 24" width={ms(42)} fill="none">
              <Path
                d="M6 9V3h12v6c0 3.31-2.69 6-6 6s-6-2.69-6-6z"
                stroke={colors.primary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M6 5H3c0 2.21 1.79 4 4 4M18 5h3c0 2.21-1.79 4-4 4M12 15v4M8 21h8"
                stroke={colors.primary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text accessibilityRole="header" style={styles.title}>
            {resultTitle}
          </Text>

          <View style={styles.scoreCard}>
            <View style={styles.players}>
              <View style={styles.player}>
                <UserAvatar
                  photoUrl={photoUrl}
                  size={ms(54)}
                  backgroundColor={colors.accentLightBlue}
                  style={styles.avatar}
                />
                <Text style={styles.name}>Bạn</Text>
                <Text style={styles.score}>{myScore}</Text>
              </View>
              <View style={styles.vsBadge}>
                <Text style={styles.vsText}>vs</Text>
              </View>
              <View style={styles.player}>
                <View style={[styles.avatar, styles.opponentAvatar]}>
                  <Text style={styles.initial}>
                    {opponentName.trim().charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>
                <Text style={styles.name}>{opponentName}</Text>
                <Text style={styles.score}>{opponentScore}</Text>
              </View>
            </View>

            <View style={styles.stats}>
              <View style={styles.stat}>
                <View style={styles.statHeading}>
                  <Svg
                    height={ms(14)}
                    viewBox="0 0 24 24"
                    width={ms(14)}
                    fill="none"
                  >
                    <Circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke={colors.text}
                      strokeWidth={2}
                    />
                    <Circle
                      cx="12"
                      cy="12"
                      r="5"
                      stroke={colors.text}
                      strokeWidth={2}
                    />
                    <Circle cx="12" cy="12" r="1.5" fill={colors.text} />
                  </Svg>
                  <Text style={styles.statLabel}>CÂU ĐÚNG</Text>
                </View>
                <Text style={styles.statValue}>
                  {correctCount}/{totalUserQuestions}
                </Text>
              </View>
              <View style={styles.stat}>
                <View style={styles.statHeading}>
                  <Svg
                    height={ms(14)}
                    viewBox="0 0 24 24"
                    width={ms(14)}
                    fill="none"
                  >
                    <Circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke={colors.text}
                      strokeWidth={2}
                    />
                    <Path
                      d="M12 7v10M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2 2-2 3M9.5 15h5"
                      stroke={colors.text}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  </Svg>
                  <Text style={styles.statLabel}>EXP NHẬN ĐƯỢC</Text>
                </View>
                <Text style={[styles.statValue, { color: colors.primary }]}>
                  +{xpReward} EXP
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ disabled: isSaving, busy: isSaving }}
            activeOpacity={0.8}
            disabled={isSaving}
            onPress={onPlayAgain}
            style={[
              styles.button,
              styles.primaryButton,
              isSaving && styles.disabled,
            ]}
          >
            <Text style={styles.primaryText}>ĐẤU VÁN NỮA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ disabled: isSaving, busy: isSaving }}
            activeOpacity={0.7}
            disabled={isSaving}
            onPress={() =>
              onExit({
                myScore,
                opponentScore,
                correctCount,
                totalQuestions: totalUserQuestions,
                xpEarned: xpReward,
                opponentName,
                isWin: isWinner,
                isDraw,
              })
            }
            style={[
              styles.button,
              styles.secondaryButton,
              isSaving && styles.disabled,
            ]}
          >
            <Text style={styles.secondaryText}>VỀ SẢNH TRÒ CHƠI</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.surface },
    scroll: {
      paddingHorizontal: hs(16),
      paddingTop: vs(12),
      paddingBottom: vs(24),
      flexGrow: 1,
      justifyContent: 'center',
    },
    card: {
      backgroundColor: colors.accentLightBlue,
      borderRadius: ms(20),
      paddingHorizontal: hs(20),
      paddingTop: vs(28),
      paddingBottom: vs(24),
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    trophy: {
      width: ms(80),
      height: ms(80),
      borderRadius: ms(40),
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: vs(16),
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    title: {
      fontSize: ms(28),
      fontWeight: '800',
      color: colors.primary,
      letterSpacing: 0.5,
      marginBottom: vs(24),
      textAlign: 'center',
    },
    scoreCard: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: ms(16),
      paddingHorizontal: hs(16),
      paddingVertical: vs(20),
      marginBottom: vs(24),
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    players: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: vs(20),
    },
    player: { alignItems: 'center', flex: 1, minWidth: 0 },
    avatar: {
      marginBottom: vs(8),
      borderWidth: 1,
      borderColor: colors.gray100,
    },
    opponentAvatar: {
      width: ms(54),
      height: ms(54),
      borderRadius: ms(27),
      backgroundColor: colors.accentLightBlue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initial: { color: colors.primary, fontSize: ms(24), fontWeight: '700' },
    name: {
      color: colors.text,
      fontSize: ms(13),
      fontWeight: '600',
      marginBottom: vs(4),
      textAlign: 'center',
    },
    score: { color: colors.gray800, fontSize: ms(28), fontWeight: '800' },
    vsBadge: {
      width: ms(30),
      height: ms(30),
      borderRadius: ms(15),
      backgroundColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: hs(8),
    },
    vsText: { color: colors.text, fontSize: ms(11), fontWeight: '700' },
    stats: { flexDirection: 'row', alignItems: 'stretch', gap: hs(10) },
    stat: {
      flex: 1,
      minWidth: 0,
      backgroundColor: colors.secondary,
      borderRadius: ms(12),
      paddingHorizontal: hs(10),
      paddingVertical: vs(12),
    },
    statHeading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: hs(5),
      marginBottom: vs(6),
    },
    statLabel: {
      color: colors.text,
      fontSize: ms(10),
      fontWeight: '700',
      flexShrink: 1,
    },
    statValue: { color: colors.gray800, fontSize: ms(18), fontWeight: '800' },
    button: {
      width: '100%',
      minHeight: ms(48),
      borderRadius: ms(8),
      borderWidth: 1,
      paddingHorizontal: hs(12),
      paddingVertical: vs(12),
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      marginBottom: vs(12),
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderColor: colors.gray100,
    },
    primaryText: {
      color: colors.onPrimary,
      fontSize: ms(16),
      fontWeight: '700',
      textAlign: 'center',
    },
    secondaryText: {
      color: colors.primary,
      fontSize: ms(15),
      fontWeight: '700',
      textAlign: 'center',
    },
    disabled: { opacity: 0.6 },
  });

export default BattleResultView;
