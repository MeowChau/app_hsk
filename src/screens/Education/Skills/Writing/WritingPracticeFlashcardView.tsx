import React, { useReducer, useRef, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ScreenHeader } from '@/components/molecules';
import { ms, hs, vs } from '@/theme';
import { vocabularyApi } from '@/services/vocabulary';
import { useStudyTimer } from '@/hooks/useStudyTimer';
import {
  createFlashcardSession,
  flashcardSessionReducer,
  getFlashcardWordIds,
  getWritingWordOrder,
} from './flashcardSession';
import type { FlashcardRating } from './flashcardSession';

interface WritingPracticeWord {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
}

interface Props {
  hskLevel: number;
  topic: string;
  onBack: () => void;
  onFinishFlashcards: (wordOrder: string[]) => void;
}

const { width } = Dimensions.get('window');

export const WritingPracticeFlashcardView = ({ hskLevel, topic, onBack, onFinishFlashcards }: Props) => {
  const [words, setWords] = useState<WritingPracticeWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [session, dispatch] = useReducer(flashcardSessionReducer, [], createFlashcardSession);
  const [showMeaning, setShowMeaning] = useState(false);
  const finished = useRef(false);

  React.useEffect(() => {
    let cancelled = false;
    const fetchWords = async () => {
      try {
        setIsLoading(true);
        const vocabularies = await vocabularyApi.getAllForPractice({ hskLevel, topic });
        if (cancelled) return;
        const fetchedWords: WritingPracticeWord[] = vocabularies.map(v => ({
          id: v.id.toString(),
          character: v.hanzi,
          pinyin: v.pinyin,
          meaning: v.meaning,
        }));
        setWords(fetchedWords);
        dispatch({ type: 'reset', wordIds: fetchedWords.map(word => word.id) });
        finished.current = false;
        setShowMeaning(false);
      } catch (err) {
        if (!cancelled) {
          setWords([]);
          Alert.alert('Không thể tải từ vựng', 'Vui lòng kiểm tra kết nối và mở lại bài luyện.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchWords();
    return () => { cancelled = true; };
  }, [hskLevel, topic]);

  const cardIds = getFlashcardWordIds(session);
  const word = words.find(item => item.id === cardIds[session.index]);
  const isComplete = session.phase === 'complete';
  const studyTimer = useStudyTimer(!isLoading && words.length > 0 && !isComplete, 'vocabulary_review');
  const finishFlashcards = () => {
    if (finished.current) return;
    finished.current = true;
    studyTimer.takeSeconds();
    onFinishFlashcards(getWritingWordOrder(session));
  };
  const rateWord = (rating: FlashcardRating) => {
    if (!word || !showMeaning) return;
    dispatch({ type: 'rate', wordId: word.id, phase: session.phase, rating });
    setShowMeaning(false);
  };
  const handleNext = () => {
    setShowMeaning(false);
    dispatch({ type: 'move', direction: 1 });
  };

  const handlePrev = () => {
    setShowMeaning(false);
    dispatch({ type: 'move', direction: -1 });
  };

  const toggleMeaning = () => {
    setShowMeaning(!showMeaning);
  };

  const isLastCard = session.index === cardIds.length - 1;
  const meaningVisible = showMeaning || isComplete;

  if (isLoading) {
    return (
      <SafeAreaView onTouchStart={studyTimer.markActivity} onTouchMove={studyTimer.markActivity} style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: ms(16), color: '#4B5563' }}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  if (!word) {
    return (
      <SafeAreaView onTouchStart={studyTimer.markActivity} onTouchMove={studyTimer.markActivity} style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: ms(16), color: '#4B5563', marginBottom: vs(16) }}>Không có từ vựng nào.</Text>
        <TouchableOpacity onPress={onBack} style={{ padding: ms(12), backgroundColor: '#1E3A8A', borderRadius: ms(8) }}>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView onTouchStart={studyTimer.markActivity} onTouchMove={studyTimer.markActivity} style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <ScreenHeader
        onBack={onBack}
        rightElement={
          <TouchableOpacity onPress={finishFlashcards} style={{ paddingHorizontal: hs(12), paddingVertical: vs(6), backgroundColor: '#E5E7EB', borderRadius: ms(16) }}>
            <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#4B5563' }}>Bỏ qua</Text>
          </TouchableOpacity>
        }
      />

      <View style={{ paddingHorizontal: hs(24), paddingTop: vs(16), flex: 1 }}>
        <Text style={{ fontSize: ms(24), fontWeight: '800', color: '#111827', marginBottom: vs(24) }}>
          {isComplete ? 'Đã ôn xong bài' : session.phase === 'review' ? 'Ôn lại từ chưa nhớ' : 'Ôn từ trước khi viết'}
        </Text>

        {/* Flashcard */}
        <TouchableOpacity activeOpacity={0.9} onPress={toggleMeaning} disabled={isComplete} style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding: ms(16) }}>
            <Svg height="24" viewBox="0 0 24 24" width="24">
              <Path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={{ fontSize: ms(14), color: '#6B7280', fontWeight: '500' }}>
              {isComplete ? `${session.wordIds.length}/${session.wordIds.length}` : `${session.index + 1}/${cardIds.length}`}
            </Text>
          </View>
          
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: ms(72), fontWeight: '500', color: '#111827' }}>
              {word.character}
            </Text>
            {meaningVisible && (
              <View style={{ alignItems: 'center', marginTop: vs(16) }}>
                <Text style={{ fontSize: ms(20), color: '#4B5563', marginBottom: vs(8) }}>{word.pinyin}</Text>
                <Text style={{ fontSize: ms(18), color: '#111827', fontWeight: '600' }}>{word.meaning}</Text>
              </View>
            )}
            {!meaningVisible && (
              <Text style={{ fontSize: ms(16), color: '#9CA3AF', marginTop: vs(24) }}>
                Chạm để xem nghĩa
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Navigation */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(24) }}>
          <TouchableOpacity onPress={handlePrev} disabled={session.index === 0 || isComplete} style={[styles.navBtn, (session.index === 0 || isComplete) && { opacity: 0.5 }]}>
            <Text style={{ fontSize: ms(24), color: '#38BDF8', fontWeight: '800' }}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} disabled={isLastCard || isComplete} style={[styles.navBtn, (isLastCard || isComplete) && { opacity: 0.5 }]}>
            <Text style={{ fontSize: ms(24), color: '#38BDF8', fontWeight: '800' }}>{'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} />

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: hs(16), marginBottom: vs(32) }}>
          {isComplete ? (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#3B82F6' }]} onPress={() => {
              dispatch({ type: 'reset', wordIds: session.wordIds });
              setShowMeaning(false);
            }}>
              <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Ôn lại</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled={!showMeaning} style={[styles.actionBtn, { backgroundColor: '#3B82F6', opacity: showMeaning ? 1 : 0.5 }]} onPress={() => rateWord('unknown')}>
              <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Chưa nhớ</Text>
            </TouchableOpacity>
          )}

          {isComplete ? (
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10B981' }]} onPress={finishFlashcards}>
              <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Tập viết ngay</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled={!showMeaning} style={[styles.actionBtn, { backgroundColor: '#38BDF8', opacity: showMeaning ? 1 : 0.5 }]} onPress={() => rateWord('remembered')}>
              <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Đã nhớ</Text>
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
