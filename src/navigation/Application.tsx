import { NavigationContainer, createNavigationContainerRef, getStateFromPath } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';

import { Example, Login, Onboarding, Register, Startup, Survey, ForgotPassword, ResetPassword } from '@/screens';
import { BottomTabNavigator } from '@/navigation/BottomTabNavigator';
import { getAuthSessionVersion, isAuthenticated, subscribeAuthSession } from '@/services/storage';
import { API_ORIGIN } from '@/services/config';
import { AudioProvider } from '@/services/audio/AudioProvider';

const Stack = createStackNavigator<RootStackParamList>();
const navigationRef = createNavigationContainerRef<RootStackParamList>();

const instantTransitionSpec = {
  close: {
    animation: 'timing' as const,
    config: {
      duration: 0,
    },
  },
  open: {
    animation: 'timing' as const,
    config: {
      duration: 0,
    },
  },
};

const linking = {
  prefixes: [
    'tricehsk://',
    'apphsk://',
    API_ORIGIN,
  ],
  config: {
    screens: {
      [Paths.ResetPassword]: 'password-change',
      [Paths.Login]: 'login',
    },
  },
  getStateFromPath: (path: string, options: any) => {
    if (path.includes('reset-password') || path.includes('password-change')) {
      const queryString = path.includes('?') ? path.split('?')[1] : '';
      const params: Record<string, string> = {};
      if (queryString) {
        const searchParams = new URLSearchParams(queryString);
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
      }
      return {
        routes: [
          {
            name: Paths.ResetPassword,
            params,
          },
        ],
      };
    }
    return getStateFromPath(path, options);
  },
};

function ApplicationNavigator() {
  const { navigationTheme } = useTheme();
  const queryClient = useQueryClient();
  const [sessionVersion, setSessionVersion] = useState(getAuthSessionVersion);

  useEffect(() => subscribeAuthSession(() => {
    void queryClient.cancelQueries();
    queryClient.removeQueries();
    setSessionVersion(getAuthSessionVersion());
    if (!isAuthenticated() && navigationRef.isReady()) {
      navigationRef.resetRoot({ index: 0, routes: [{ name: Paths.Login }] });
    }
  }), [queryClient]);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} linking={linking} theme={navigationTheme}>
        <AudioProvider>
        <Stack.Navigator
          detachInactiveScreens={false}
          initialRouteName={Paths.Startup} //
          screenOptions={{
            animation: 'none',
            cardStyle: { backgroundColor: '#FFFFFF' },
            cardStyleInterpolator: () => ({ cardStyle: {} }),
            detachPreviousScreen: false,
            freezeOnBlur: false,
            headerShown: false,
            transitionSpec: instantTransitionSpec,
          }}
        >
          <Stack.Screen key={`tabs-${sessionVersion}`} component={BottomTabNavigator} name={Paths.MainTabs} />
          <Stack.Screen component={Startup} name={Paths.Startup} />
          <Stack.Screen component={Onboarding} name={Paths.Onboarding} />
          <Stack.Screen component={Login} name={Paths.Login} />
          <Stack.Screen component={Register} name={Paths.Register} />
          <Stack.Screen component={Survey} name={Paths.Survey} />
          <Stack.Screen component={ForgotPassword} name={Paths.ForgotPassword} />
          <Stack.Screen component={ResetPassword} name={Paths.ResetPassword} />
          <Stack.Screen component={Example} name={Paths.Example} />
        </Stack.Navigator>
        </AudioProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
