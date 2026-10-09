import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/molecules';
import { ms, hs, vs } from '@/theme';
import { TopicPickerModal } from '../components';
import { vocabularyApi } from '@/services/vocabulary';

interface WritingPracticeTopic {
  id: string;
  title: string;
  wordCount: number;
}

interface Props {
  hskLevel: number;
  onBack: () => void;
  onStart: (topicId: string) => void;
}

export const WritingPracticeSetupView = ({ hskLevel, onBack, onStart }: Props) => {
  const [topics, setTopics] = useState<WritingPracticeTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<WritingPracticeTopic | null>(null);

  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        // Tạm thời lấy danh sách đếm topic từ backend. Backend trả về { 'HSK1-L04': 25 }
        const counts = await vocabularyApi.getTopicCounts();
        
        // Convert sang mảng và lọc những topic thuộc hskLevel hiện tại 
        // (Giả sử topic name bắt đầu bằng `HSK${hskLevel}`)
        const topicList: WritingPracticeTopic[] = Object.keys(counts)
          .filter(topic => topic.startsWith(`HSK${hskLevel}`))
          .map((topic, index) => ({
            id: topic,
            title: topic,
            wordCount: counts[topic],
          }));
          
        setTopics(topicList);
        if (topicList.length > 0) {
          setSelectedTopic(topicList[0]);
        }
      } catch (err) {
        console.warn('Failed to fetch topics', err);
      }
    };
    fetchTopics();
  }, [hskLevel]);

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
