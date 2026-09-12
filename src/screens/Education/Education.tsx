import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { EducationHeader } from './components/EducationHeader';
import { EducationSegment } from './components/EducationSegment';
import { SkillPracticeView } from './Skills/SkillPracticeView';
import { HskLevelGridView } from './Exams/HskLevelGridView';
import { HskExamListView } from './Exams/HskExamListView';
import { HskExamTestView } from './Exams/HskExamTestView';
import { HskExamResultView } from './Exams/HskExamResultView';
import { ListeningPracticeSetupView } from './Skills/ListeningPracticeSetupView';
import { ListeningPracticeView } from './Skills/ListeningPracticeView';
import { ListeningPracticeResultView } from './Skills/ListeningPracticeResultView';
import type { SkillType, EducationViewMode, ExamResult } from './types';

export function EducationContent({ navigation }: any) {
  const [viewMode, setViewMode] = useState<EducationViewMode>('main');
  const [activeTab, setActiveTab] = useState<number>(1);
  const [selectedSkill, setSelectedSkill] = useState<SkillType>('NGHE');
  const [selectedHsk, setSelectedHsk] = useState<number>(1);
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [examDuration, setExamDuration] = useState<number>(30);
  const [examResults, setExamResults] = useState<Record<string, ExamResult>>({});

  const [practiceHsk, setPracticeHsk] = useState<number>(1);
  const [practiceTopic, setPracticeTopic] = useState<string>('');

  const handleSelectHskLevel = (level: number) => {
    setSelectedHsk(level);
    setViewMode('examList');
  };

  const handleBackFromExamList = () => {
    setViewMode('main');
  };

  const handleStartExamTest = (examId: string, duration: number) => {
    setActiveExamId(examId);
    setExamDuration(duration);
    setViewMode('examTest');
  };

  const handleBackFromTest = () => {
    setActiveExamId(null);
    setViewMode('examList');
  };

  const handleSubmitExam = (result: ExamResult) => {
    setExamResults(prev => ({ ...prev, [result.examId]: result }));
    setViewMode('examResult');
  };

  const handleReviewExam = () => {
    setViewMode('examReview');
  };

  const handleRetakeExam = () => {
    setViewMode('examTest');
  };

  const handleViewResult = (examId: string) => {
    setActiveExamId(examId);
    setViewMode('examResult');
  };

  const handleMainBack = () => {
    if (viewMode === 'skillSetup') {
      setViewMode('main');
      return;
    }
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate?.('Home');
    }
  };

  if (viewMode === 'examResult' && activeExamId) {
    return <HskExamResultView result={examResults[activeExamId]} onBack={handleBackFromTest} onReview={handleReviewExam} onRetake={handleRetakeExam} />;
  }

  if (viewMode === 'examReview' && activeExamId) {
    return <HskExamTestView examId={activeExamId} durationMin={examDuration} onBack={() => setViewMode('examResult')} isReviewMode={true} reviewAnswers={examResults[activeExamId]?.answers} />;
  }

  if (viewMode === 'examTest' && activeExamId) {
    return <HskExamTestView examId={activeExamId} durationMin={examDuration} onBack={handleBackFromTest} onSubmit={handleSubmitExam} />;
  }

  if (viewMode === 'examList') {
    return <HskExamListView hskLevel={selectedHsk} onBack={handleBackFromExamList} onSelectExam={handleStartExamTest} examResults={examResults} onViewResult={handleViewResult} />;
  }

  if (viewMode === 'skillSetup' && selectedSkill === 'NGHE') {
    return (
      <ListeningPracticeSetupView 
        onBack={() => setViewMode('main')} 
        onStartPractice={(hskLevel, topic) => {
          setPracticeHsk(hskLevel);
          setPracticeTopic(topic);
          setViewMode('skillPractice');
        }} 
      />
    );
  }

  if (viewMode === 'skillPractice') {
    return (
      <ListeningPracticeView 
        hskLevel={practiceHsk} 
        topic={practiceTopic} 
        onBack={() => setViewMode('skillSetup')} 
        onSubmit={(result) => {
          setExamResults(prev => ({ ...prev, 'listening_practice': result }));
          setViewMode('skillPracticeResult' as any); // using casting to avoid types.ts update if not strictly needed, or let me update types.ts
        }} 
      />
    );
  }

  if (viewMode === 'skillPracticeResult' as any) {
    const result = examResults['listening_practice'];
    return (
      <ListeningPracticeResultView
        score={result?.score || 0}
        correctCount={result?.correctCount || 0}
        totalCount={result?.totalCount || 0}
        onBackToSetup={() => setViewMode('skillSetup')}
        onRetake={() => setViewMode('skillPractice')}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <EducationHeader onBack={handleMainBack} />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <EducationSegment
          options={['Luyện tập kỹ năng', 'Đề thi HSK']}
          selectedIndex={activeTab}
          onChange={(idx) => setActiveTab(idx)}
        />

        {activeTab === 0 && (
          <SkillPracticeView
            selectedSkill={selectedSkill}
            onSelectSkill={(skill) => {
              setSelectedSkill(skill);
              if (skill === 'NGHE') {
                setViewMode('skillSetup');
              }
            }}
          />
        )}

        {activeTab === 1 && (
          <HskLevelGridView
            onSelectLevel={handleSelectHskLevel}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default EducationContent;
