import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { hs, vs, ms } from '@/theme';
import type { BattleQuestion } from './mockQuestions';

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
  return (
    <View
      style={{
        backgroundColor: '#1E1A46',
        borderBottomLeftRadius: ms(20),
        borderBottomRightRadius: ms(20),
        paddingHorizontal: hs(16),
        paddingVertical: vs(24),
      }}
    >
      {/* Category / Prompt Label */}
      <Text
        style={{
          color: '#818CF8',
          fontSize: ms(12),
          fontWeight: '700',
          letterSpacing: 1.5,
          textAlign: 'center',
          marginBottom: vs(12),
        }}
      >
        — {question.prompt}{' '}
        {questionNumber && totalQuestions ? `(${questionNumber}/${totalQuestions})` : ''} —
      </Text>

      {/* Chinese Characters (Hanzi) */}
      <Text
        style={{
          color: '#FFFFFF',
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
          color: '#A5B4FC',
          fontSize: ms(14),
          fontWeight: '500',
          textAlign: 'center',
          marginBottom: vs(28),
        }}
      >
        {question.pinyin}
      </Text>

      {/* Answer Options */}
      <View style={{ rowGap: vs(12) }}>
        {question.options.map((optionText, index) => {
          const isSelected = selectedOption === index;
          const isCorrect = index === question.correctIndex;

          let bgColor = '#181439';
          let borderColor = '#2B255E';
          let textColor = '#E0E7FF';
          let numBg = '#262054';
          let numText = '#A5B4FC';

          if (showResult) {
            if (isCorrect) {
              bgColor = '#064E3B';
              borderColor = '#10B981';
              textColor = '#FFFFFF';
              numBg = '#10B981';
              numText = '#FFFFFF';
            } else if (isSelected && !isCorrect) {
              bgColor = '#7F1D1D';
              borderColor = '#EF4444';
              textColor = '#FFFFFF';
              numBg = '#EF4444';
              numText = '#FFFFFF';
            }
          } else if (isSelected) {
            bgColor = '#312A6E';
            borderColor = '#818CF8';
            textColor = '#FFFFFF';
            numBg = '#6366F1';
            numText = '#FFFFFF';
          }

          return (
            <TouchableOpacity
              key={index}
              disabled={!isMyTurn || selectedOption !== null}
              activeOpacity={0.75}
              onPress={() => onSelectOption(index)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: bgColor,
                borderColor: borderColor,
                borderWidth: 1.5,
                borderRadius: ms(999),
                paddingHorizontal: hs(16),
                paddingVertical: vs(12),
              }}
            >
              {/* Number Circle badge */}
              <View
                style={{
                  width: hs(24),
                  height: vs(24),
                  borderRadius: ms(12),
                  backgroundColor: numBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: hs(12),
                }}
              >
                <Text
                  style={{
                    color: numText,
                    fontSize: ms(12),
                    fontWeight: '800',
                  }}
                >
                  {index + 1}
                </Text>
              </View>

              {/* Option Text */}
              <Text
                style={{
                  color: textColor,
                  fontSize: ms(14),
                  fontWeight: '600',
                  flex: 1,
                }}
              >
                {optionText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BattleQuestionCard;
