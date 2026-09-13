import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, ScrollView } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { WebView } from 'react-native-webview';
import { ms, hs, vs } from '@/theme';
import { generateWritingWords } from './writingMockData';
import { HANZI_WRITER_JS } from './hanziWriterBundle';
import { PRELOADED_CHAR_DATA } from './writingCharData';

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
  
  const webViewRef = useRef<any>(null);
  const currentWord = words[currentIndex];

  const totalCount = words.length;
  const answeredCount = Object.keys(statuses).filter(k => statuses[k] === 'done').length;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #FAF9F6;
          display: flex;
          justify-content: center;
          align-items: center;
          user-select: none;
          -webkit-user-select: none;
          touch-action: none;
        }
        #canvas-container {
          position: relative;
          width: 100%;
          height: 100%;
          max-width: 400px;
          max-height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #grid-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        #character-target-div {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          touch-action: none;
        }
        #character-target-div svg {
          width: 100% !important;
          height: 100% !important;
          touch-action: none;
        }
      </style>
      <script>
        ${HANZI_WRITER_JS}
      </script>
    </head>
    <body>
      <div id="canvas-container">
        <svg id="grid-bg" viewBox="0 0 1024 1024">
          <line x1="0" y1="0" x2="1024" y2="1024" stroke="#E5E7EB" stroke-width="2" />
          <line x1="1024" y1="0" x2="0" y2="1024" stroke="#E5E7EB" stroke-width="2" />
          <line x1="512" y1="0" x2="512" y2="1024" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="10,10" />
          <line x1="0" y1="512" x2="1024" y2="512" stroke="#E5E7EB" stroke-width="2" stroke-dasharray="10,10" />
          <rect x="2" y="2" width="1020" height="1020" fill="none" stroke="#E5E7EB" stroke-width="4" />
        </svg>
        <div id="character-target-div"></div>
      </div>

      <script>
        var LOCAL_CHAR_DATA = ${JSON.stringify(PRELOADED_CHAR_DATA)};
        var currentChar = "${currentWord.character}";
        var writer = null;

        function notifyRN(data) {
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
          }
        }

        function charDataLoader(char, onComplete, onErr) {
          if (LOCAL_CHAR_DATA && LOCAL_CHAR_DATA[char]) {
            onComplete(LOCAL_CHAR_DATA[char]);
            return;
          }
          var xhr = new XMLHttpRequest();
          xhr.overrideMimeType && xhr.overrideMimeType("application/json");
          xhr.open("GET", "https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/" + encodeURIComponent(char) + ".json", true);
          xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                try {
                  var parsed = JSON.parse(xhr.responseText);
                  LOCAL_CHAR_DATA[char] = parsed;
                  onComplete(parsed);
                } catch(e) {
                  if (onErr) onErr(e);
                }
              } else if (xhr.status !== 0) {
                if (onErr) onErr(new Error("Status: " + xhr.status));
              }
            }
          };
          xhr.onerror = function(err) {
            if (onErr) onErr(err);
          };
          xhr.send(null);
        }

        function initWriter(char) {
          if (!char) return;
          currentChar = char;
          var target = document.getElementById('character-target-div');
          if (!target) return;
          target.innerHTML = '';

          var rect = target.getBoundingClientRect();
          var size = Math.floor(Math.min(rect.width || 300, rect.height || 300));
          if (size <= 0) size = 300;

          try {
            if (typeof HanziWriter === 'undefined') {
              notifyRN({ type: 'error', error: 'Thư viện HanziWriter chưa được nạp.' });
              return;
            }

            writer = HanziWriter.create('character-target-div', char, {
              width: size,
              height: size,
              padding: 16,
              showOutline: true,
              showCharacter: false,
              outlineColor: '#9CA3AF',
              strokeColor: '#38BDF8',
              drawingColor: '#1E3A8A',
              drawingWidth: 20,
              strokeAnimationSpeed: 1,
              delayBetweenStrokes: 150,
              showHintAfterMisses: 1,
              highlightOnComplete: true,
              charDataLoader: charDataLoader,
              onLoadCharDataError: function(err) {
                notifyRN({ type: 'error', error: 'Lỗi tải nét chữ (' + char + '): ' + (err && err.message ? err.message : err) });
              }
            });

            startQuiz();
            notifyRN({ type: 'inited', char: char });
          } catch(e) {
            notifyRN({ type: 'error', error: 'Lỗi khởi tạo vẽ: ' + e.message });
          }
        }

        function startQuiz() {
          if (!writer) return;
          writer.quiz({
            onComplete: function(summaryData) {
              notifyRN({ type: 'quizComplete', data: summaryData });
            }
          });
        }

        function animateChar() {
          if (!writer) return;
          writer.cancelQuiz();
          writer.animateCharacter({
            onComplete: function() {
              setTimeout(function() {
                startQuiz();
              }, 600);
            }
          });
        }

        function clearCanvas() {
          if (!writer) return;
          writer.cancelQuiz();
          startQuiz();
        }

        function changeChar(char) {
          if (char) {
            initWriter(char);
          }
        }

        function handleMessage(event) {
          try {
            var msg = JSON.parse(event.data);
            if (msg.type === 'init' || msg.type === 'changeChar') {
              changeChar(msg.char);
            } else if (msg.type === 'animate') {
              animateChar();
            } else if (msg.type === 'clear') {
              clearCanvas();
            }
          } catch(e) {}
        }

        document.addEventListener("message", handleMessage);
        window.addEventListener("message", handleMessage);

        window.onerror = function(message, source, lineno, colno, error) {
          notifyRN({ type: 'error', error: 'Lỗi script: ' + message + ' tại dòng ' + lineno });
        };

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          setTimeout(function() { initWriter(currentChar); }, 50);
        } else {
          document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() { initWriter(currentChar); }, 50);
          });
        }
      </script>
    </body>
    </html>
  `;

  useEffect(() => {
    // When character changes, tell WebView to draw the new character
    webViewRef.current?.injectJavaScript(`changeChar("${currentWord.character}"); true;`);
  }, [currentIndex, currentWord.character]);

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
      } else if (msg.type === 'error') {
        console.warn('HanziWriter HTML Error:', msg.error);
        Alert.alert('Thông báo', msg.error);
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
    webViewRef.current?.injectJavaScript('animateChar(); true;');
  };

  const handleClear = () => {
    webViewRef.current?.injectJavaScript('clearCanvas(); true;');
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
            <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827' }} numberOfLines={1}>
              Luyện tập kỹ năng viết
            </Text>
            <Text style={{ fontSize: ms(13), color: '#4B5563', fontWeight: '500' }}>
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
      <View style={{ flex: 1, paddingHorizontal: hs(16), paddingTop: vs(24) }}>
        <View style={{ alignItems: 'center', marginBottom: vs(24) }}>
          <Text style={{ fontSize: ms(24), fontWeight: '700', color: '#111827', marginBottom: vs(4) }}>{currentWord.pinyin}</Text>
          <Text style={{ fontSize: ms(16), color: '#4B5563' }}>{currentWord.meaning}</Text>
        </View>

        <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#FAF9F6', borderRadius: ms(12), overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: htmlContent, baseUrl: 'https://cdn.jsdelivr.net' }}
            style={{ flex: 1, backgroundColor: 'transparent' }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            overScrollMode="never"
            bounces={false}
            onMessage={handleWebViewMessage}
            onLoadEnd={() => {
              webViewRef.current?.injectJavaScript(`changeChar("${currentWord.character}"); true;`);
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
            <Text style={{ fontSize: ms(13), color: '#4B5563', fontWeight: '600' }}>Xoá nét</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleAnimate} style={{ alignItems: 'center' }}>
            <View style={{ width: ms(48), height: ms(48), borderRadius: ms(24), backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginBottom: vs(8) }}>
              <Svg height="24" viewBox="0 0 24 24" width="24">
                <Path d="M5 3l14 9-14 9V3z" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <Text style={{ fontSize: ms(13), color: '#2563EB', fontWeight: '600' }}>Hướng dẫn</Text>
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
          <Text style={{ color: '#4B5563', fontSize: ms(15), fontWeight: '700' }}>Câu trước</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleNext}
          disabled={currentIndex === words.length - 1}
          style={{ flex: 1, paddingVertical: vs(12), alignItems: 'center', borderRadius: ms(8), backgroundColor: '#1E3A8A', marginLeft: hs(8), opacity: currentIndex === words.length - 1 ? 0.5 : 1 }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: ms(15), fontWeight: '700' }}>Câu tiếp</Text>
        </TouchableOpacity>
      </View>

      {/* Grid Modal */}
      <Modal visible={showGridModal} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={() => setShowGridModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableWithoutFeedback>
              <View style={{ width: '90%', backgroundColor: '#FAF9F6', borderRadius: ms(12), padding: ms(16), maxHeight: '80%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: vs(16) }}>
                  <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827' }}>Danh sách từ vựng</Text>
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
                          <Text style={{ color: textColor, fontWeight: '700', fontSize: ms(15) }}>{idx + 1}</Text>
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
                <Text style={{ fontSize: ms(15), color: '#4B5563', textAlign: 'center', marginBottom: vs(24), lineHeight: vs(22) }}>
                  Bạn đã luyện viết xong <Text style={{ fontWeight: '700', color: '#111827' }}>{answeredCount}/{totalCount}</Text> từ.{'\n'}
                  Bạn có chắc chắn muốn nộp bài?
                </Text>
                
                <View style={{ flexDirection: 'row', width: '100%', gap: hs(12) }}>
                  <TouchableOpacity onPress={() => setShowSubmitModal(false)} style={{ flex: 1, paddingVertical: vs(12), borderRadius: ms(8), borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' }}>
                    <Text style={{ fontSize: ms(15), fontWeight: '600', color: '#374151' }}>Kiểm tra lại</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleConfirmSubmit} style={{ flex: 1, paddingVertical: vs(12), borderRadius: ms(8), backgroundColor: '#1E3A8A', alignItems: 'center' }}>
                    <Text style={{ fontSize: ms(15), fontWeight: '700', color: '#FFFFFF' }}>Nộp bài</Text>
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
