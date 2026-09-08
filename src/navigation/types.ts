import type { StackScreenProps } from '@react-navigation/stack';

import type { Paths } from '@/navigation/paths';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type RootTabParamList = {
  [Paths.Home]: undefined;
  [Paths.Learn]: undefined;
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
  [Paths.Learn]: undefined;
  [Paths.Game]: { targetView?: 'main' | 'rules' | 'leaderboard' | 'matching' | 'battle'; timestamp?: number } | undefined;
  [Paths.Statistics]: undefined;
  [Paths.Profile]: undefined;
};
