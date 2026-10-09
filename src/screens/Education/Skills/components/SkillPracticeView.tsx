import React from 'react';
import { View } from 'react-native';
import { SkillBoxCard } from './SkillBoxCard';
import { SkillType } from '../../types';
import { hs } from '@/theme';

const SKILLS = [
  { id: 'NGHE', name: 'Kỹ năng Nghe' },
  { id: 'NOI', name: 'Kỹ năng Nói' },
  { id: 'DOC', name: 'Kỹ năng Đọc' },
  { id: 'VIET', name: 'Kỹ năng Viết' },
];

interface Props {
  selectedSkill: SkillType;
  onSelectSkill: (skill: SkillType) => void;
}

export const SkillPracticeView = ({ selectedSkill, onSelectSkill }: Props) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: hs(16) }}>
      {SKILLS.map((skill) => (
        <SkillBoxCard
          key={skill.id}
          skillId={skill.id as SkillType}
          title={skill.name}
          isSelected={selectedSkill === skill.id}
          onPress={() => onSelectSkill(skill.id as SkillType)}
        />
      ))}
    </View>
  );
};
