import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { WebView } from 'react-native-webview';
import { ms, hs, vs } from '@/theme';
import { generateWritingWords, WritingPracticeWord } from './writingMockData';

interface Props {
  hskLevel: number;
  topic: string;
  onBack: () => void;
  onSubmit: (result: any) => void;
}

export const WritingPracticeView = ({ hskLevel, topic, onBack, onSubmit }: Props) => {
  const words = React.useMemo(() => generateWritingWords(hskLevel, topic), [hskLevel, topic]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showGridModal, setShowGridModal] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, 'done' | 'skipped'>>({});
  
  const webViewRef = useRef<WebView>(null);
  const currentWord = words[currentIndex];

  const totalCount = words.length;
  const answeredCount = Object.keys(statuses).filter(k => statuses[k] === 'done').length;
  const remainingCount = totalCount - Object.keys(statuses).length;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <script src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"></script>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #FAF9F6; overflow: hidden; }
        #grid-bg { position: absolute; width: 100%; height: 100%; }
        #character-target-div { width: 90vw; height: 90vw; max-width: 400px; max-height: 400px; position: relative; }
      </style>
    </head>
    <body>
      <div id="character-target-div">
        <!-- Background grid -->
        <svg id="grid-bg" viewBox="0 0 1024 1024">
          <line x1="0" y1="0" x2="1024" y2="1024" stroke="#E5E7EB" stroke-width="2" />
          <line x1="1024" y1="0" x2="0" y2="1024" stroke="#E5E7EB" stroke-width="2" />
          <line x1="512" y1="0" x2="512" y2="1024" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="10,10" />
          <line x1="0" y1="512" x2="1024" y2="512" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="10,10" />
          <rect x="2" y="2" width="1020" height="1020" fill="none" stroke="#E5E7EB" stroke-width="4" />
        </svg>
      </div>
      <script>
        var writer;
        function initWriter(char) {
          document.getElementById('character-target-div').innerHTML = document.getElementById('grid-bg').outerHTML;
          writer = HanziWriter.create('character-target-div', char, {
            width: window.innerWidth * 0.9 > 400 ? 400 : window.innerWidth * 0.9,
            height: window.innerWidth * 0.9 > 400 ? 400 : window.innerWidth * 0.9,
            padding: 10,
            showOutline: true,
            strokeAnimationSpeed: 1,
            delayBetweenStrokes: 100,
            showCharacter: false,
            outlineColor: '#E5E7EB',
            strokeColor: '#38BDF8',
            drawingColor: '#1E3A8A'
          });
          writer.quiz({
            onComplete: function(summaryData) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'quizComplete', data: summaryData }));
            }
          });
        }
        
        function animateChar() {
          if(writer) writer.animateCharacter();
        }

        function clearCanvas() {
          if(writer) {
            writer.quiz(); // Restart quiz
          }
        }
        
        // Message listener from React Native
        document.addEventListener("message", function(event) {
          const msg = JSON.parse(event.data);
          if(msg.type === 'init') {
            initWriter(msg.char);
          } else if (msg.type === 'animate') {
            animateChar();
          } else if (msg.type === 'clear') {
            clearCanvas();
          }
        });
        
        // For iOS
        window.addEventListener("message", function(event) {
          const msg = JSON.parse(event.data);
          if(msg.type === 'init') {
            initWriter(msg.char);
          } else if (msg.type === 'animate') {
            animateChar();
          } else if (msg.type === 'clear') {
            clearCanvas();
          }
        });
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    // Inject character when index changes
    if (webViewRef.current) {
      setTimeout(() => {
        webViewRef.current?.postMessage(JSON.stringify({ type: 'init', char: currentWord.character }));
      }, 500); // Wait for webview to load
    }
  }, [currentIndex, currentWord]);

  const handleWebViewMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === 'quizComplete') {
        // User finished writing correctly
        setStatuses(prev => ({ ...prev, [currentWord.id]: 'done' }));
        setTimeout(() => {
          if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            setShowSubmitModal(true);
          }
        }, 1000);
      }
    } catch (e) {
      console.warn("Error parsing webview message", e);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleAnimate = () => {
    webViewRef.current?.postMessage(JSON.stringify({ type: 'animate' }));
  };

  const handleClear = () => {
    webViewRef.current?.postMessage(JSON.stringify({ type: 'clear' }));
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    onSubmit({ totalCount, answeredCount, statuses });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
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
            <Text style={{ fontSize: ms(16), fontWeight: '700', color: '#111827' }} numberOfLines={1}>
              Luyện tập kỹ năng viết
            </Text>
            <Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>
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
            <Text style={{ color: '#FFFFFF', fontSize: ms(13), fontWeight: '700' }}>Nộp bài</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, paddingHorizontal: hs(16), paddingTop: vs(24) }}>
        <View style={{ alignItems: 'center', marginBottom: vs(24) }}>
          <Text style={{ fontSize: ms(24), fontWeight: '600', color: '#111827', marginBottom: vs(4) }}>{currentWord.pinyin}</Text>
          <Text style={{ fontSize: ms(16), color: '#4B5563' }}>{currentWord.meaning}</Text>
        </View>

        <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#FAF9F6', borderRadius: ms(12), overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: htmlContent }}
            style={{ flex: 1, backgroundColor: 'transparent' }}
            scrollEnabled={false}
            bounces={false}
            onMessage={handleWebViewMessage}
            onLoadEnd={() => {
              // Re-init char if webview reloads
              webViewRef.current?.postMessage(JSON.stringify({ type: 'init', char: currentWord.character }));
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
            <Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Xoá nét</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleAnimate} style={{ alignItems: 'center' }}>
            <View style={{ width: ms(48), height: ms(48), borderRadius: ms(24), backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginBottom: vs(8) }}>
              <Svg height="24" viewBox="0 0 24 24" width="24">
                <Path d="M5 3l14 9-14 9V3z" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={{ fontSize: ms(12), color: '#2563EB', fontWeight: '500' }}>Hướng dẫn</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={{ flexDirection: 'row', paddingHorizontal: hs(16), paddingVertical: vs(16), borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}>
        <TouchableOpacity
          onPress={handlePrev}
          disabled={currentIndex === 0}
          style={{ flex: 1, paddingVertical: vs(12), alignItems: 'center', borderRadius: ms(8), borderWidth: 1, borderColor: '#D1D5DB', marginRight: hs(8), opacity: currentIndex === 0 ? 0.5 : 1 }}
        >
          <Text style={{ color: '#4B5563', fontSize: ms(14), fontWeight: '600' }}>Câu trước</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === words.length - 1}
          style={{ flex: 1, paddingVertical: vs(12), alignItems: 'center', borderRadius: ms(8), backgroundColor: '#1E3A8A', marginLeft: hs(8), opacity: currentIndex === words.length - 1 ? 0.5 : 1 }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: ms(14), fontWeight: '600' }}>Câu tiếp</Text>
        </TouchableOpacity>
      </View>

      {/* Grid Modal */}
      <Modal visible={showGridModal} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setShowGridModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>
              <View style={{ width: '90%', backgroundColor: '#FAF9F6', borderRadius: ms(12), padding: ms(16), maxHeight: '80%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: vs(16) }}>
                  <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827' }}>Danh sách từ vựng</Text>
                  <TouchableOpacity onPress={() => setShowGridModal(false)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ position: 'absolute', right: 0, padding: ms(10), zIndex: 10 }}>
                    <Text style={{ fontSize: ms(24), color: '#6B7280', fontWeight: '700', lineHeight: ms(24) }}>×</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(12), marginBottom: vs(24) }}>
                    {words.map((w, idx) => {
                      const isDone = statuses[w.id] === 'done';
                      const isCurrent = idx === currentIndex;
                      
                      let bgColor = '#EBE3D5';
                      let textColor = '#1E3A8A';
                      let borderWidth = 0;
                      let borderColor = 'transparent';

                      if (isCurrent) {
                        bgColor = '#FEF3C7';
                        textColor = '#92400E';
                        borderWidth = 2;
                        borderColor = '#F59E0B';
                      } else if (isDone) {
                        bgColor = '#1E3A8A';
                        textColor = '#FFFFFF';
                      }

                      return (
                        <TouchableOpacity key={w.id} onPress={() => { setShowGridModal(false); setCurrentIndex(idx); }} style={{ width: ms(44), height: ms(44), borderRadius: ms(6), backgroundColor: bgColor, borderWidth, borderColor, justifyContent: 'center', alignItems: 'center' }}>
                          <Text style={{ color: textColor, fontWeight: '700', fontSize: ms(14) }}>{idx + 1}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Submit Modal */}
      <Modal visible={showSubmitModal} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => setShowSubmitModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>
              <View style={{ width: '85%', backgroundColor: '#FFFFFF', borderRadius: ms(16), padding: ms(24), alignItems: 'center' }}>
                <Text style={{ fontSize: ms(20), fontWeight: '800', color: '#111827', marginBottom: vs(12) }}>
                  Xác nhận nộp bài
                </Text>
                <Text style={{ fontSize: ms(14), color: '#4B5563', textAlign: 'center', marginBottom: vs(24), lineHeight: vs(22) }}>
                  Bạn đã luyện viết xong <Text style={{ fontWeight: '700', color: '#111827' }}>{answeredCount}/{totalCount}</Text> từ.{'\n'}
                  Bạn có chắc chắn muốn nộp bài?
                </Text>
                
                <View style={{ flexDirection: 'row', width: '100%', gap: hs(12) }}>
                  <TouchableOpacity onPress={() => setShowSubmitModal(false)} style={{ flex: 1, paddingVertical: vs(12), borderRadius: ms(8), borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' }}>
                    <Text style={{ fontSize: ms(14), fontWeight: '600', color: '#374151' }}>Kiểm tra lại</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleConfirmSubmit} style={{ flex: 1, paddingVertical: vs(12), borderRadius: ms(8), backgroundColor: '#1E3A8A', alignItems: 'center' }}>
                    <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#FFFFFF' }}>Nộp bài</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </SafeAreaView>
  );
};
