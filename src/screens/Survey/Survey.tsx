import type { RootScreenProps } from '@/navigation/types';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

import { Paths } from '@/navigation/paths';
import { useTheme, hs, vs, ms } from '@/theme';
import { Logo } from '@/components/atoms';
import { isAuthenticated, saveSurveyData, setCompletedSurvey } from '@/services/storage';

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

  const finishSurvey = (finalAnswers: typeof answers) => {
    setCompletedSurvey(true);
    saveSurveyData(finalAnswers);

    if (isAuthenticated()) {
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.MainTabs }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Onboarding }],
      });
    }
  };

  const handleNext = (key: keyof typeof answers, value: string) => {
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      finishSurvey(nextAnswers);
    }
  };

  const handleSkip = () => {
    finishSurvey(answers);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={[layout.flex_1, { paddingVertical: vs(20) }]}>
        {/* Header */}
        <View
          style={[
            layout.row,
            layout.justifyBetween,
            layout.itemsCenter,
            { paddingHorizontal: hs(24), marginBottom: vs(20) },
          ]}
        >
          <Logo variant="primary" />

          <View style={[layout.row, layout.itemsCenter, { columnGap: hs(12) }]}>
            {step > 1 && (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setStep((s) => Math.max(1, s - 1))}
                style={{ paddingHorizontal: hs(8), paddingVertical: vs(4) }}
              >
                <Text style={{ color: '#6B7280', fontSize: ms(14), fontWeight: '600' }}>
                  Quay lại
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSkip}
              style={{ paddingHorizontal: hs(8), paddingVertical: vs(4) }}
            >
              <Text style={{ color: '#0E84F2', fontSize: ms(14), fontWeight: '600' }}>
                Bỏ qua
              </Text>
            </TouchableOpacity>
          </View>
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
