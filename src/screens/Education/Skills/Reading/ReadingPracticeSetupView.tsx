import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/molecules';
import { ms, hs, vs } from '@/theme';
import { HskLevelSelector, TopicPickerModal } from '../components';

import { educationApi } from '@/services/education/api';
import type { SkillPracticeSetSummary } from '@/services/education/types';

const describeReadingSet = (set: SkillPracticeSetSummary): string => {
  const individualCount = set.questionCount - set.groupedExerciseCount;
  if (!set.groupedExerciseCount) return `${set.questionCount} câu luyện tập`;
  const grouped = `${set.groupedExerciseCount} bài luyện tổng hợp`;
  return individualCount > 0
    ? `${individualCount} câu luyện tập · ${grouped}`
    : `${grouped} · Gồm nhiều mục trong hình`;
};

const readingSetGroup = (set: SkillPracticeSetSummary): string => {
  const labels = { textbook: 'Sách bài tập', vocabulary: 'Ôn từ vựng (biên soạn)', other: 'Bài luyện khác' };
  return `HSK ${set.hskLevel} · ${labels[set.sourceKind]}`;
};

interface Props {
  onBack: () => void;
  onStartPractice: (hskLevel: number, practiceSetId: number) => void;
}

export const ReadingPracticeSetupView = ({ onBack, onStartPractice }: Props) => {
  const [selectedHsk, setSelectedHsk] = useState<number>(1);
  const [practiceSets, setPracticeSets] = useState<SkillPracticeSetSummary[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);
  const selectedSet = practiceSets.find(set => set.id === selectedSetId);

  React.useEffect(() => {
    let cancelled = false;
    setPracticeSets([]);
    setSelectedSetId(null);
    const fetchTopics = async () => {
      try {
        const sets = await educationApi.getPracticeSetSummaries('READING', selectedHsk);
        if (cancelled) return;
        setPracticeSets(sets);
        setSelectedSetId(sets[0]?.id ?? null);
      } catch (err) {
        console.warn('Failed to fetch topics', err);
      }
    };
    fetchTopics();
    return () => { cancelled = true; };
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
          title="Chọn bài luyện đọc"
          modalTitle="Chọn bài luyện đọc"
          description="Chọn một bộ bài luyện và làm các câu hỏi trong bộ đó."
          selectedLabel={selectedSet?.title || 'Chọn bài luyện đọc'}
          selectedDescription={selectedSet ? describeReadingSet(selectedSet) : undefined}
          topics={practiceSets}
          getTopicLabel={set => set.title}
          getTopicDescription={describeReadingSet}
          getTopicGroup={readingSetGroup}
          getTopicKey={set => set.id}
          isSelected={set => set.id === selectedSetId}
          onSelectTopic={set => setSelectedSetId(set.id)}
          emptyMessage="Chưa có bộ luyện đọc cho cấp HSK này."
        />
      </ScrollView>

      {/* Footer Button */}
      <View style={{ position: 'absolute', bottom: vs(32), left: hs(16), right: hs(16) }}>
        <TouchableOpacity
          disabled={!selectedSet?.questionCount}
          onPress={() => selectedSet && onStartPractice(selectedSet.hskLevel, selectedSet.id)}
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
