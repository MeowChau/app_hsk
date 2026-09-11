import React from 'react';
import { View } from 'react-native';
import { hs } from '@/theme';

interface SurveyPaginatorProps {
  totalSteps: number;
  currentStep: number;
}

export const SurveyPaginator = ({ totalSteps, currentStep }: SurveyPaginatorProps) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: hs(8) }}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index + 1 === currentStep;
        return (
          <View
            key={index}
            style={{
              width: isActive ? 6 : 6,
              height: isActive ? 6 : 6,
              borderRadius: 3,
              backgroundColor: isActive ? '#0E84F2' : '#D1D5DB',
            }}
          />
        );
      })}
    </View>
  );
};
