import React from 'react';
import { View } from 'react-native';
import { SkillBoxCard } from './SkillBoxCard';
import { SKILLS } from '../mockData';
import { SkillType } from '../types';
import { hs } from '@/theme';

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
          title={skill.name}
          isSelected={selectedSkill === skill.id}
          onPress={() => onSelectSkill(skill.id as SkillType)}
        />
      ))}
    </View>
  );
};
