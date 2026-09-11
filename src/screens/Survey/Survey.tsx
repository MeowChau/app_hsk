import type { RootScreenProps } from '@/navigation/types';
import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';

import { Paths } from '@/navigation/paths';
import { useTheme, hs, vs } from '@/theme';
import { Logo } from '@/components/atoms';

import { SurveyPaginator } from './components/SurveyPaginator';
import { SurveyStep1 } from './components/SurveyStep1';
import { SurveyStep2 } from './components/SurveyStep2';
import { SurveyStep3 } from './components/SurveyStep3';

export default function Survey({ navigation }: RootScreenProps<Paths.Survey>) {
  const { layout } = useTheme();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    currentLevel: '',
    targetLevel: '',
    dailyTime: '',
  });

  const handleNext = (key: keyof typeof answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Hoàn thành survey -> Điều hướng vào màn hình chính
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.MainTabs }],
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={[layout.flex_1, { paddingVertical: vs(20) }]}>
        {/* Header */}
        <View style={{ paddingHorizontal: hs(24), marginBottom: vs(20) }}>
          <Logo variant="primary" />
        </View>

        {/* Content Area */}
        <View style={layout.flex_1}>
          {step === 1 && <SurveyStep1 onNext={(val) => handleNext('currentLevel', val)} />}
          {step === 2 && <SurveyStep2 onNext={(val) => handleNext('targetLevel', val)} />}
          {step === 3 && <SurveyStep3 onNext={(val) => handleNext('dailyTime', val)} />}
        </View>

        {/* Paginator */}
        <View style={{ paddingBottom: vs(24) }}>
          <SurveyPaginator currentStep={step} totalSteps={3} />
        </View>
      </View>
    </SafeAreaView>
  );
}
