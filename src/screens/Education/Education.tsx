import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView } from 'react-native';
import { EducationHeader } from './components/EducationHeader';
import { EducationSegment } from './components/EducationSegment';
import { SkillPracticeView } from './Skills/components/SkillPracticeView';
import { HskLevelGridView } from './Exams/components/HskLevelGridView';
import { HskExamListView } from './Exams/Hsk/HskExamListView';
import { HskExamTestView } from './Exams/Hsk/HskExamTestView';
import { HskExamResultView } from './Exams/Hsk/HskExamResultView';
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
// import { generateWritingWords } from './Skills/Writing/writingMockData';
import type { SkillType, EducationViewMode, ExamResult } from './types';
import { useCheckIn } from '@/services/analytics';

export function EducationContent({ navigation }: any) {
  const checkInMutation = useCheckIn();
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

  const recordStudy = (durationInSeconds: number, module: string) => {
    if (durationInSeconds <= 0) return;
    checkInMutation.mutate({ durationInSeconds, module }, {
      onError: () => Alert.alert('Chưa lưu được thời gian học', 'Kết quả bài làm vẫn được hiển thị. Vui lòng kiểm tra kết nối.'),
    });
  };

  const handleSubmitExam = (result: ExamResult) => {
    setExamResults(prev => ({ ...prev, [result.examId]: result }));
    recordStudy(result.durationInSeconds ?? 0, 'hsk_exam');
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
          hskLevel={selectedHsk}
          onBack={() => setViewMode('main')}
          onStart={(topic) => {
            setPracticeHsk(selectedHsk);
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
    return (
      <WritingPracticeFlashcardView
        hskLevel={practiceHsk}
        topic={practiceTopic}
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
            checkInMutation.mutate({ durationInSeconds: 180, module: 'practice_speaking' });
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
            recordStudy(result.durationInSeconds, 'practice_reading');
            setViewMode('skillPracticeResult');
          }}
        />
      );
    }

    if (selectedSkill === 'VIET') {
      return (
        <WritingPracticeView
          hskLevel={practiceHsk}
          topic={practiceTopic}
          onBack={() => setViewMode('skillSetup')}
          onSubmit={(result) => {
            setExamResults(prev => ({ ...prev, 'writing_practice': result as any }));
            recordStudy(result.durationInSeconds, 'practice_writing');
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
          recordStudy(result.durationInSeconds, 'practice_listening');
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
          result={(result as any) || { score: 0, passedCount: 0, totalCount: 0 }}
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
          questions={(result as any)?.questions || []}
          onBackToSetup={() => setViewMode('skillSetup')}
          onRetake={() => setViewMode('skillPractice')}
        />
      );
    }

    if (selectedSkill === 'VIET') {
      const result = examResults['writing_practice'] as any;
      return (
        <WritingPracticeResultView
          hskLevel={practiceHsk}
          topicId={practiceTopic}
          totalCount={result?.totalCount || 0}
          answeredCount={result?.answeredCount || 0}
          statuses={result?.statuses || {}}
          words={result?.words || []}
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
