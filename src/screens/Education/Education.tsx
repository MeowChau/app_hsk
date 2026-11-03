// @refresh reset
import React, { useEffect, useRef, useState } from 'react';
import type { LearnScreenParams } from '@/navigation/types';
import { useScrollToTop } from '@react-navigation/native';
import { useScreenBackHandler } from '@/navigation/useScreenBackHandler';
import { SafeAreaView, ScrollView } from 'react-native';
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
import type { SkillType, EducationViewMode, ExamResult, SpeakingPracticeResult } from './types';

export function EducationContent({ route }: any) {
  const [viewMode, setViewMode] = useState<EducationViewMode>('main');
  const [activeTab, setActiveTab] = useState<number>(1);
  const [selectedSkill, setSelectedSkill] = useState<SkillType>('NGHE');
  const [selectedHsk, setSelectedHsk] = useState<number>(1);
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [examDuration, setExamDuration] = useState<number>(30);
  const [examResults, setExamResults] = useState<Record<string, ExamResult>>({});
  const [speakingResult, setSpeakingResult] = useState<SpeakingPracticeResult | null>(null);

  const [practiceHsk, setPracticeHsk] = useState<number>(1);
  const [practiceTopic, setPracticeTopic] = useState<string>('');
  const [readingPracticeSetId, setReadingPracticeSetId] = useState<number>(0);
  const [listeningPracticeSetId, setListeningPracticeSetId] = useState<number>(0);
  const [writingWordOrder, setWritingWordOrder] = useState<string[]>([]);
  const mainScroll = useRef<ScrollView>(null);
  useScrollToTop(mainScroll);

  const recommendation = route?.params as LearnScreenParams | undefined;
  const recommendationKey = recommendation ? JSON.stringify([
    recommendation.timestamp ?? 0,
    recommendation.targetView,
    recommendation.recommendedLesson?.skill,
    recommendation.recommendedLesson?.hskLevel,
    recommendation.recommendedLesson?.topic,
    recommendation.recommendedLesson?.practiceSetId,
  ]) : undefined;
  const handledRecommendation = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!recommendation || handledRecommendation.current === recommendationKey) return;
    if (recommendation.targetView !== 'skills' && !recommendation.recommendedLesson) return;
    handledRecommendation.current = recommendationKey;
    setActiveTab(0);
    const lesson = recommendation.recommendedLesson;
    if (!lesson) {
      setViewMode('main');
      return;
    }
    const skills: Record<string, SkillType> = {
      LISTENING: 'NGHE', SPEAKING: 'NOI', READING: 'DOC', WRITING: 'VIET',
    };
    if (
      !skills[lesson.skill] || !Number.isInteger(lesson.hskLevel) ||
      lesson.hskLevel < 1 || lesson.hskLevel > 9
    ) return;
    setSelectedSkill(skills[lesson.skill]);
    setPracticeHsk(lesson.hskLevel);
    setPracticeTopic(lesson.topic);
    if (lesson.skill === 'WRITING' && lesson.topic) {
      setWritingWordOrder([]);
      setViewMode('skillFlashcard');
    } else if (lesson.skill === 'SPEAKING' && lesson.topic) {
      setViewMode('skillPractice');
    } else if (lesson.practiceSetId && lesson.practiceSetId > 0) {
      setReadingPracticeSetId(lesson.practiceSetId);
      setListeningPracticeSetId(lesson.practiceSetId);
      setViewMode('skillPractice');
    } else {
      setViewMode('skillSetup');
    }
  }, [recommendation, recommendationKey]);

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

  useScreenBackHandler(() => {
    if (viewMode === 'examResult') handleBackFromTest();
    else if (viewMode === 'examList' || viewMode === 'skillSetup') setViewMode('main');
    else if (viewMode === 'skillFlashcard' || viewMode === 'skillPracticeResult') setViewMode('skillSetup');
    else return false;
    return true;
  }, !['main', 'examTest', 'examReview', 'skillPractice'].includes(viewMode));

  if (viewMode === 'examResult' && activeExamId) {
    return <HskExamResultView result={examResults[activeExamId]} onBack={handleBackFromTest} onReview={handleReviewExam} onRetake={handleRetakeExam} />;
  }

  if (viewMode === 'examReview' && activeExamId) {
    return <HskExamTestView examId={activeExamId} durationMin={examDuration} onBack={() => setViewMode('examResult')} isReviewMode={true} reviewAnswers={examResults[activeExamId]?.answers} reviewQuestions={examResults[activeExamId]?.questions} />;
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
          hskLevel={practiceHsk}
          onSelectHsk={setPracticeHsk}
          onBack={() => setViewMode('main')}
          onStartPractice={(hskLevel, topic) => {
            setPracticeHsk(hskLevel);
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
          onStartPractice={(hskLevel, practiceSetId) => {
            setPracticeHsk(hskLevel);
            setReadingPracticeSetId(practiceSetId);
            setViewMode('skillPractice');
          }}
        />
      );
    }
    
    if (selectedSkill === 'VIET') {
      return (
        <WritingPracticeSetupView
          hskLevel={practiceHsk}
          onSelectHsk={setPracticeHsk}
          onBack={() => setViewMode('main')}
          onStart={(hskLevel, topic) => {
            setPracticeHsk(hskLevel);
            setPracticeTopic(topic);
            setWritingWordOrder([]);
            setViewMode('skillFlashcard');
          }}
        />
      );
    }
    
    return (
      <ListeningPracticeSetupView 
        onBack={() => setViewMode('main')} 
        onStartPractice={(hskLevel, practiceSetId) => {
          setPracticeHsk(hskLevel);
          setListeningPracticeSetId(practiceSetId);
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
        onFinishFlashcards={(wordOrder) => {
          setWritingWordOrder(wordOrder);
          setViewMode('skillPractice');
        }}
      />
    );
  }

  if (viewMode === 'skillPractice') {
    if (selectedSkill === 'NOI') {
      return (
        <SpeakingPracticeView
          key={`${practiceHsk}:${practiceTopic}`}
          hskLevel={practiceHsk}
          topic={practiceTopic}
          onBack={() => setViewMode('skillSetup')}
          onSubmit={(result) => {
            setSpeakingResult(result);
            setViewMode('skillPracticeResult');
          }}
        />
      );
    }

    if (selectedSkill === 'DOC') {
      return (
        <ReadingPracticeView
          hskLevel={practiceHsk}
          practiceSetId={readingPracticeSetId}
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
          hskLevel={practiceHsk}
          topic={practiceTopic}
          wordOrder={writingWordOrder}
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
        key={`${practiceHsk}:${listeningPracticeSetId}`}
        hskLevel={practiceHsk} 
        practiceSetId={listeningPracticeSetId}
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
      return (
        <SpeakingPracticeResultView
          result={speakingResult || { score: null, recordedCount: 0, gradedCount: 0, totalCount: 0, assessmentStatus: 'ungraded' }}
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
        score={lisResult?.score ?? null}
        correctCount={lisResult?.correctCount || 0}
        totalCount={lisResult?.totalCount || 0}
        gradedCount={(lisResult as any)?.gradedCount}
        manualCount={(lisResult as any)?.manualCount}
        completedCount={(lisResult as any)?.completedCount}
        questions={(lisResult as any)?.questions}
        answers={lisResult?.answers}
        onBackToSetup={() => setViewMode('skillSetup')}
        onRetake={() => setViewMode('skillPractice')}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <EducationHeader />
      
      <ScrollView ref={mainScroll} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
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
