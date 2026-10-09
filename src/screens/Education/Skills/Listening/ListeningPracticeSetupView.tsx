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

export const ListeningPracticeSetupView = ({ onBack, onStartPractice }: Props) => {
  const [selectedHsk, setSelectedHsk] = useState<number>(1);
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await educationApi.getTopics(selectedHsk);
        const topicList = res.filter((t: any) => t.listeningCount > 0);
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
      <ScreenHeader title="Luyện tập kỹ năng nghe" onBack={onBack} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(16), paddingBottom: vs(100) }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(24), marginBottom: vs(32) }}>
          Luyện nghe theo 3 chế độ: Nghe chọn ảnh, nghe chọn từ vựng và nghe chọn True/False (thêm Nghe chọn các hình ảnh theo số lượng và bài nghe cho HSK 3)
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
          getTopicLabel={t => `${t.titleVi} (${t.listeningCount} từ)`}
          isSelected={t => t.topicKey === selectedTopic}
          onSelectTopic={t => setSelectedTopic(t.topicKey)}
        />
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
    </SafeAreaView>
  );
};
