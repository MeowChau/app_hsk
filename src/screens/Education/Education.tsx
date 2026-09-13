import React, { useState } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { EducationHeader } from './components/EducationHeader';
import { EducationSegment } from './components/EducationSegment';
import { SkillPracticeView } from './Skills/components/SkillPracticeView';
import { HskLevelGridView } from './Exams/HskLevelGridView';
import { HskExamListView } from './Exams/HskExamListView';
import { HskExamTestView } from './Exams/HskExamTestView';
import { HskExamResultView } from './Exams/HskExamResultView';
import { ListeningPracticeSetupView } from './Skills/Listening/ListeningPracticeSetupView';
import { ListeningPracticeView } from './Skills/Listening/ListeningPracticeView';
import { ListeningPracticeResultView } from './Skills/Listening/ListeningPracticeResultView';
import { SpeakingPracticeSetupView } from './Skills/Speaking/SpeakingPracticeSetupView';
import { SpeakingPracticeView } from './Skills/Speaking/SpeakingPracticeView';
import { SpeakingPracticeResultView } from './Skills/Speaking/SpeakingPracticeResultView';
import { ReadingPracticeSetupView } from './Skills/Reading/ReadingPracticeSetupView';
import { ReadingPracticeView } from './Skills/Reading/ReadingPracticeView';
import { ReadingPracticeResultView } from './Skills/Reading/ReadingPracticeResultView';
import { WritingPracticeSetupView } from './Skills/Writing/WritingPracticeSetupView';
import { WritingPracticeFlashcardView } from './Skills/Writing/WritingPracticeFlashcardView';
import { WritingPracticeView } from './Skills/Writing/WritingPracticeView';
import { WritingPracticeResultView } from './Skills/Writing/WritingPracticeResultView';
import { generateWritingWords } from './Skills/Writing/writingMockData';
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

  if (viewMode === 'skillSetup') {
    if (selectedSkill === 'NOI') {
      return (
        <SpeakingPracticeSetupView
          onBack={() => setViewMode('main')}
          onStartPractice={(topic) => {
            setPracticeTopic(topic);
            setViewMode('skillPractice'); 
          }}
        />
      );
    }

    if (selectedSkill === 'DOC') {
      return (
        <ReadingPracticeSetupView
          onBack={() => setViewMode('main')}
          onStartPractice={(hskLevel, topic) => {
            setPracticeHsk(hskLevel);
            setPracticeTopic(topic);
            setViewMode('skillPractice');
          }}
        />
      );
    }
    
    if (selectedSkill === 'VIET') {
      return (
        <WritingPracticeSetupView
          hskLevel={1}
          onBack={() => setViewMode('main')}
          onStart={(topic) => {
            setPracticeTopic(topic);
            setViewMode('skillFlashcard');
          }}
        />
      );
    }
    
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

  if (viewMode === 'skillFlashcard') {
    const words = generateWritingWords(1, practiceTopic);
    return (
      <WritingPracticeFlashcardView
        words={words}
        onBack={() => setViewMode('skillSetup')}
        onFinishFlashcards={() => setViewMode('skillPractice')}
      />
    );
  }

  if (viewMode === 'skillPractice') {
    if (selectedSkill === 'NOI') {
      return (
        <SpeakingPracticeView
          topic={practiceTopic}
          onBack={() => setViewMode('skillSetup')}
          onSubmit={(result) => {
            setExamResults(prev => ({ ...prev, 'speaking_practice': result }));
            setViewMode('skillPracticeResult');
          }}
        />
      );
    }

    if (selectedSkill === 'DOC') {
      return (
        <ReadingPracticeView
          hskLevel={practiceHsk}
          topic={practiceTopic}
          onBack={() => setViewMode('skillSetup')}
          onSubmit={(result) => {
            setExamResults(prev => ({ ...prev, 'reading_practice': result as any }));
            setViewMode('skillPracticeResult');
          }}
        />
      );
    }

    if (selectedSkill === 'VIET') {
      return (
        <WritingPracticeView
          hskLevel={1}
          topic={practiceTopic}
          onBack={() => setViewMode('skillSetup')}
          onSubmit={(result) => {
            setExamResults(prev => ({ ...prev, 'writing_practice': result as any }));
            setViewMode('skillPracticeResult');
          }}
        />
      );
    }

    return (
      <ListeningPracticeView 
        hskLevel={practiceHsk} 
        topic={practiceTopic} 
        onBack={() => setViewMode('skillSetup')}
        onSubmit={(result) => {
          setExamResults(prev => ({ ...prev, 'listening_practice': result as any }));
          setViewMode('skillPracticeResult');
        }}
      />
    );
  }

  if (viewMode === 'skillPracticeResult') {
    if (selectedSkill === 'NOI') {
      const result = examResults['speaking_practice'];
      return (
        <SpeakingPracticeResultView
          result={result || { score: 0, passedCount: 0, totalCount: 0 }}
          onBackToSetup={() => setViewMode('skillSetup')}
          onRetake={() => setViewMode('skillPractice')}
        />
      );
    }

    if (selectedSkill === 'DOC') {
      const result = examResults['reading_practice'];
      return (
        <ReadingPracticeResultView
          score={result?.score || 0}
          correctCount={result?.correctCount || 0}
          totalCount={result?.totalCount || 0}
          answers={(result as any)?.answers || {}}
          onBackToSetup={() => setViewMode('skillSetup')}
          onRetake={() => setViewMode('skillPractice')}
        />
      );
    }

    if (selectedSkill === 'VIET') {
      const result = examResults['writing_practice'] as any;
      return (
        <WritingPracticeResultView
          hskLevel={1}
          topicId={practiceTopic}
          totalCount={result?.totalCount || 0}
          answeredCount={result?.answeredCount || 0}
          statuses={result?.statuses || {}}
          onBackToSetup={() => setViewMode('skillSetup')}
          onRetake={() => setViewMode('skillPractice')}
        />
      );
    }

    const lisResult = examResults['listening_practice'];
    return (
      <ListeningPracticeResultView
        score={lisResult?.score || 0}
        correctCount={lisResult?.correctCount || 0}
        totalCount={lisResult?.totalCount || 0}
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
              if (skill === 'NGHE' || skill === 'NOI' || skill === 'DOC' || skill === 'VIET') {
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
