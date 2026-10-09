import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/molecules';
import { ms, hs, vs } from '@/theme';
import { TopicPickerModal } from '../components';

import { educationApi } from '@/services/education/api';

interface Props {
  onBack: () => void;
  onStartPractice: (topic: string) => void;
}

export const SpeakingPracticeSetupView = ({ onBack, onStartPractice }: Props) => {
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await educationApi.getTopics();
        const topicList = res.filter((t: any) => t.speakingCount > 0);
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
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <ScreenHeader title="Luyện tập kỹ năng nói" onBack={onBack} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(16), paddingBottom: vs(100) }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: ms(14), color: '#374151', lineHeight: vs(24), marginBottom: vs(32) }}>
          Chọn một bài học, đọc to từng từ hoặc từng câu, hệ thống sẽ nghe và chấm phát âm của bạn theo từng chữ kèm nhận xét
        </Text>

        {/* Topic Selection */}
        <TopicPickerModal
          selectedLabel={topics.find(t => t.topicKey === selectedTopic)?.titleVi || selectedTopic || 'Chọn chủ đề'}
          topics={topics}
          getTopicLabel={t => `${t.titleVi} (${t.speakingCount} từ)`}
          isSelected={t => t.topicKey === selectedTopic}
          onSelectTopic={t => setSelectedTopic(t.topicKey)}
        />
      </ScrollView>

      {/* Start Button */}
      <View style={{ position: 'absolute', bottom: vs(32), left: hs(16), right: hs(16) }}>
        <TouchableOpacity
          onPress={() => onStartPractice(selectedTopic)}
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
            <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={{ color: '#FFFFFF', fontSize: ms(16), fontWeight: '700' }}>
            Bắt đầu luyện nói
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
