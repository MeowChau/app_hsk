import React from 'react';

import { SafeScreen } from '@/components/templates';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';

import { HomeContent } from '@/screens/Home/HomeContent';

function Home({ navigation }: RootScreenProps<Paths.Home>) {
  return (
    <SafeScreen style={{ backgroundColor: '#FFFFFF' }}>
      <HomeContent 
        onSwitchTab={(tab, params) => {
          if (tab === 'learn') navigation.navigate(Paths.Learn, params as any);
          else if (tab === 'game') navigation.navigate(Paths.Game, params as any);
          else if (tab === 'stats') navigation.navigate(Paths.Statistics, params as any);
          else if (tab === 'profile') navigation.navigate(Paths.Profile, params as any);
          else navigation.navigate(Paths.Home, params as any);
        }}
        onNavigateToProfile={() => navigation.navigate(Paths.Profile)} 
      />
    </SafeScreen>
  );
}

export default Home;
