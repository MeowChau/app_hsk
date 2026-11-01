// @refresh reset
import { memo, useCallback, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type {
  BottomTabBarProps,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { TabActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Paths } from '@/navigation/paths';
import type { RootTabParamList } from '@/navigation/types';
import { BottomTabBar } from '@/components/organisms/BottomTabBar';
import { SafeScreen } from '@/components/templates';
import { HomeContent } from '@/screens/Home/Home';
import type { HomeContentProps } from '@/screens/Home/Home';
import { EducationContent } from '@/screens/Education/Education';
import { GameContent } from '@/screens/Game/Game';
import { StatisticsContent } from '@/screens/Statistics/Statistics';
import { ProfileContent } from '@/screens/Profile/Profile';
import { ms, vs, useTheme } from '@/theme';
import { usePreloadTabs } from './usePreloadTabs';
import { TAB_ITEMS } from './tabItems';
import { TabLeaveGuardContext } from './tabLeaveGuard';
import type { TabLeaveGuard } from './tabLeaveGuard';

const Tab = createBottomTabNavigator<RootTabParamList>();
const renderTabBar = (props: BottomTabBarProps) => <BottomTabBar {...props} />;
const HomeScene = memo(HomeContent);
const ProfileScene = memo(ProfileContent);
const LearnScene = memo(EducationContent);
const GameScene = memo(GameContent);
const StatisticsScene = memo(StatisticsContent);

function HomeTabScreen({
  navigation,
}: BottomTabScreenProps<RootTabParamList, Paths.Home>) {
  const { colors } = useTheme();
  usePreloadTabs(navigation);
  const switchTab = useCallback<HomeContentProps['onSwitchTab']>(
    (tab, params) => {
      switch (tab) {
        case 'learn':
          navigation.navigate(Paths.Learn, params);
          break;
        case 'game':
          navigation.navigate(Paths.Game, params);
          break;
        case 'stats':
          navigation.navigate(Paths.Statistics);
          break;
        case 'profile':
          navigation.navigate(Paths.Profile);
          break;
        default:
          navigation.navigate(Paths.Home);
      }
    },
    [navigation],
  );
  const openProfile = useCallback(
    () => navigation.navigate(Paths.Profile),
    [navigation],
  );
  return (
    <SafeScreen
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: colors.surface }}
    >
      <HomeScene onSwitchTab={switchTab} onNavigateToProfile={openProfile} />
    </SafeScreen>
  );
}

function ProfileTabScreen({
  navigation,
}: BottomTabScreenProps<RootTabParamList, Paths.Profile>) {
  const { colors } = useTheme();
  const logout = useCallback(
    () => navigation.getParent()?.navigate(Paths.Login),
    [navigation],
  );
  return (
    <SafeScreen
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: colors.surface }}
    >
      <ProfileScene onLogout={logout} />
    </SafeScreen>
  );
}

export function BottomTabNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const leaveGuard = useRef<TabLeaveGuard | null>(null);
  const registerGuard = useCallback((guard: TabLeaveGuard) => {
    leaveGuard.current = guard;
    return () => {
      if (leaveGuard.current === guard) leaveGuard.current = null;
    };
  }, []);
  return (
    <TabLeaveGuardContext.Provider value={registerGuard}>
      <Tab.Navigator
        initialRouteName={Paths.Home}
        backBehavior="history"
        tabBar={renderTabBar}
        screenListeners={({ navigation, route }) => ({
          tabPress: (event) => {
            const state = navigation.getState();
            if (
              state.routes[state.index].key === route.key ||
              !leaveGuard.current
            )
              return;
            event.preventDefault();
            leaveGuard.current(() =>
              navigation.dispatch({
                ...TabActions.jumpTo(route.name),
                target: state.key,
              }),
            );
          },
        })}
        screenOptions={({ route }) => ({
          headerShown: false,
          lazy: true,
          // Lesson timers and PK must still render their focus/blur cleanup.
          freezeOnBlur: route.name !== Paths.Learn && route.name !== Paths.Game,
          animation: 'none',
          sceneStyle: { backgroundColor: colors.surface },
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.gray200,
          tabBarAccessibilityLabel: TAB_ITEMS[route.name].label,
          tabBarButtonTestID: `tab-${route.name}`,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.gray100,
            borderTopWidth: 1,
            height: ms(48) + vs(8) + insets.bottom,
            paddingTop: vs(4),
            paddingBottom: vs(4) + insets.bottom,
            elevation: 0,
            shadowOpacity: 0,
          },
        })}
      >
        <Tab.Screen name={Paths.Home} component={HomeTabScreen} />
        <Tab.Screen name={Paths.Learn} component={LearnScene} />
        <Tab.Screen name={Paths.Game} component={GameScene} />
        <Tab.Screen name={Paths.Statistics} component={StatisticsScene} />
        <Tab.Screen name={Paths.Profile} component={ProfileTabScreen} />
      </Tab.Navigator>
    </TabLeaveGuardContext.Provider>
  );
}
