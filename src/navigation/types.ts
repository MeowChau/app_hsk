import type { StackScreenProps } from '@react-navigation/stack';

import type { Paths } from '@/navigation/paths';
import type { RecommendedLessonTarget } from '@/services/education/types';

export interface LearnScreenParams {
  targetView?: 'skills';
  recommendedLesson?: RecommendedLessonTarget;
  timestamp?: number;
}

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type RootTabParamList = {
  [Paths.Home]: undefined;
  [Paths.Learn]: LearnScreenParams | undefined;
  [Paths.Game]: { targetView?: 'main' | 'rules' | 'leaderboard' | 'matching' | 'battle'; timestamp?: number } | undefined;
  [Paths.Statistics]: undefined;
  [Paths.Profile]: undefined;
};

export type RootStackParamList = {
  [Paths.Example]: undefined;
  [Paths.Startup]: undefined;
  [Paths.Onboarding]: undefined;
  [Paths.Login]: undefined;
  [Paths.Register]: undefined;
  [Paths.MainTabs]: undefined;
  [Paths.Home]: undefined;
  [Paths.Learn]: LearnScreenParams | undefined;
  [Paths.Game]: { targetView?: 'main' | 'rules' | 'leaderboard' | 'matching' | 'battle'; timestamp?: number } | undefined;
  [Paths.Statistics]: undefined;
  [Paths.Profile]: undefined;
  [Paths.Survey]: undefined;
  [Paths.ForgotPassword]: undefined;
  [Paths.ResetPassword]: { hash?: string; email?: string } | undefined;
};
