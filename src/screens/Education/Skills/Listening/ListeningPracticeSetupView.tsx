import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms, hs, vs } from '@/theme';

interface Props {
  onBack: () => void;
  onStartPractice: (hskLevel: number, topic: string) => void;
}

const TOPICS = [
  'Đặt câu hỏi và đo lường từ ngữ (28 từ)',
  'Món ăn (26 từ)',
  'Gia đình (18 từ)',
  'Chữ số (16 từ)',
  'Nghiên cứu (22 từ)',
  'Trong lớp (23 từ)',
  'Các tòa nhà (21 từ)',
  'Vận chuyển (20 từ)',
  'Sự chuyển động (20 từ)',
  'Đại từ (35 từ)',
];

export const ListeningPracticeSetupView = ({ onBack, onStartPractice }: Props) => {
  const [selectedHsk, setSelectedHsk] = useState<number>(1);
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS[0]);
  const [showTopicModal, setShowTopicModal] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: hs(16), paddingVertical: vs(12) }}>
        <TouchableOpacity onPress={onBack} style={{ padding: ms(4), marginRight: hs(12) }}>
          <Svg height="24" viewBox="0 0 24 24" width="24">
            <Path d="M20 12H4M10 18l-6-6 6-6" fill="none" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        <Text style={{ fontSize: ms(20), fontWeight: '800', color: '#111827' }}>
          Luyện tập kỹ năng nghe
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(16), paddingBottom: vs(100) }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(24), marginBottom: vs(32) }}>
          Luyện nghe theo 3 chế độ: Nghe chọn ảnh, nghe chọn từ vựng và nghe chọn True/False (thêm Nghe chọn các hình ảnh theo số lượng và bài nghe cho HSK 3)
        </Text>

        {/* HSK Level Selection */}
        <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827', marginBottom: vs(12) }}>
          THEO KỸ NĂNG HSK
        </Text>
        <View style={{ flexDirection: 'row', gap: hs(12), marginBottom: vs(32) }}>
          {[1, 2, 3].map(level => {
            const isSelected = selectedHsk === level;
            return (
              <TouchableOpacity
                key={level}
                onPress={() => setSelectedHsk(level)}
                style={{
                  paddingVertical: vs(8),
                  paddingHorizontal: hs(24),
                  borderRadius: ms(20),
                  backgroundColor: isSelected ? '#1E3A8A' : '#FFFFFF',
                  borderWidth: 1,
                  borderColor: isSelected ? '#1E3A8A' : '#E5E7EB',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <Text style={{ fontSize: ms(14), fontWeight: '700', color: isSelected ? '#FFFFFF' : '#111827' }}>
                  HSK {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Topic Selection */}
        <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#111827', marginBottom: vs(12) }}>
          Chọn chủ đề / bài học
        </Text>
        <TouchableOpacity
          onPress={() => setShowTopicModal(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            backgroundColor: '#FAF9F6', 
            borderRadius: ms(8),
            paddingVertical: vs(12),
            paddingHorizontal: hs(16),
          }}
        >
          <Text style={{ fontSize: ms(14), color: '#374151', fontWeight: '500' }}>{selectedTopic}</Text>
          <Svg height="16" viewBox="0 0 24 24" width="16">
            <Path d="M7 15l5 5 5-5M7 9l5-5 5 5" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </ScrollView>

      {/* Start Button */}
      <View style={{ position: 'absolute', bottom: vs(32), left: hs(16), right: hs(16) }}>
        <TouchableOpacity
          onPress={() => onStartPractice(selectedHsk, selectedTopic)}
          style={{
            backgroundColor: '#1E3A8A',
            borderRadius: ms(8),
            paddingVertical: vs(14),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: hs(8),
          }}
        >
          <Svg height="20" viewBox="0 0 24 24" width="20">
            <Path d="M3 18v-6a9 9 0 0 1 18 0v6" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" fill="#FFFFFF" />
          </Svg>
          <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>
            Bắt đầu luyện nghe
          </Text>
        </TouchableOpacity>
      </View>

      {/* Topic Modal */}
      <Modal visible={showTopicModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowTopicModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <TouchableWithoutFeedback>
              <View style={{ 
                marginHorizontal: hs(16), 
                marginTop: vs(160), // Match exactly with Speaking for balanced screen layout
                maxHeight: '60%', 
                backgroundColor: '#FFFFFF', 
                borderRadius: ms(8), 
                paddingVertical: vs(12), 
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
              }}>
                <Text style={{ fontSize: ms(15), fontWeight: '800', color: '#111827', paddingHorizontal: hs(16), paddingBottom: vs(12) }}>
                  Chủ đề
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {TOPICS.map((topic, index) => {
                    const isSelected = selectedTopic === topic;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setSelectedTopic(topic);
                          setShowTopicModal(false);
                        }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: vs(12),
                          paddingHorizontal: hs(8),
                          backgroundColor: isSelected ? '#C53030' : 'transparent',
                          marginHorizontal: hs(8),
                          borderRadius: ms(6),
                          borderBottomWidth: (!isSelected && index < TOPICS.length - 1) ? 1 : 0,
                          borderBottomColor: '#F3F4F6',
                        }}
                      >
                        <Text style={{ fontSize: ms(14), color: isSelected ? '#FFFFFF' : '#374151', fontWeight: isSelected ? '700' : '500' }}>
                          {topic}
                        </Text>
                        {isSelected && (
                          <Svg height="16" viewBox="0 0 24 24" width="16">
                            <Path d="M20 6L9 17l-5-5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                          </Svg>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                {/* Scroll hint icon at bottom */}
                <View style={{ alignItems: 'center', paddingTop: vs(8), paddingBottom: vs(4) }}>
                  <Svg height="16" viewBox="0 0 24 24" width="16">
                    <Path d="M6 9l6 6 6-6" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};
