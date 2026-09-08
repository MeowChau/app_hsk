import React from 'react';
import { View } from 'react-native';

import { SafeScreen } from '@/components/templates';
import { Paths } from '@/navigation/paths';
import type { RootScreenProps } from '@/navigation/types';

import { HomeContent } from '@/screens/Home/HomeContent';

function Home({ navigation }: RootScreenProps<Paths.Home>) {
  return (
    <SafeScreen style={{ backgroundColor: '#FFFFFF' }}>
      <HomeContent 
        onSwitchTab={(tab) => {
          let targetRoute: Paths = Paths.Home;
          if (tab === 'learn') targetRoute = Paths.Learn;
          else if (tab === 'game') targetRoute = Paths.Game;
          else if (tab === 'stats') targetRoute = Paths.Statistics;
          else if (tab === 'profile') targetRoute = Paths.Profile;
          navigation.navigate(targetRoute);
        }}
        onNavigateToProfile={() => navigation.navigate(Paths.Profile)} 
      />
    </SafeScreen>
  );
}

export default Home;
