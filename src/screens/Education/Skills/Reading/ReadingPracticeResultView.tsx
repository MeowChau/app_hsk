import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { ms, hs, vs } from '@/theme';
import { PracticeResultCard } from '../components';

interface Props {
  score: number;
  correctCount: number;
  totalCount: number;
  answers: Record<string, string>;
  onBackToSetup: () => void;
  onRetake: () => void;
}

export const ReadingPracticeResultView = ({ score, correctCount, totalCount, answers, onBackToSetup, onRetake }: Props) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'WRONG'>('WRONG');
  const wrongCount = totalCount - correctCount;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(24), paddingBottom: vs(100) }}>

        {/* Title */}
        <Text style={{ fontSize: ms(20), fontWeight: '700', color: '#111827', marginBottom: vs(8) }}>
          Luyện tập kỹ năng đọc
        </Text>
        <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(22), marginBottom: vs(32) }}>
          Chọn một bài học, đọc và chọn đáp án đúng
        </Text>

        {/* Result Card */}
        <PracticeResultCard
          score={score}
          scoreSuffix="%"
          scoreColor="#DC2626"
          subtitle={`Đúng ${correctCount}/${totalCount} câu`}
          onBackToSetup={onBackToSetup}
          onRetake={onRetake}
        />
        {/* Answer Grid */}
        <View style={{ backgroundColor: '#FAF8F1', borderRadius: ms(8), padding: ms(16), width: '90%', alignSelf: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(16) }}>
            <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827' }}>Xem lại bài làm</Text>
            <View style={{ flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: ms(20), padding: ms(2) }}>
              <TouchableOpacity onPress={() => setFilterMode('WRONG')} style={{ backgroundColor: filterMode === 'WRONG' ? '#1E3A8A' : 'transparent', borderRadius: ms(18), paddingHorizontal: hs(12), paddingVertical: vs(4) }}>
                <Text style={{ color: filterMode === 'WRONG' ? '#FFFFFF' : '#6B7280', fontSize: ms(12), fontWeight: filterMode === 'WRONG' ? '700' : '600' }}>Câu sai ({wrongCount})</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilterMode('ALL')} style={{ backgroundColor: filterMode === 'ALL' ? '#1E3A8A' : 'transparent', borderRadius: ms(18), paddingHorizontal: hs(12), paddingVertical: vs(4) }}>
                <Text style={{ color: filterMode === 'ALL' ? '#FFFFFF' : '#6B7280', fontSize: ms(12), fontWeight: filterMode === 'ALL' ? '700' : '600' }}>Tất cả ({totalCount})</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(16) }}>
            {Array.from({ length: totalCount }).map((_, i) => {
              const isCorrect = i % 2 === 0;
              const isAnswered = i !== totalCount - 1;

              if (filterMode === 'WRONG' && isCorrect) return null;

              let color = '#D1D5DB';
              let bgColor = '#FFFFFF';

              if (!isAnswered) {
                color = '#D1D5DB'; bgColor = '#FFFFFF';
              } else if (isCorrect) {
                color = '#22C55E'; bgColor = '#F0FDF4';
              } else {
                color = '#EF4444'; bgColor = '#FEF2F2';
              }

              return (
                <View key={i} style={{ width: ms(40), height: ms(40), borderRadius: ms(8), borderWidth: 1, borderColor: color, backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: color === '#D1D5DB' ? '#4B5563' : color, fontWeight: '700', fontSize: ms(16) }}>{i + 1}</Text>
                </View>
              );
            })}
          </View>

          {/* Legend */}
          <View style={{ marginTop: vs(8), flexDirection: 'row', flexWrap: 'wrap', gap: hs(12) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(4) }}><View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#22C55E' }} /><Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>Đúng</Text></View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(4) }}><View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#EF4444' }} /><Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>Sai</Text></View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(4) }}><View style={{ width: 10, height: 10, borderRadius: 2, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' }} /><Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>Chưa trả lời</Text></View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
