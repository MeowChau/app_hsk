import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ms, hs, vs } from '@/theme';
import { WRITING_PRACTICE_TOPICS, WritingPracticeTopic } from './writingMockData';

interface Props {
  hskLevel: number;
  onBack: () => void;
  onStart: (topicId: string) => void;
}

export const WritingPracticeSetupView = ({ hskLevel, onBack, onStart }: Props) => {
  const topics = WRITING_PRACTICE_TOPICS[hskLevel] || [];
  const [selectedTopic, setSelectedTopic] = useState<WritingPracticeTopic>(topics[0]);
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
          Luyện tập kỹ năng viết
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(16), paddingBottom: vs(100) }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(24), marginBottom: vs(32) }}>
          Chọn một bài học, tập viết từ vựng theo chủ đề
        </Text>

        {/* Topic Selection */}
        <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827', marginBottom: vs(12) }}>
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
          <Text style={{ fontSize: ms(14), color: '#374151', fontWeight: '500' }}>
            {selectedTopic ? `${selectedTopic.title} (${selectedTopic.wordCount} từ)` : 'Chọn chủ đề'}
          </Text>
          <Svg height="16" viewBox="0 0 24 24" width="16">
            <Path d="M7 15l5 5 5-5M7 9l5-5 5 5" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </ScrollView>

      {/* Start Button */}
      <View style={{ position: 'absolute', bottom: vs(32), left: hs(16), right: hs(16) }}>
        <TouchableOpacity
          onPress={() => selectedTopic && onStart(selectedTopic.id)}
          disabled={!selectedTopic}
          style={{
            backgroundColor: selectedTopic ? '#1E3A8A' : '#9CA3AF',
            borderRadius: ms(8),
            paddingVertical: vs(14),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: hs(8),
          }}
        >
          <Svg height="20" viewBox="0 0 24 24" width="20">
            <Path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>
            Bắt đầu luyện viết 
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
                marginTop: vs(160),
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
                <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827', paddingHorizontal: hs(16), paddingBottom: vs(12) }}>
                  Chủ đề
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {topics.map((topic, index) => {
                    const isSelected = selectedTopic?.id === topic.id;
                    return (
                      <TouchableOpacity
                        key={topic.id}
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
                          borderBottomWidth: (!isSelected && index < topics.length - 1) ? 1 : 0,
                          borderBottomColor: '#F3F4F6',
                        }}
                      >
                        <Text style={{ fontSize: ms(14), color: isSelected ? '#FFFFFF' : '#374151', fontWeight: isSelected ? '700' : '500' }}>
                          {topic.title} ({topic.wordCount} từ)
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
