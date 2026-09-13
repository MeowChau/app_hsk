import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ms, hs, vs } from '@/theme';
import { WRITING_PRACTICE_TOPICS } from './writingMockData';

interface Props {
  hskLevel: number;
  topicId: string;
  totalCount: number;
  answeredCount: number;
  statuses: Record<string, string>;
  onBackToSetup: () => void;
  onRetake: () => void;
}

export const WritingPracticeResultView = ({ hskLevel, topicId, totalCount, answeredCount, statuses, onBackToSetup, onRetake }: Props) => {
  const allTopics = WRITING_PRACTICE_TOPICS[hskLevel] || [];
  const topic = allTopics.find(t => t.id === topicId);
  const percent = totalCount > 0 ? Math.round((answeredCount / totalCount) * 100) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: hs(16), paddingTop: vs(24), paddingBottom: vs(100) }}>
        
        {/* Title */}
        <Text style={{ fontSize: ms(20), fontWeight: '700', color: '#111827', marginBottom: vs(8) }}>
          Luyện tập kỹ năng viết
        </Text>
        <Text style={{ fontSize: ms(13), color: '#4B5563', lineHeight: vs(22), marginBottom: vs(32) }}>
          Chủ đề: {topic?.title}
        </Text>

        {/* Result Card */}
        <View style={{
          backgroundColor: '#FAF8F1',
          width: '90%',
          borderRadius: ms(8),
          paddingVertical: vs(40),
          paddingHorizontal: hs(16),
          alignItems: 'center',
          alignSelf: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: vs(8) }}>
            <Svg height="24" viewBox="0 0 24 24" width="24" style={{ marginRight: hs(8) }}>
              <Path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
            <Text style={{ fontSize: ms(20), fontWeight: '800', color: '#111827' }}>
              Tỉ lệ hoàn thành
            </Text>
          </View>
          <Text style={{ fontSize: ms(14), color: '#6B7280', marginBottom: vs(24) }}>
            Báo cáo kết quả
          </Text>

          <View style={{ position: 'relative', justifyContent: 'center', alignItems: 'center', marginBottom: vs(32) }}>
            <Svg width="120" height="120" viewBox="0 0 120 120">
              <Path d="M60 10a50 50 0 110 100 50 50 0 010-100" fill="none" stroke="#FEE2E2" strokeWidth="10" />
              <Path 
                d="M60 10a50 50 0 110 100 50 50 0 010-100" 
                fill="none" 
                stroke="#EF4444" 
                strokeWidth="10"
                strokeDasharray={`${(percent * 314) / 100} 314`}
                strokeLinecap="round"
              />
            </Svg>
            <View style={{ position: 'absolute', alignItems: 'center' }}>
              <Text style={{ fontSize: ms(24), fontWeight: '900', color: '#111827' }}>{percent}%</Text>
            </View>
          </View>

          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: hs(24) }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: ms(20), fontWeight: '800', color: '#10B981', marginBottom: vs(4) }}>{answeredCount}</Text>
              <Text style={{ fontSize: ms(13), color: '#6B7280' }}>Đã hoàn thành</Text>
            </View>
            <View style={{ width: 1, height: '100%', backgroundColor: '#E5E7EB' }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: ms(20), fontWeight: '800', color: '#F59E0B', marginBottom: vs(4) }}>{totalCount - answeredCount}</Text>
              <Text style={{ fontSize: ms(13), color: '#6B7280' }}>Bỏ qua</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={{ 
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        paddingHorizontal: hs(16),
        paddingTop: vs(16),
        paddingBottom: vs(32),
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: hs(12)
      }}>
        <TouchableOpacity 
          onPress={onBackToSetup}
          style={{ flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: ms(8), paddingVertical: vs(12), alignItems: 'center' }}
        >
          <Text style={{ color: '#374151', fontSize: ms(14), fontWeight: '700' }}>Quay lại bài học</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onRetake}
          style={{ flex: 1, backgroundColor: '#1E3A8A', borderRadius: ms(8), paddingVertical: vs(12), alignItems: 'center' }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: ms(14), fontWeight: '700' }}>Luyện tập lại</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
