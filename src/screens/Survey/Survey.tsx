import type { RootScreenProps } from '@/navigation/types';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';

import { Paths } from '@/navigation/paths';
import { useTheme, hs, vs, ms } from '@/theme';
import { Logo } from '@/components/atoms';
import { getUser, getSurveyData, isAuthenticated, saveSurveyData, setCompletedSurvey, setPendingSurvey } from '@/services/storage';
import { useUpdateStudyGoals } from '@/services/auth';
import { surveyStudyGoals } from '@/services/auth/survey';

import { SurveyPaginator } from './components/SurveyPaginator';
import { SurveyStep1 } from './components/SurveyStep1';
import { SurveyStep2 } from './components/SurveyStep2';
import { SurveyStep3 } from './components/SurveyStep3';

export default function Survey({ navigation }: RootScreenProps<Paths.Survey>) {
  const { layout } = useTheme();
  const userId = getUser<{ id: number | string }>()?.id;
  const studyGoalsMutation = useUpdateStudyGoals();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState(() => (userId != null ? getSurveyData(userId) : null) ?? {
    currentLevel: '',
    targetLevel: '',
    dailyTime: '',
  });

  useEffect(() => {
    if (!isAuthenticated() || userId == null) {
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Login }],
      });
    }
  }, [navigation, userId]);

  const finishSurvey = (finalAnswers: typeof answers) => {
    if (!isAuthenticated() || userId == null || studyGoalsMutation.isPending) return;

    saveSurveyData(userId, finalAnswers);
    const finish = () => {
      if (getUser<{ id: number | string }>()?.id !== userId) return;
      setPendingSurvey(userId, false);
      setCompletedSurvey(userId);
      navigation.reset({ index: 0, routes: [{ name: Paths.MainTabs }] });
    };
    const goals = surveyStudyGoals(finalAnswers);
    if (!Object.keys(goals).length) { finish(); return; }
    setPendingSurvey(userId, true);
    studyGoalsMutation.mutate(goals, {
      onSuccess: finish,
      onError: (error) => Alert.alert('Chưa lưu được khảo sát', `${error instanceof Error ? error.message : 'Vui lòng thử lại.'} Câu trả lời đã được giữ lại trên thiết bị.`),
    });
  };

  const handleNext = (key: keyof typeof answers, value: string) => {
    if (studyGoalsMutation.isPending) return;
    const nextAnswers = { ...answers, [key]: value };
    setAnswers(nextAnswers);
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      finishSurvey(nextAnswers);
    }
  };

  const handleSkip = () => {
    if (!isAuthenticated() || userId == null || studyGoalsMutation.isPending) return;
    saveSurveyData(userId, answers);
    setPendingSurvey(userId, Object.keys(surveyStudyGoals(answers)).length > 0);
    setCompletedSurvey(userId);
    navigation.reset({ index: 0, routes: [{ name: Paths.MainTabs }] });
  };

  if (!isAuthenticated() || userId == null) return null;

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
                disabled={studyGoalsMutation.isPending}
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
              disabled={studyGoalsMutation.isPending}
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
