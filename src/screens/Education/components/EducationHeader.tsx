import React from 'react';
import { View, Text } from 'react-native';
import { BackButton } from '@/components/atoms';
import { ms, hs, vs } from '@/theme';

interface Props {
  onBack: () => void;
}

export const EducationHeader = ({ onBack }: Props) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: hs(16), paddingTop: vs(8), paddingBottom: vs(16) }}>
      <BackButton onPress={onBack} style={{ marginRight: hs(8), marginLeft: hs(-6) }} />
      <Text style={{ fontSize: ms(22), fontWeight: '800', color: '#111827' }}>
        Học & Luyện tập HSK
      </Text>
    </View>
  );
};
