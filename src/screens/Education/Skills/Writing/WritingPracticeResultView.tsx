import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { ms, hs, vs } from '@/theme';
import { PracticeResultCard } from '../components';
import { generateWritingWords } from './writingMockData';

interface Props {
  hskLevel: number;
  topicId: string;
  totalCount: number;
  answeredCount: number;
  statuses: Record<string, string>;
  onBackToSetup: () => void;
  onRetake: () => void;
}

export const WritingPracticeResultView = ({
  hskLevel,
  topicId,
  totalCount,
  answeredCount,
  statuses,
  onBackToSetup,
  onRetake,
}: Props) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'UNWRITTEN'>('ALL');
  const words = generateWritingWords(hskLevel, topicId);
  const effectiveTotal = totalCount || words.length || 1;
  const score = Math.round((answeredCount / effectiveTotal) * 100);
  const unwrittenCount = Math.max(0, effectiveTotal - answeredCount);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(24), paddingBottom: vs(100) }}>
        
        {/* Title */}
        <Text style={{ fontSize: ms(20), fontWeight: '700', color: '#111827', marginBottom: vs(8) }}>
          Luyện tập kỹ năng viết
        </Text>
        <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(22), marginBottom: vs(32) }}>
          Chọn một bài học, tập viết từ vựng theo chủ đề
        </Text>

        {/* Result Card */}
        <PracticeResultCard
          score={score}
          scoreSuffix="%"
          subtitle={`Đúng ${answeredCount}/${effectiveTotal} từ`}
          onBackToSetup={onBackToSetup}
          onRetake={onRetake}
          retakeButtonText="Luyện lại"
        />

        {/* Answer Grid / Word List */}
        <View style={{ backgroundColor: '#FAF8F1', borderRadius: ms(8), padding: ms(16), width: '90%', alignSelf: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(16) }}>
            <Text style={{ fontSize: ms(18), fontWeight: '800', color: '#111827' }}>Xem lại bài làm</Text>
            <View style={{ flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: ms(20), padding: ms(2) }}>
              <TouchableOpacity onPress={() => setFilterMode('UNWRITTEN')} style={{ backgroundColor: filterMode === 'UNWRITTEN' ? '#1E3A8A' : 'transparent', borderRadius: ms(18), paddingHorizontal: hs(12), paddingVertical: vs(4) }}>
                <Text style={{ color: filterMode === 'UNWRITTEN' ? '#FFFFFF' : '#6B7280', fontSize: ms(12), fontWeight: filterMode === 'UNWRITTEN' ? '700' : '600' }}>Chưa viết ({unwrittenCount})</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilterMode('ALL')} style={{ backgroundColor: filterMode === 'ALL' ? '#1E3A8A' : 'transparent', borderRadius: ms(18), paddingHorizontal: hs(12), paddingVertical: vs(4) }}>
                <Text style={{ color: filterMode === 'ALL' ? '#FFFFFF' : '#6B7280', fontSize: ms(12), fontWeight: filterMode === 'ALL' ? '700' : '600' }}>Tất cả ({effectiveTotal})</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(16) }}>
            {words.map((w, idx) => {
              const isDone = statuses[w.id] === 'done';
              if (filterMode === 'UNWRITTEN' && isDone) return null;

              let color = '#D1D5DB';
              let bgColor = '#FFFFFF';

              if (isDone) {
                color = '#22C55E';
                bgColor = '#F0FDF4';
              }

              return (
                <View key={w.id || idx} style={{ width: ms(44), height: ms(44), borderRadius: ms(8), borderWidth: 1, borderColor: color, backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: isDone ? '#15803D' : '#4B5563', fontWeight: '700', fontSize: ms(16) }}>{w.character}</Text>
                </View>
              );
            })}
          </View>

          {/* Legend */}
          <View style={{ marginTop: vs(8), flexDirection: 'row', flexWrap: 'wrap', gap: hs(12) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(4) }}>
              <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#22C55E' }} />
              <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>Đã hoàn thành</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(4) }}>
              <View style={{ width: 10, height: 10, borderRadius: 2, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' }} />
              <Text style={{ fontSize: ms(14), color: '#4B5563', fontWeight: '500' }}>Chưa viết</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};
