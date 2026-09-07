import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme';

import { Example, Home, Login, Onboarding, Register, Startup, Statistics, Profile } from '@/screens';

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

function ApplicationNavigator() {
  const { navigationTheme } = useTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
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
          <Stack.Screen component={Home} name={Paths.Home} />
          <Stack.Screen component={Startup} name={Paths.Startup} />
          <Stack.Screen component={Onboarding} name={Paths.Onboarding} />
          <Stack.Screen component={Login} name={Paths.Login} />
          <Stack.Screen component={Register} name={Paths.Register} />
          <Stack.Screen component={Statistics} name={Paths.Statistics} />
          <Stack.Screen component={Profile} name={Paths.Profile} />
          <Stack.Screen component={Example} name={Paths.Example} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default ApplicationNavigator;
