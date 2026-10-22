import { HTTPError } from 'ky';
import { z } from 'zod';
import { instance } from '../instance';
import type { VoiceRecordingAudio } from '../audio/VoiceRecorder';

const score = z.number().min(0).max(100);
const assessmentSchema = z.object({
  provider: z.literal('azure-speech'),
  locale: z.literal('zh-CN'),
  score,
  accuracyScore: score,
  fluencyScore: score,
  completenessScore: score,
  recognizedText: z.string(),
  feedback: z.string(),
  words: z.array(z.object({
    word: z.string(),
    accuracyScore: score.nullable(),
    errorType: z.string(),
  })).min(1).max(5000),
});

export type PronunciationAssessment = z.infer<typeof assessmentSchema>;

export async function assessPronunciation(audio: VoiceRecordingAudio, referenceText: string, signal: AbortSignal): Promise<PronunciationAssessment> {
  if (!referenceText.trim()) throw new Error('Câu này chưa có nội dung tiếng Trung để đối chiếu.');
  const form = new FormData();
  // React Native's multipart uploader supports data URIs on Android and iOS.
  // This keeps the WAV in memory and lets the shared client handle JWT refresh.
  form.append('audio', audio as unknown as Blob);
  form.append('referenceText', referenceText);
  try {
    const response = await instance.post('ai/speaking/pronunciation-assessment', {
      body: form, signal, timeout: 45000, retry: 0,
    }).json<unknown>();
    const parsed = assessmentSchema.safeParse(response);
    if (!parsed.success) throw new Error('Kết quả chấm chưa hợp lệ. Vui lòng thử chấm lại.');
    return parsed.data;
  } catch (error) {
    if (signal.aborted) throw error;
    if (error instanceof HTTPError) {
      const data = await error.response.clone().json().catch(() => null) as { message?: unknown } | null;
      if (typeof data?.message === 'string') throw new Error(data.message);
      throw new Error('Không thể chấm phát âm lúc này. Vui lòng thử lại.');
    }
    if (error instanceof Error && error.message && !['Network request failed', 'Failed to fetch'].includes(error.message) && error.name !== 'TimeoutError') throw error;
    throw new Error('Không kết nối được dịch vụ chấm. Bản ghi vẫn còn để nghe lại; bạn có thể thử chấm lại.');
  }
}
