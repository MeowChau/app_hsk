// @refresh reset
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/molecules';
import { ms, hs, vs } from '@/theme';
import { HskLevelSelector, TopicPickerModal } from '../components';

import { educationApi } from '@/services/education/api';
import type { SkillPracticeSetSummary } from '@/services/education/types';

const describeListeningSet = (set: SkillPracticeSetSummary): string =>
  `${set.questionCount} câu luyện tập`;

const listeningSetGroup = (set: SkillPracticeSetSummary): string => {
  const labels = { textbook: 'Sách bài tập', vocabulary: 'Ôn từ vựng (biên soạn)', other: 'Bài luyện khác' };
  return `HSK ${set.hskLevel} · ${labels[set.sourceKind]}`;
};

interface Props {
  onBack: () => void;
  onStartPractice: (hskLevel: number, practiceSetId: number) => void;
}

export const ListeningPracticeSetupView = ({ onBack, onStartPractice }: Props) => {
  const [selectedHsk, setSelectedHsk] = useState<number>(1);
  const [practiceSets, setPracticeSets] = useState<SkillPracticeSetSummary[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);
  const selectedSet = practiceSets.find(set =>
    set.id === selectedSetId && set.hskLevel === selectedHsk && set.skill === 'LISTENING');

  React.useEffect(() => {
    let cancelled = false;
    setPracticeSets([]);
    setSelectedSetId(null);
    const fetchPracticeSets = async () => {
      try {
        const sets = await educationApi.getPracticeSetSummaries('LISTENING', selectedHsk);
        if (cancelled) return;
        setPracticeSets(sets);
        setSelectedSetId(sets[0]?.id ?? null);
      } catch (err) {
        console.warn('Failed to fetch listening practice sets', err);
      }
    };
    fetchPracticeSets();
    return () => { cancelled = true; };
  }, [selectedHsk]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <ScreenHeader title="Luyện tập kỹ năng nghe" onBack={onBack} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(16), paddingBottom: vs(100) }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(24), marginBottom: vs(32) }}>
          Chọn bài luyện, nghe audio rồi chọn đáp án, nghe–đọc lại hoặc nghe–viết theo yêu cầu của từng mục.
        </Text>

        {/* HSK Level Selection */}
        <HskLevelSelector
          selectedHsk={selectedHsk}
          onSelectHsk={setSelectedHsk}
        />

        {/* Topic Selection */}
        <TopicPickerModal
          title="Chọn bài luyện nghe"
          modalTitle="Chọn bài luyện nghe"
          description="Chọn một bộ bài luyện và làm các câu hỏi trong bộ đó."
          selectedLabel={selectedSet?.title || 'Chọn bài luyện nghe'}
          selectedDescription={selectedSet ? describeListeningSet(selectedSet) : undefined}
          topics={practiceSets}
          getTopicLabel={set => set.title}
          getTopicDescription={describeListeningSet}
          getTopicGroup={listeningSetGroup}
          getTopicKey={set => set.id}
          isSelected={set => set.id === selectedSetId}
          onSelectTopic={set => setSelectedSetId(set.id)}
          emptyMessage="Chưa có bộ luyện nghe cho cấp HSK này."
        />
      </ScrollView>

      {/* Start Button */}
      <View style={{ position: 'absolute', bottom: vs(32), left: hs(16), right: hs(16) }}>
        <TouchableOpacity
          disabled={!selectedSet?.questionCount}
          onPress={() => selectedSet?.questionCount && onStartPractice(selectedSet.hskLevel, selectedSet.id)}
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
          <Svg height={ms(20)} viewBox="0 0 24 24" width={ms(20)}>
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
