import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import type { PronunciationAssessment } from '@/services/education/pronunciation';
import { hs, ms, vs } from '@/theme';

export function SpeakingAssessmentFeedback({ assessment, pending, error, onRetry }: {
  assessment?: PronunciationAssessment;
  pending: boolean;
  error?: string;
  onRetry: () => void;
}) {
  if (pending) return (
    <View style={{ alignItems: 'center', marginBottom: vs(16) }}>
      <ActivityIndicator color="#1E3A8A" />
      <Text style={{ color: '#4B5563', fontSize: ms(14), marginTop: vs(8), textAlign: 'center' }}>Đang phân tích bản ghi. Bạn vẫn có thể nghe lại giọng của mình.</Text>
    </View>
  );
  if (!assessment) return (
    <View style={{ alignItems: 'center', marginBottom: vs(16) }}>
      <Text accessibilityLiveRegion="polite" style={{ color: '#4B5563', fontSize: ms(14), lineHeight: vs(22), textAlign: 'center' }}>{error || 'Bản ghi chưa được chấm.'}</Text>
      <TouchableOpacity accessibilityRole="button" onPress={onRetry} style={{ paddingHorizontal: hs(16), paddingVertical: vs(12) }}>
        <Text style={{ color: '#1E3A8A', fontSize: ms(14), fontWeight: '700' }}>Thử chấm lại</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={{ width: '100%', marginBottom: vs(16), gap: vs(12) }}>
      <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E7EB', paddingVertical: vs(12), gap: vs(8) }}>
        {[
          ['Phát âm', assessment.accuracyScore],
          ['Trôi chảy', assessment.fluencyScore],
          ['Đọc đủ câu', assessment.completenessScore],
        ].map(([label, value]) => <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: '#4B5563', fontSize: ms(14) }}>{label}</Text>
          <Text style={{ color: '#111827', fontSize: ms(14), fontWeight: '600' }}>{value}/100</Text>
        </View>)}
      </View>
      {!!assessment.recognizedText && <Text style={{ fontSize: ms(14), lineHeight: vs(22), color: '#374151' }}>Nội dung nhận diện: {assessment.recognizedText}</Text>}
      <Text style={{ fontSize: ms(14), lineHeight: vs(22), color: '#374151' }}>{assessment.feedback}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: hs(8) }}>
        {assessment.words.map((word, index) => <View key={`${index}:${word.word}`} style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: ms(6), paddingHorizontal: hs(8), paddingVertical: vs(6) }}>
          <Text style={{ fontSize: ms(16), color: word.errorType === 'Omission' || word.errorType === 'Insertion' || (word.accuracyScore ?? 0) < 60 ? '#B91C1C' : '#166534' }}>
            {word.word} · {word.errorType === 'Omission' ? 'Đọc thiếu' : word.errorType === 'Insertion' ? 'Đọc thêm' : `${word.accuracyScore ?? '—'}/100`}
          </Text>
        </View>)}
      </View>
    </View>
  );
}
