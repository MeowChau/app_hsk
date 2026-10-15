import { useStudyTimer } from '@/hooks/useStudyTimer';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { WebView } from 'react-native-webview';
import { ms, hs, vs } from '@/theme';
import { SubmitConfirmModal, QuestionGridModal } from '@/screens/Education/components';
import { vocabularyApi } from '@/services/vocabulary';

interface WritingPracticeWord {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
}
import { PRELOADED_CHAR_DATA } from './writingCharData';
import { orderWritingWords } from './flashcardSession';
import { getWritingCharacters, getWritingGridLayout } from './writingCharacters';
import { WRITING_WEBVIEW_SOURCE } from './writingDocument';

interface Props {
  hskLevel: number;
  topic: string;
  wordOrder?: string[];
  onBack: () => void;
  onSubmit: (result: any) => void;
}

export const WritingPracticeView = ({ hskLevel, topic, wordOrder, onBack, onSubmit }: Props) => {
  const [words, setWords] = useState<WritingPracticeWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setWords(orderWritingWords(fetchedWords, wordOrder));
        setCurrentIndex(0);
        setStatuses({});
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
  }, [hskLevel, topic, wordOrder]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, 'done' | 'skipped'>>({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [writingWidth, setWritingWidth] = useState(0);
  
  const webViewRef = useRef<WebView<object>>(null);
  const webViewReady = useRef(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedWord = useRef<string | null>(null);
  const currentWord = words[currentIndex];
  const currentWordRef = useRef<WritingPracticeWord | undefined>(currentWord);
  currentWordRef.current = currentWord;
  const writingCharacters = getWritingCharacters(currentWord?.character ?? '');
  const writingLayout = getWritingGridLayout(writingCharacters.length, writingWidth);

  const studyTimer = useStudyTimer(!isLoading && words.length > 0, 'practice_writing');
  const totalCount = words.length;
  const answeredCount = Object.keys(statuses).filter(k => statuses[k] === 'done').length;

  const gridItems = React.useMemo(() => words.map((w, idx) => ({
    id: w.id,
    index: idx + 1,
    isAnswered: statuses[w.id] === 'done',
    isCurrent: idx === currentIndex,
  })), [words, statuses, currentIndex]);

  const sendCurrentWord = useCallback(() => {
    const word = currentWordRef.current;
    if (!webViewReady.current || !word) return;
    const characters = getWritingCharacters(word.character);
    const data = Object.fromEntries(
      [...new Set(characters)]
        .filter(character => PRELOADED_CHAR_DATA[character])
        .map(character => [character, PRELOADED_CHAR_DATA[character]]),
    );
    const { columns, gap } = getWritingGridLayout(characters.length, 0);
    const payload = { wordId: word.id, word: word.character, characters, data, columns, gap };
    webViewRef.current?.injectJavaScript(
      `window.setWritingWord && window.setWritingWord(${JSON.stringify(payload)});true;`,
    );
  }, []);

  useEffect(() => {
    completedWord.current = null;
    setIsDrawing(false);
    sendCurrentWord();
    return () => {
      if (advanceTimer.current !== null) clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    };
  }, [currentWord?.id, sendCurrentWord]);

  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'ready') {
        webViewReady.current = true;
        sendCurrentWord();
        return;
      }
      const word = currentWordRef.current;
      if (!word || message.wordId !== word.id) return;
      if (message.type === 'quizComplete') {
        const characterCount = getWritingCharacters(word.character).length;
        if (!characterCount || message.characterCount !== characterCount || completedWord.current === word.id) return;
        completedWord.current = word.id;
        studyTimer.markActivity();
        setStatuses(previous => ({ ...previous, [word.id]: 'done' }));
        advanceTimer.current = setTimeout(() => {
          advanceTimer.current = null;
          if (currentWordRef.current?.id !== word.id) return;
          if (currentIndex < words.length - 1) {
            setCurrentIndex(index => index + 1);
          } else {
            setShowSubmitModal(true);
          }
        }, 1000);
      } else if (message.type === 'wordReset') {
        completedWord.current = null;
        if (advanceTimer.current !== null) clearTimeout(advanceTimer.current);
        advanceTimer.current = null;
        setStatuses(previous => {
          if (!previous[word.id]) return previous;
          const next = { ...previous };
          delete next[word.id];
          return next;
        });
      } else if (message.type === 'error') {
        console.warn('HanziWriter error:', message.error);
        Alert.alert('Không thể tải nét chữ', message.error);
      }
    } catch (error) {
      console.warn('Error parsing WebView message', error);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleAnimate = () => {
    webViewRef.current?.injectJavaScript('animateChar(); true;');
  };

  const handleClear = () => {
    webViewRef.current?.injectJavaScript('clearCanvas(); true;');
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    onSubmit({ totalCount, answeredCount, statuses, words, durationInSeconds: studyTimer.takeSeconds() });
  };

  if (isLoading) {
    return (
      <SafeAreaView onTouchStart={studyTimer.markActivity} onTouchMove={studyTimer.markActivity} style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: ms(16), color: '#4B5563' }}>Đang tải dữ liệu...</Text>
      </SafeAreaView>
    );
  }

  if (!currentWord) {
    return (
      <SafeAreaView onTouchStart={studyTimer.markActivity} onTouchMove={studyTimer.markActivity} style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: ms(16), color: '#4B5563', marginBottom: vs(16) }}>Không có từ vựng nào trong chủ đề này.</Text>
        <TouchableOpacity onPress={onBack} style={{ padding: ms(12), backgroundColor: '#1E3A8A', borderRadius: ms(8) }}>
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView onTouchStart={studyTimer.markActivity} onTouchMove={studyTimer.markActivity} style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: hs(16), paddingTop: vs(12), paddingBottom: vs(12), borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <TouchableOpacity onPress={() => {
            Alert.alert('Thoát bài luyện tập', 'Bạn có chắc chắn muốn thoát?', [
              { text: 'Hủy', style: 'cancel' },
              { text: 'Thoát', style: 'destructive', onPress: onBack },
            ]);
          }} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={{ marginRight: hs(8), padding: ms(8), marginLeft: hs(-6) }}>
            <Svg height="24" viewBox="0 0 24 24" width="24">
              <Path d="M20 12H4M10 18l-6-6 6-6" fill="none" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827' }} numberOfLines={1}>
              Luyện tập kỹ năng viết
            </Text>
            <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>
              {answeredCount}/{totalCount} số lượng từ
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(12) }}>
          <TouchableOpacity onPress={() => setShowGridModal(true)}>
            <Svg height="24" viewBox="0 0 24 24" width="24">
              <Rect x="3" y="3" width="7" height="7" rx="1" fill="none" stroke="#4B5563" strokeWidth="2" />
              <Rect x="14" y="3" width="7" height="7" rx="1" fill="none" stroke="#4B5563" strokeWidth="2" />
              <Rect x="3" y="14" width="7" height="7" rx="1" fill="none" stroke="#4B5563" strokeWidth="2" />
              <Rect x="14" y="14" width="7" height="7" rx="1" fill="none" stroke="#4B5563" strokeWidth="2" />
            </Svg>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSubmitModal(true)} style={{ backgroundColor: '#1E3A8A', borderRadius: ms(6), paddingHorizontal: hs(12), paddingVertical: vs(6) }}>
            <Text style={{ color: '#FFFFFF', fontSize: ms(14), fontWeight: '700' }}>Nộp bài</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(24), paddingBottom: vs(24) }}
        scrollEnabled={!isDrawing}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginBottom: vs(24) }}>
          <Text style={{ fontSize: ms(24), fontWeight: '700', color: '#111827', marginBottom: vs(4) }}>{currentWord.pinyin}</Text>
          <Text style={{ fontSize: ms(16), color: '#4B5563' }}>{currentWord.meaning}</Text>
        </View>

        <View
          onLayout={event => setWritingWidth(event.nativeEvent.layout.width)}
          onTouchStart={() => setIsDrawing(true)}
          onTouchEnd={() => setIsDrawing(false)}
          onTouchCancel={() => setIsDrawing(false)}
          style={{
            width: '100%', flexShrink: 0, backgroundColor: '#FFFFFF', overflow: 'hidden',
            ...(writingWidth > 0
              ? { height: writingLayout.height }
              : { aspectRatio: writingLayout.columns / writingLayout.rows }),
          }}
        >
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={WRITING_WEBVIEW_SOURCE}
            style={{ flex: 1, backgroundColor: 'transparent' }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            scrollEnabled={false}
            nestedScrollEnabled
            overScrollMode="never"
            bounces={false}
            onMessage={handleWebViewMessage}
            onLoadStart={() => { webViewReady.current = false; }}
            onLoadEnd={() => {
              webViewReady.current = true;
              sendCurrentWord();
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: hs(24), marginTop: vs(24) }}>
          <TouchableOpacity onPress={handleClear} style={{ alignItems: 'center' }}>
            <View style={{ width: ms(48), height: ms(48), borderRadius: ms(24), backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginBottom: vs(8) }}>
              <Svg height="24" viewBox="0 0 24 24" width="24">
                <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '600' }}>Xoá nét</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleAnimate} style={{ alignItems: 'center' }}>
            <View style={{ width: ms(48), height: ms(48), borderRadius: ms(24), backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginBottom: vs(8) }}>
              <Svg height="24" viewBox="0 0 24 24" width="24">
                <Path d="M5 3l14 9-14 9V3z" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={{ fontSize: ms(14), color: '#2563EB', fontWeight: '600' }}>Hướng dẫn</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{ flexDirection: 'row', paddingHorizontal: hs(16), paddingVertical: vs(16), borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentIndex === 0}
          style={{ flex: 1, paddingVertical: vs(12), alignItems: 'center', borderRadius: ms(8), borderWidth: 1, borderColor: '#D1D5DB', marginRight: hs(8), opacity: currentIndex === 0 ? 0.5 : 1 }}
        >
          <Text style={{ color: '#4B5563', fontSize: ms(16), fontWeight: '700' }}>Câu trước</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === words.length - 1}
          style={{ flex: 1, paddingVertical: vs(12), alignItems: 'center', borderRadius: ms(8), backgroundColor: '#1E3A8A', marginLeft: hs(8), opacity: currentIndex === words.length - 1 ? 0.5 : 1 }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Câu tiếp</Text>
        </TouchableOpacity>
      </View>

      {/* Grid Modal */}
      <QuestionGridModal
        visible={showGridModal}
        onClose={() => setShowGridModal(false)}
        title="Danh sách từ vựng"
        items={gridItems}
        showLegend={false}
        onSelectItem={(_item, idx) => setCurrentIndex(idx)}
      />

      {/* Submit Modal */}
      <SubmitConfirmModal
        visible={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Xác nhận nộp bài"
        customMessage={
          <Text style={{ fontSize: ms(16), color: '#4B5563', textAlign: 'center', lineHeight: vs(22) }}>
            Bạn đã luyện viết xong <Text style={{ fontWeight: '700', color: '#111827' }}>{answeredCount}/{totalCount}</Text> từ.{'\n'}
            Bạn có chắc chắn muốn nộp bài?
          </Text>
        }
      />

    </SafeAreaView>
  );
};
