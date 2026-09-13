import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ScreenHeader } from '@/components/molecules';
import { ms, hs, vs } from '@/theme';
import { WritingPracticeWord } from './writingMockData';

interface Props {
  words: WritingPracticeWord[];
  onBack: () => void;
  onFinishFlashcards: () => void;
}

const { width } = Dimensions.get('window');

export const WritingPracticeFlashcardView = ({ words, onBack, onFinishFlashcards }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  const word = words[currentIndex];

  const handleNext = () => {
    setShowMeaning(false);
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setShowMeaning(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const toggleMeaning = () => {
    setShowMeaning(!showMeaning);
  };

  const isLastCard = currentIndex === words.length - 1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <ScreenHeader
        onBack={onBack}
        rightElement={
          <TouchableOpacity onPress={onFinishFlashcards} style={{ paddingHorizontal: hs(12), paddingVertical: vs(6), backgroundColor: '#E5E7EB', borderRadius: ms(16) }}>
            <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#4B5563' }}>Bỏ qua</Text>
          </TouchableOpacity>
        }
      />

      <View style={{ paddingHorizontal: hs(24), paddingTop: vs(16), flex: 1 }}>
        <Text style={{ fontSize: ms(24), fontWeight: '800', color: '#111827', marginBottom: vs(24) }}>
          Flashcards
        </Text>

        {/* Flashcard */}
        <TouchableOpacity activeOpacity={0.9} onPress={toggleMeaning} style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: ms(16) }}>
            <Svg height="24" viewBox="0 0 24 24" width="24">
              <Path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={{ fontSize: ms(14), color: '#6B7280', fontWeight: '500' }}>
              {currentIndex + 1}/{words.length}
            </Text>
          </View>
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: ms(72), fontWeight: '500', color: '#111827' }}>
              {word.character}
            </Text>
            {showMeaning && (
              <View style={{ alignItems: 'center', marginTop: vs(16) }}>
                <Text style={{ fontSize: ms(20), color: '#4B5563', marginBottom: vs(8) }}>{word.pinyin}</Text>
                <Text style={{ fontSize: ms(18), color: '#111827', fontWeight: '600' }}>{word.meaning}</Text>
              </View>
            )}
            {!showMeaning && (
              <Text style={{ fontSize: ms(16), color: '#9CA3AF', marginTop: vs(24) }}>
                Chạm để xem nghĩa
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Navigation */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(24) }}>
          <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0} style={[styles.navBtn, currentIndex === 0 && { opacity: 0.5 }]}>
            <Text style={{ fontSize: ms(24), color: '#38BDF8', fontWeight: '800' }}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} disabled={isLastCard} style={[styles.navBtn, isLastCard && { opacity: 0.5 }]}>
            <Text style={{ fontSize: ms(24), color: '#38BDF8', fontWeight: '800' }}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} />

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: hs(16), marginBottom: vs(32) }}>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#3B82F6' }]} onPress={handleNext}>
            <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Chưa biết</Text>
          </TouchableOpacity>
          
          {isLastCard ? (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10B981' }]} onPress={onFinishFlashcards}>
              <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Tập viết ngay</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#38BDF8' }]} onPress={handleNext}>
              <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Đã thành thạo</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: width * 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  navBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: vs(12),
    alignItems: 'center',
    marginHorizontal: hs(4),
    borderRadius: ms(4),
  },
  actionBtn: {
    flex: 1,
    paddingVertical: vs(16),
    alignItems: 'center',
    borderRadius: ms(4),
  }
});
