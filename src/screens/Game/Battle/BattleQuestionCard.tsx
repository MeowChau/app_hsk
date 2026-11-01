// @refresh reset
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { hs, vs, ms, useTheme } from '@/theme';
export interface BattleQuestion {
  id: number;
  hanzi: string;
  pinyin: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

interface BattleQuestionCardProps {
  question: BattleQuestion;
  isMyTurn: boolean;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  showResult?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
}

export const BattleQuestionCard = ({
  question,
  isMyTurn,
  selectedOption,
  onSelectOption,
  showResult = false,
  questionNumber,
  totalQuestions,
}: BattleQuestionCardProps) => {
  const { colors } = useTheme();
  const answersLocked = !isMyTurn || selectedOption !== null || showResult;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderBottomLeftRadius: ms(20),
        borderBottomRightRadius: ms(20),
        paddingHorizontal: hs(16),
        paddingVertical: vs(24),
      }}
    >
      {/* Category / Prompt Label */}
      <Text
        style={{
          color: colors.primary,
          fontSize: ms(12),
          fontWeight: '700',
          letterSpacing: 1.5,
          textAlign: 'center',
          marginBottom: vs(12),
        }}
      >
        — {question.prompt}{' '}
        {questionNumber && totalQuestions
          ? `(${questionNumber}/${totalQuestions})`
          : ''}{' '}
        —
      </Text>

      {/* Chinese Characters (Hanzi) */}
      <Text
        style={{
          color: colors.gray800,
          fontSize: ms(26),
          fontWeight: '900',
          textAlign: 'center',
          marginBottom: vs(6),
          letterSpacing: 1,
        }}
      >
        {question.hanzi}
      </Text>

      {/* Pinyin */}
      <Text
        style={{
          color: colors.text,
          fontSize: ms(14),
          fontWeight: '500',
          textAlign: 'center',
          marginBottom: vs(28),
        }}
      >
        {question.pinyin}
      </Text>

      {/* Each answer wraps independently so long text does not stretch its siblings. */}
      <View style={{ rowGap: vs(12) }}>
        {question.options.map((optionText, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = index === question.correctIndex;

          let bgColor: string = colors.surface;
          let borderColor: string = colors.gray100;
          let textColor: string = colors.gray800;
          let numBg: string = colors.accentLightBlue;
          let numText: string = colors.onAccent;

          if (showResult) {
            if (isCorrect) {
              bgColor = colors.accentGreen;
              borderColor = colors.success;
              textColor = colors.onAccent;
              numBg = colors.success;
              numText = colors.onPrimary;
            } else if (isSelected && !isCorrect) {
              bgColor = colors.accentPink;
              borderColor = colors.red500;
              textColor = colors.onAccent;
              numBg = colors.red500;
              numText = colors.onPrimary;
            }
          } else if (isSelected) {
            bgColor = colors.accentLightBlue;
            borderColor = colors.primary;
            textColor = colors.onAccent;
            numBg = colors.primary;
            numText = colors.onPrimary;
          }

          const resultIcon =
            showResult && isCorrect
              ? 'correct'
              : showResult && isSelected
                ? 'incorrect'
                : isSelected
                  ? 'selected'
                  : null;
          const label = String.fromCharCode(65 + index);
          const resultLabel =
            resultIcon === 'correct'
              ? ', đáp án đúng'
              : resultIcon === 'incorrect'
                ? ', trả lời sai'
                : isSelected
                  ? ', đã chọn'
                  : '';

          return (
            <TouchableOpacity
              key={index}
              accessibilityLabel={`${label}. ${optionText}${resultLabel}`}
              accessibilityRole="radio"
              accessibilityState={{
                checked: isSelected,
                disabled: answersLocked,
              }}
              disabled={answersLocked}
              activeOpacity={0.75}
              onPress={() => onSelectOption(index)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: bgColor,
                borderColor: borderColor,
                borderWidth: 2,
                borderRadius: ms(12),
                minHeight: ms(64),
                width: '100%',
                paddingHorizontal: hs(16),
                paddingVertical: vs(12),
              }}
            >
              {/* The same square badge and card shape are used in every state. */}
              <View
                style={{
                  width: ms(32),
                  height: ms(32),
                  borderRadius: ms(8),
                  backgroundColor: numBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: hs(12),
                  flexShrink: 0,
                }}
              >
                <Text
                  style={{
                    color: numText,
                    fontSize: ms(14),
                    fontWeight: '700',
                  }}
                >
                  {label}
                </Text>
              </View>

              {/* Option Text */}
              <Text
                style={{
                  color: textColor,
                  fontSize: ms(16),
                  lineHeight: ms(22),
                  fontWeight: '500',
                  flex: 1,
                }}
              >
                {optionText}
              </Text>
              <View
                style={{
                  width: ms(20),
                  height: ms(20),
                  marginLeft: hs(12),
                  flexShrink: 0,
                }}
              >
                {resultIcon ? (
                  <Svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <Path
                      d={
                        resultIcon === 'incorrect'
                          ? 'M6 6l12 12M18 6L6 18'
                          : 'M5 12l4 4L19 6'
                      }
                      stroke={textColor}
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : null}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BattleQuestionCard;
