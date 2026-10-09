import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';

import { Example, Login, Onboarding, Register, Startup, Survey, ForgotPassword, ResetPassword } from '@/screens';
import { BottomTabNavigator } from '@/navigation/BottomTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

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
    'http://192.168.1.7:3001',
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
    return undefined;
  },
};

function ApplicationNavigator() {
  const { navigationTheme } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking} theme={navigationTheme}>
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
          <Stack.Screen component={BottomTabNavigator} name={Paths.MainTabs} />
          <Stack.Screen component={Startup} name={Paths.Startup} />
          <Stack.Screen component={Onboarding} name={Paths.Onboarding} />
          <Stack.Screen component={Login} name={Paths.Login} />
          <Stack.Screen component={Register} name={Paths.Register} />
          <Stack.Screen component={Survey} name={Paths.Survey} />
          <Stack.Screen component={ForgotPassword} name={Paths.ForgotPassword} />
          <Stack.Screen component={ResetPassword} name={Paths.ResetPassword} />
          <Stack.Screen component={Example} name={Paths.Example} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
