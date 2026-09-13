import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/molecules';
import { ms, hs, vs } from '@/theme';
import { TopicPickerModal } from '../components';
import { WRITING_PRACTICE_TOPICS, WritingPracticeTopic } from './writingMockData';

interface Props {
  hskLevel: number;
  onBack: () => void;
  onStart: (topicId: string) => void;
}

export const WritingPracticeSetupView = ({ hskLevel, onBack, onStart }: Props) => {
  const topics = WRITING_PRACTICE_TOPICS[hskLevel] || [];
  const [selectedTopic, setSelectedTopic] = useState<WritingPracticeTopic>(topics[0]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <ScreenHeader title="Luyện tập kỹ năng viết" onBack={onBack} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(16), paddingBottom: vs(100) }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(24), marginBottom: vs(32) }}>
          Chọn một bài học, tập viết từ vựng theo chủ đề
        </Text>

        {/* Topic Selection */}
        <TopicPickerModal
          selectedLabel={selectedTopic ? `${selectedTopic.title} (${selectedTopic.wordCount} từ)` : 'Chọn chủ đề'}
          topics={topics}
          getTopicLabel={t => `${t.title} (${t.wordCount} từ)`}
          getTopicKey={t => t.id}
          isSelected={t => selectedTopic?.id === t.id}
          onSelectTopic={setSelectedTopic}
        />
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
    </SafeAreaView>
  );
};
