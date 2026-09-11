import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ExamResult } from '../types';
import { ALL_HSK_EXAMS } from '../mockData';
import { ms, hs, vs } from '@/theme';

interface Props {
  result: ExamResult;
  onBack: () => void;
  onReview: () => void;
  onRetake: () => void;
}

export const HskExamResultView = ({ result, onBack, onReview, onRetake }: Props) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'WRONG'>('WRONG');
  const examLevel = parseInt(result.examId.match(/hsk(\d)/)?.[1] || '1');
  const examIndex = result.examId.split('_')[1] || '1';

  const fullExam = ALL_HSK_EXAMS[examLevel]?.find(e => e.id === result.examId);
  const questions = fullExam?.questions || [];

  const wrongCount = result.totalCount - result.correctCount;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: hs(16), paddingTop: vs(12), paddingBottom: vs(16), flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <TouchableOpacity onPress={onBack} style={{ padding: ms(8), marginLeft: hs(-8), marginRight: hs(8) }}>
          <Svg height="24" viewBox="0 0 24 24" width="24">
            <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#1E3A8A" />
          </Svg>
        </TouchableOpacity>
        <Text style={{ fontSize: ms(16), fontWeight: '700', color: '#374151' }}>
          Quay lại danh sách đề thi
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: ms(16) }} showsVerticalScrollIndicator={false}>
        {/* Top Result Card */}
        <View style={{ backgroundColor: '#FAF9F6', borderRadius: ms(12), padding: ms(16), marginBottom: vs(16), borderWidth: 1, borderColor: '#E5E7EB' }}>

          <View style={{ backgroundColor: '#F4EBE6', borderRadius: ms(8), paddingVertical: vs(24), alignItems: 'center', marginBottom: vs(20) }}>
            <Text style={{ fontSize: ms(40), fontWeight: '900', color: '#DC2626', marginBottom: vs(4) }}>
              {result.score}%
            </Text>
            <Text style={{ fontSize: ms(13), color: '#4B5563', fontWeight: '500' }}>
              Đúng {result.correctCount}/{result.totalCount} câu
            </Text>
          </View>

          <Text style={{ fontSize: ms(13), color: '#6B7280', fontWeight: '500', marginBottom: vs(4) }}>Kết quả của bạn</Text>
          <Text style={{ fontSize: ms(20), fontWeight: '800', color: '#111827', marginBottom: vs(16) }}>Đề {examIndex}</Text>

          <View style={{ flexDirection: 'row', gap: hs(12), marginBottom: vs(24) }}>
            <View style={{ backgroundColor: '#FDF8F6', paddingHorizontal: hs(12), paddingVertical: vs(6), borderRadius: ms(16), borderWidth: 1, borderColor: '#F5E6E1' }}>
              <Text style={{ fontSize: ms(13), color: '#374151', fontWeight: '700' }}>Nghe: {result.listeningCorrect}/20</Text>
            </View>
            <View style={{ backgroundColor: '#FDF8F6', paddingHorizontal: hs(12), paddingVertical: vs(6), borderRadius: ms(16), borderWidth: 1, borderColor: '#F5E6E1' }}>
              <Text style={{ fontSize: ms(13), color: '#374151', fontWeight: '700' }}>Đọc: {result.readingCorrect}/20</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: hs(12), marginBottom: vs(12) }}>
            <TouchableOpacity onPress={onReview} style={{ flex: 2, backgroundColor: '#1E3A8A', borderRadius: ms(8), paddingVertical: vs(12), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginRight: hs(8) }}>
                <Path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" fill="#FFFFFF" />
              </Svg>
              <Text style={{ color: '#FFFFFF', fontSize: ms(13), fontWeight: '700' }}>Xem lại chi tiết bài làm</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onRetake} style={{ flex: 1, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(8), paddingVertical: vs(12), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Svg height="16" viewBox="0 0 24 24" width="16" style={{ marginRight: hs(6) }}>
                <Path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="#4B5563" />
              </Svg>
              <Text style={{ color: '#4B5563', fontSize: ms(13), fontWeight: '700' }}>Làm lại</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onBack} style={{ backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(8), paddingVertical: vs(12), alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: hs(20) }}>
            <Text style={{ color: '#4B5563', fontSize: ms(13), fontWeight: '700' }}>Chọn đề khác</Text>
          </TouchableOpacity>
        </View>

        {/* Review Grid Card */}
        <View style={{ backgroundColor: '#FAF9F6', borderRadius: ms(12), padding: ms(16), borderWidth: 1, borderColor: '#E5E7EB' }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(16) }}>
            <Text style={{ fontSize: ms(16), fontWeight: '800', color: '#111827' }}>Xem lại bài làm</Text>
            <View style={{ flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: ms(20), padding: ms(2) }}>
              <TouchableOpacity onPress={() => setFilterMode('WRONG')} style={{ backgroundColor: filterMode === 'WRONG' ? '#1E3A8A' : 'transparent', borderRadius: ms(18), paddingHorizontal: hs(12), paddingVertical: vs(4) }}>
                <Text style={{ color: filterMode === 'WRONG' ? '#FFFFFF' : '#6B7280', fontSize: ms(11), fontWeight: filterMode === 'WRONG' ? '700' : '600' }}>Câu sai ({wrongCount})</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setFilterMode('ALL')} style={{ backgroundColor: filterMode === 'ALL' ? '#1E3A8A' : 'transparent', borderRadius: ms(18), paddingHorizontal: hs(12), paddingVertical: vs(4) }}>
                <Text style={{ color: filterMode === 'ALL' ? '#FFFFFF' : '#6B7280', fontSize: ms(11), fontWeight: filterMode === 'ALL' ? '700' : '600' }}>Tất cả ({result.totalCount})</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={onReview} style={{ marginBottom: vs(24) }}>
            <Text style={{ color: '#1E3A8A', fontSize: ms(13), fontWeight: '700' }}>Mở toàn bộ đề ở chế độ xem lại →</Text>
          </TouchableOpacity>

          <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#111827', marginBottom: vs(12), borderLeftWidth: 3, borderLeftColor: '#1E3A8A', paddingLeft: hs(8) }}>Nghe <Text style={{ color: '#6B7280', fontWeight: '500' }}>{result.listeningCorrect}/20</Text></Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(24) }}>
            {questions.filter(q => q.type === 'LISTENING').map(q => {
              const ans = result.answers[q.id];
              const isCorrect = ans === q.correctOptionId;
              const isUnanswered = !ans;

              if (filterMode === 'WRONG' && isCorrect) return null;

              let color = '#D1D5DB';
              let bgColor = '#FFFFFF';

              if (isCorrect) {
                color = '#22C55E'; bgColor = '#F0FDF4';
              } else if (isUnanswered) {
                color = '#D1D5DB'; bgColor = '#FFFFFF';
              } else {
                color = '#EF4444'; bgColor = '#FEF2F2';
              }

              return (
                <View key={q.id} style={{ width: ms(40), height: ms(40), borderRadius: ms(8), borderWidth: 1, borderColor: color, backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: color === '#D1D5DB' ? '#4B5563' : color, fontWeight: '700' }}>{q.index}</Text>
                </View>
              );
            })}
          </View>

          <Text style={{ fontSize: ms(14), fontWeight: '700', color: '#111827', marginBottom: vs(12), borderLeftWidth: 3, borderLeftColor: '#1E3A8A', paddingLeft: hs(8) }}>Đọc <Text style={{ color: '#6B7280', fontWeight: '500' }}>{result.readingCorrect}/20</Text></Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(24) }}>
            {questions.filter(q => q.type === 'READING').map(q => {
              const ans = result.answers[q.id];
              const isCorrect = ans === q.correctOptionId;
              const isUnanswered = !ans;

              if (filterMode === 'WRONG' && isCorrect) return null;

              let color = '#D1D5DB';
              let bgColor = '#FFFFFF';

              if (isCorrect) {
                color = '#22C55E'; bgColor = '#F0FDF4';
              } else if (isUnanswered) {
                color = '#D1D5DB'; bgColor = '#FFFFFF';
              } else {
                color = '#EF4444'; bgColor = '#FEF2F2';
              }

              return (
                <View key={q.id} style={{ width: ms(40), height: ms(40), borderRadius: ms(8), borderWidth: 1, borderColor: color, backgroundColor: bgColor, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: color === '#D1D5DB' ? '#4B5563' : color, fontWeight: '700' }}>{q.index}</Text>
                </View>
              );
            })}
          </View>

          <View style={{ marginTop: vs(8), flexDirection: 'row', flexWrap: 'wrap', gap: hs(12) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(4) }}><View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#22C55E' }} /><Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Đúng</Text></View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(4) }}><View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: '#EF4444' }} /><Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Sai</Text></View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: hs(4) }}><View style={{ width: 10, height: 10, borderRadius: 2, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' }} /><Text style={{ fontSize: ms(12), color: '#4B5563', fontWeight: '500' }}>Chưa trả lời</Text></View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
