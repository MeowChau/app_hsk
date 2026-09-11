import React from 'react';
import { View, Text, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { ms, hs, vs } from '@/theme';

interface Props {
  onNext: (answer: string) => void;
}

export const SurveyStep2 = ({ onNext }: Props) => {
  const { width } = useWindowDimensions();
  const imageSize = width * 0.8;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: hs(24) }}>
      <Image 
        source={require('@/theme/assets/images/survey_2.png')} 
        style={{ width: imageSize, height: imageSize, resizeMode: 'contain', marginBottom: vs(40) }}
      />
      <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: vs(24) }}>
        Bạn mong muốn đạt trình độ HSK nào?
      </Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: hs(12) }}>
        {['HSK 1', 'HSK 2', 'HSK 3'].map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onNext(option)}
            style={{
              paddingHorizontal: hs(20),
              paddingVertical: vs(10),
              borderRadius: ms(20),
              backgroundColor: '#F3F4F6',
            }}
          >
            <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#374151' }}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
