import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ms, hs, vs } from '@/theme';

export interface PracticeResultCardProps {
  score: number | string;
  scoreSuffix?: string;
  scoreColor?: string;
  subtitle: string;
  onBackToSetup: () => void;
  onRetake: () => void;
  backButtonText?: string;
  retakeButtonText?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const PracticeResultCard = ({
  score,
  scoreSuffix = '',
  scoreColor = '#1E3A8A',
  subtitle,
  onBackToSetup,
  onRetake,
  backButtonText = 'Đổi học liệu',
  retakeButtonText = 'Làm lại',
  containerStyle,
}: PracticeResultCardProps) => {
  return (
    <View
      style={[
        {
          backgroundColor: '#FAF8F1',
          borderRadius: ms(8),
          paddingVertical: vs(40),
          paddingHorizontal: hs(16),
          alignItems: 'center',
          alignSelf: 'center',
          width: '90%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 3,
          marginBottom: vs(24),
        },
        containerStyle,
      ]}
    >
      <Text
        style={{
          fontSize: ms(48),
          fontWeight: '800',
          color: scoreColor,
          marginBottom: vs(8),
        }}
      >
        {score}
        {scoreSuffix}
      </Text>

      <Text
        style={{
          fontSize: ms(14),
          color: '#4B5563',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: vs(24),
          lineHeight: vs(22),
        }}
      >
        {subtitle}
      </Text>

      <View style={{ flexDirection: 'row', gap: hs(12), width: '100%' }}>
        <TouchableOpacity
          onPress={onBackToSetup}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFFFFF',
            borderRadius: ms(8),
            paddingVertical: vs(12),
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: hs(6),
          }}
        >
          <Svg height="14" viewBox="0 0 24 24" width="14">
            <Path
              d="M20 12H4M10 18l-6-6 6-6"
              fill="none"
              stroke="#4B5563"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={{ color: '#374151', fontSize: ms(14), fontWeight: '700' }}>
            {backButtonText}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRetake}
          style={{
            flex: 1,
            backgroundColor: '#1E3A8A',
            borderRadius: ms(8),
            paddingVertical: vs(12),
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: hs(6),
          }}
        >
          <Svg height="14" viewBox="0 0 24 24" width="14">
            <Path
              d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={{ color: '#FFFFFF', fontSize: ms(14), fontWeight: '700' }}>
            {retakeButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PracticeResultCard;
