import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Paths } from '@/navigation/paths';
import { BottomTabBar } from '@/components/organisms/BottomTabBar';

import { HomeContent } from '@/screens/Home/HomeContent';
import { EducationContent } from '@/screens/Education/Education';
import { GameContent } from '@/screens/Game/Game';
import { StatisticsContent } from '@/screens/Statistics/Statistics';
import { ProfileContent } from '@/screens/Profile/Profile';

import type { RootTabParamList } from '@/navigation/types';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={Paths.Home}
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props: BottomTabBarProps) => {
        // Map current route name to TabKeys required by our custom BottomTabBar
        const routeName = props.state.routes[props.state.index].name;
        
        let activeTab: 'home' | 'learn' | 'game' | 'stats' | 'profile' = 'home';
        if (routeName === Paths.Learn) activeTab = 'learn';
        else if (routeName === Paths.Game) activeTab = 'game';
        else if (routeName === Paths.Statistics) activeTab = 'stats';
        else if (routeName === Paths.Profile) activeTab = 'profile';

        return (
          <BottomTabBar
            activeTab={activeTab}
            onTabChange={(tab) => {
              let targetRoute: Paths = Paths.Home;
              if (tab === 'learn') targetRoute = Paths.Learn;
              else if (tab === 'game') targetRoute = Paths.Game;
              else if (tab === 'stats') targetRoute = Paths.Statistics;
              else if (tab === 'profile') targetRoute = Paths.Profile;
              
              if (tab === 'game') {
                props.navigation.navigate(targetRoute, { targetView: 'main', timestamp: Date.now() });
              } else {
                props.navigation.navigate(targetRoute);
              }
            }}
          />
        );
      }}
    >
      <Tab.Screen 
        name={Paths.Home} 
        children={(props) => (
          <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <HomeContent 
              onSwitchTab={(tab, params) => {
                let targetRoute: Paths = Paths.Home;
                if (tab === 'learn') targetRoute = Paths.Learn;
                else if (tab === 'game') targetRoute = Paths.Game;
                else if (tab === 'stats') targetRoute = Paths.Statistics;
                else if (tab === 'profile') targetRoute = Paths.Profile;
                props.navigation.navigate(targetRoute, params as any);
              }}
              onNavigateToProfile={() => props.navigation.navigate(Paths.Profile)} 
            />
          </View>
        )}
      />
      <Tab.Screen name={Paths.Learn} component={EducationContent} />
      <Tab.Screen 
        name={Paths.Game} 
        component={GameContent} 
      />
      <Tab.Screen name={Paths.Statistics} component={StatisticsContent} />
      <Tab.Screen 
        name={Paths.Profile} 
        children={(props) => <ProfileContent onLogout={() => props.navigation.getParent()?.navigate(Paths.Login)} />} 
      />
    </Tab.Navigator>
  );
}
