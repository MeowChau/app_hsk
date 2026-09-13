import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ms, hs, vs } from '@/theme';
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
  const effectiveTotal = totalCount || words.length;
  const score = effectiveTotal > 0 ? Math.round((answeredCount / effectiveTotal) * 100) : 0;
  const unwrittenCount = Math.max(0, effectiveTotal - answeredCount);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(24), paddingBottom: vs(100) }}>
        
        {/* Title */}
        <Text style={{ fontSize: ms(22), fontWeight: '800', color: '#111827', marginBottom: vs(8) }}>
          Luyện tập kỹ năng viết
        </Text>
        <Text style={{ fontSize: ms(14), color: '#4B5563', lineHeight: vs(22), marginBottom: vs(32) }}>
          Chọn một bài học, tập viết từ vựng theo chủ đề
        </Text>

        {/* Result Card */}
        <View style={{
          backgroundColor: '#FAF8F1',
          borderRadius: ms(8),
          paddingVertical: vs(40),
          paddingHorizontal: hs(16),
          alignItems: 'center',
          alignSelf: 'center',
          width: '90%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 3,
          marginBottom: vs(24),
        }}>
          <Text style={{ fontSize: ms(48), fontWeight: '800', color: '#1E3A8A', marginBottom: vs(8) }}>
            {score}%
          </Text>
          <Text style={{ fontSize: ms(15), color: '#4B5563', fontWeight: '500', marginBottom: vs(24) }}>
            Đúng {answeredCount}/{effectiveTotal} từ
          </Text>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: hs(12) }}>
            <TouchableOpacity
              onPress={onBackToSetup}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: hs(6),
                backgroundColor: '#FFFFFF',
                borderWidth: 1, borderColor: '#D1D5DB',
                borderRadius: ms(8),
                paddingVertical: vs(10),
                paddingHorizontal: hs(16),
              }}
            >
              <Svg height="14" viewBox="0 0 24 24" width="14">
                <Path d="M20 12H4M10 18l-6-6 6-6" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={{ color: '#374151', fontSize: ms(14), fontWeight: '700' }}>Đổi học liệu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onRetake}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: hs(6),
                backgroundColor: '#1E3A8A',
                borderRadius: ms(8),
                paddingVertical: vs(10),
                paddingHorizontal: hs(16),
              }}
            >
              <Svg height="14" viewBox="0 0 24 24" width="14">
                <Path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text style={{ color: '#FFFFFF', fontSize: ms(14), fontWeight: '700' }}>Luyện lại</Text>
            </TouchableOpacity>
          </View>
        </View>

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
              <Text style={{ fontSize: ms(13), color: '#4B5563', fontWeight: '500' }}>Đã hoàn thành</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(4) }}>
              <View style={{ width: 10, height: 10, borderRadius: 2, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' }} />
              <Text style={{ fontSize: ms(13), color: '#4B5563', fontWeight: '500' }}>Chưa viết</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};
