import React from 'react';
import type { SkillTopicSummary } from '@/services/education/types';
import { TopicPickerModal } from './TopicPickerModal';

interface Props {
  topics: SkillTopicSummary[];
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
}

const categoryLabels = {
  textbook: 'Bài theo giáo trình',
  vocabulary: 'Ôn từ vựng (biên soạn)',
  other: 'Bài luyện khác',
};

const topicLabel = (topic: SkillTopicSummary): string => {
  if (topic.sourceKind !== 'vocabulary') return topic.titleVi;
  const unit = topic.titleVi.match(
    /^Bài\s*(\d+):\s*Ôn từ vựng HSK\s*\d+\s*\(biên soạn\)$/i,
  );
  return unit ? `Bài ôn ${Number(unit[1])}` : topic.titleVi;
};

const topicDescription = (topic: SkillTopicSummary): string => {
  const individualCount = topic.questionCount - topic.groupedExerciseCount;
  if (!topic.groupedExerciseCount)
    return `${topic.questionCount} câu luyện tập`;
  const grouped = `${topic.groupedExerciseCount} bài luyện tổng hợp`;
  return individualCount > 0
    ? `${individualCount} câu luyện tập · ${grouped}`
    : `${grouped} · Gồm nhiều mục trong hình`;
};

const topicGroup = (topic: SkillTopicSummary): string =>
  `HSK ${topic.hskLevel} · ${categoryLabels[topic.sourceKind]}`;

export const PracticeTopicPicker = ({
  topics,
  selectedTopic,
  onSelectTopic,
}: Props) => {
  const selected = topics.find((topic) => topic.topicKey === selectedTopic);
  const categoryOrder = { textbook: 0, vocabulary: 1, other: 2 };
  // Keep lesson order within each source group; do not interleave two lesson 1s.
  const groupedTopics = [...topics].sort(
    (left, right) =>
      left.hskLevel - right.hskLevel ||
      categoryOrder[left.sourceKind] - categoryOrder[right.sourceKind],
  );

  return (
    <TopicPickerModal
      title="Chọn bài luyện"
      modalTitle="Chọn bài luyện"
      description="Số câu cho biết số lượt luyện tập trong bài."
      selectedLabel={selected ? topicLabel(selected) : 'Chọn bài luyện'}
      selectedDescription={
        selected
          ? `${topicGroup(selected)} · ${topicDescription(selected)}`
          : undefined
      }
      topics={groupedTopics}
      getTopicLabel={topicLabel}
      getTopicDescription={topicDescription}
      getTopicGroup={topicGroup}
      getTopicKey={(topic) => `${topic.hskLevel}:${topic.topicKey}`}
      isSelected={(topic) => topic.topicKey === selectedTopic}
      onSelectTopic={(topic) => onSelectTopic(topic.topicKey)}
    />
  );
};
