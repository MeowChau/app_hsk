import React from 'react';
import { TouchableOpacity, Text, ImageBackground, View } from 'react-native';
import { ms, vs, hs } from '@/theme';
import { SkillType } from '../../types';

interface Props {
  title: string;
  skillId?: SkillType;
  isSelected?: boolean;
  onPress: () => void;
}

const SKILL_IMAGES: Record<SkillType, any> = {
  NGHE: require('@/theme/assets/images/skill_listening.png'),
  NOI: require('@/theme/assets/images/skill_speaking.png'),
  DOC: require('@/theme/assets/images/skill_reading.png'),
  VIET: require('@/theme/assets/images/skill_writing.png'),
};

export const SkillBoxCard = ({ title, skillId = 'NGHE', isSelected, onPress }: Props) => {
  const imageSource = SKILL_IMAGES[skillId] || SKILL_IMAGES.NGHE;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        width: '48%',
        height: vs(145),
        borderRadius: ms(16),
        overflow: 'hidden',
        marginBottom: vs(16),
        backgroundColor: '#FFF8F0',
        borderWidth: isSelected ? 2.5 : 1,
        borderColor: isSelected ? '#1E3A8A' : '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <ImageBackground
        source={imageSource}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: vs(10),
        }}
        resizeMode="cover"
      >
        <View
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            borderRadius: ms(20),
            paddingHorizontal: hs(16),
            paddingVertical: vs(5),
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.8)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: ms(15), fontWeight: '800', color: '#1E3A8A', letterSpacing: 0.5 }}>
            {title}
          </Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};
