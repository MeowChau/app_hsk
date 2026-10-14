import type { RootScreenProps } from '@/navigation/types';

import { useEffect } from 'react';
import { View } from 'react-native';

import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';
import { SafeScreen } from '@/components/templates';
import { getUser, hasCompletedSurvey, isAuthenticated } from '@/services/storage';

function Startup({ navigation }: RootScreenProps<Paths.Startup>) {
  const { layout } = useTheme();

  useEffect(() => {
    // Resume an unfinished survey for the signed-in account.
    if (isAuthenticated()) {
      const user = getUser<{ id: number | string }>();
      navigation.reset({
        index: 0,
        routes: [
          {
            name:
              user?.id == null
                ? Paths.Login
                : hasCompletedSurvey(user.id)
                  ? Paths.MainTabs
                  : Paths.Survey,
          },
        ],
      });
      return;
    }

    // Guests register/login before seeing the account's survey.
    navigation.reset({
      index: 0,
      routes: [{ name: Paths.Onboarding }],
    });
  }, [navigation]);

  return (
    <SafeScreen style={{ backgroundColor: '#FFFFFF' }}>
      <View style={[layout.flex_1, { backgroundColor: '#FFFFFF' }]} />
    </SafeScreen>
  );
}

export default Startup;
