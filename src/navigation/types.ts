import type { StackScreenProps } from '@react-navigation/stack';

import type { Paths } from '@/navigation/paths';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [Paths.Example]: undefined;
  [Paths.Startup]: undefined;
  [Paths.Onboarding]: undefined;
  [Paths.Login]: undefined;
  [Paths.Register]: undefined;
  [Paths.Home]: { tab?: 'home' | 'learn' | 'game' | 'stats' | 'profile' } | undefined;
  [Paths.Statistics]: undefined;
  [Paths.Profile]: undefined;
};
