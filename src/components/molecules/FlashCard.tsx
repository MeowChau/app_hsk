import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, Polygon, Polyline, Line } from 'react-native-svg';
import { useTheme } from '@/theme';

interface FlashCardProps {
  character: string;
  translation: string;
  currentIndex: number;
  totalCards: number;
  onNext?: () => void;
  onPrev?: () => void;
  onPlayAudio?: () => void;
  onExpand?: () => void;
}

const ExpandIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="15 3 21 3 21 9" />
    <Polyline points="9 21 3 21 3 15" />
    <Line x1="21" y1="3" x2="14" y2="10" />
    <Line x1="3" y1="21" x2="10" y2="14" />
    <Polyline points="21 15 21 21 15 21" />
    <Polyline points="3 9 3 3 9 3" />
    <Line x1="21" y1="21" x2="14" y2="14" />
    <Line x1="3" y1="3" x2="10" y2="10" />
  </Svg>
);

const SpeakerIcon = ({ color }: { color: string }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <Path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </Svg>
);

const ChevronLeftIcon = ({ color }: { color: string }) => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="15 18 9 12 15 6" />
  </Svg>
);

const ChevronRightIcon = ({ color }: { color: string }) => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="9 18 15 12 9 6" />
  </Svg>
);

const FlashCard = ({
  character,
  translation,
  currentIndex,
  totalCards,
  onNext,
  onPrev,
  onPlayAudio,
  onExpand,
}: FlashCardProps) => {
  const { colors, layout, fonts } = useTheme();

  return (
    <View
      style={[
        {
          width: '100%', // Responsive width
          maxWidth: 500, // Max width for tablets
          minHeight: 450,
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.gray200,
          padding: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
      ]}
    >
      {/* Header */}
      <View style={[layout.row, layout.justifyBetween, layout.itemsCenter, { marginBottom: 60 }]}>
        <TouchableOpacity onPress={onExpand} style={{ padding: 8 }}>
          <ExpandIcon color="#33c9fc" />
        </TouchableOpacity>

        <Text style={[fonts.weight_400, { fontSize: 20, color: colors.gray800 }]}>
          {currentIndex}/{totalCards}
        </Text>

        <TouchableOpacity onPress={onPlayAudio} style={{ padding: 8 }}>
          <SpeakerIcon color="#33c9fc" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={[layout.itemsCenter, { marginBottom: 80, flex: 1, justifyContent: 'center' }]}>
        <Text
          style={[
            fonts.bold,
            {
              fontSize: 100,
              color: '#333333',
              marginBottom: 24,
            },
          ]}
        >
          {character}
        </Text>
        <Text
          style={[
            fonts.weight_400,
            {
              fontSize: 32,
              color: '#555555',
            },
          ]}
        >
          {translation}
        </Text>
      </View>

      {/* Footer Buttons */}
      <View style={[layout.row, layout.justifyBetween]}>
        <TouchableOpacity
          onPress={onPrev}
          style={[
            layout.flex_1,
            layout.itemsCenter,
            layout.justifyCenter,
            {
              borderWidth: 1,
              borderColor: colors.gray200,
              borderRadius: 8,
              paddingVertical: 12,
              marginRight: 8,
            },
          ]}
        >
          <ChevronLeftIcon color="#33c9fc" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNext}
          style={[
            layout.flex_1,
            layout.itemsCenter,
            layout.justifyCenter,
            {
              borderWidth: 1,
              borderColor: colors.gray200,
              borderRadius: 8,
              paddingVertical: 12,
              marginLeft: 8,
            },
          ]}
        >
          <ChevronRightIcon color="#33c9fc" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FlashCard;
