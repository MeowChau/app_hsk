import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/molecules';
import { ms, hs, vs } from '@/theme';
import { HskLevelSelector, TopicPickerModal } from '../components';

import { educationApi } from '@/services/education/api';

interface Props {
  onBack: () => void;
  onStartPractice: (hskLevel: number, topic: string) => void;
}

export const ReadingPracticeSetupView = ({ onBack, onStartPractice }: Props) => {
  const [selectedHsk, setSelectedHsk] = useState<number>(1);
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await educationApi.getTopics(selectedHsk);
        const topicList = res.filter((t: any) => t.readingCount > 0);
        setTopics(topicList);
        if (topicList.length > 0) {
          setSelectedTopic(topicList[0].topicKey);
        } else {
          setSelectedTopic('');
        }
      } catch (err) {
        console.warn('Failed to fetch topics', err);
      }
    };
    fetchTopics();
  }, [selectedHsk]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <ScreenHeader title="Luyện tập kỹ năng đọc" onBack={onBack} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(16), paddingBottom: vs(100) }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(24), marginBottom: vs(32) }}>
          Chọn một bài học, đọc và chọn đáp án đúng
        </Text>

        {/* HSK Level Selection */}
        <HskLevelSelector
          selectedHsk={selectedHsk}
          onSelectHsk={setSelectedHsk}
        />

        {/* Topic Selection */}
        <TopicPickerModal
          selectedLabel={topics.find(t => t.topicKey === selectedTopic)?.titleVi || selectedTopic || 'Chọn chủ đề'}
          topics={topics}
          getTopicLabel={t => `${t.titleVi} (${t.readingCount} từ)`}
          isSelected={t => t.topicKey === selectedTopic}
          onSelectTopic={t => setSelectedTopic(t.topicKey)}
        />
      </ScrollView>

      {/* Footer Button */}
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
          <Svg height="18" viewBox="0 0 24 24" width="18">
            <Path d="M4 7l3 3 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M4 17l3 3 4-4" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M14 8h6" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M14 18h6" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </Svg>
          <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>Bắt đầu luyện đọc</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
