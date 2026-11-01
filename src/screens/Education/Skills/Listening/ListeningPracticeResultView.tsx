import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { ms, hs, vs } from '@/theme';
import { PracticeResultCard } from '../components';
import type { ListeningPracticeQuestion } from '../../types';

interface Props {
  score: number | null;
  correctCount: number;
  totalCount: number;
  gradedCount?: number;
  manualCount?: number;
  completedCount?: number;
  questions?: ListeningPracticeQuestion[];
  answers?: Record<string, string>;
  onBackToSetup: () => void;
  onRetake: () => void;
}

export const ListeningPracticeResultView = ({ score, correctCount, totalCount, gradedCount = totalCount, manualCount = 0, completedCount = 0, questions = [], answers = {}, onBackToSetup, onRetake }: Props) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(24), paddingBottom: vs(100) }}>
        
        {/* Title */}
        <Text style={{ fontSize: ms(20), fontWeight: '700', color: '#111827', marginBottom: vs(8) }}>
          Luyện tập kỹ năng nghe
        </Text>
        <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(22), marginBottom: vs(32) }}>
          {score === null ? 'Bài nghe–đọc lại và nghe–viết theo yêu cầu trong hình.' : 'Kết quả bài luyện nghe.'}
        </Text>

        {/* Result Card */}
        <PracticeResultCard
          score={score === null ? '—' : score}
          scoreSuffix={score === null ? '' : '%'}
          subtitle={score === null ? `Đã làm ${completedCount}/${totalCount} mục. Xem lại bài làm và đối chiếu đáp án bên dưới; phần đọc lại tự luyện không chấm tự động.` : `Đúng ${correctCount}/${gradedCount} câu${manualCount ? ` · ${manualCount} mục tự luyện đối chiếu bên dưới` : ''}`}
          onBackToSetup={onBackToSetup}
          onRetake={onRetake}
        />
        {questions.filter(question => question.requiresManualReview).map(question => (
          <View key={question.id} style={{ backgroundColor: '#FFFFFF', padding: ms(16), borderRadius: ms(12), marginBottom: vs(12) }}>
            <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#111827', lineHeight: vs(22), marginBottom: vs(8) }}>Mục {question.index}: {question.instruction}</Text>
            <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(22) }}>{question.type === 'LISTEN_REPEAT' ? (answers[question.id] ? 'Đã luyện xong' : 'Chưa đánh dấu hoàn thành') : (answers[question.id] || 'Chưa trả lời')}</Text>
            {question.referenceAnswer ? (
              <View style={{ marginTop: vs(12), padding: ms(12), backgroundColor: '#EFF6FF', borderRadius: ms(8) }}>
                <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#1E3A8A', marginBottom: vs(6) }}>Đáp án đối chiếu theo thứ tự</Text>
                <Text selectable style={{ fontSize: ms(15), color: '#111827', lineHeight: vs(24) }}>{question.referenceAnswer}</Text>
              </View>
            ) : null}
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};
