export type SkillType = 'NGHE' | 'NÓI' | 'ĐỌC' | 'VIẾT';

export type EducationViewMode = 'main' | 'examList';

export interface HskExam {
  id: string;
  level: number;
  name: string;
  timeLimit: number;
  listeningCount: number;
  readingCount: number;
}
