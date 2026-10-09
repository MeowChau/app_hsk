import type { RootScreenProps } from '@/navigation/types';

import { useEffect } from 'react';
import { View } from 'react-native';

import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';
import { SafeScreen } from '@/components/templates';
import { hasCompletedSurvey, isAuthenticated } from '@/services/storage';

function Startup({ navigation }: RootScreenProps<Paths.Startup>) {
  const { layout } = useTheme();

  useEffect(() => {
    // 1. Nếu đã đăng nhập -> vào thẳng màn hình chính (MainTabs)
    if (isAuthenticated()) {
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.MainTabs }],
      });
      return;
    }

    // 2. Nếu là lần đầu vào app (chưa hoàn thành survey) -> vào màn Survey
    if (!hasCompletedSurvey()) {
      navigation.reset({
        index: 0,
        routes: [{ name: Paths.Survey }],
      });
      return;
    }

    // 3. Nếu đã làm survey nhưng chưa đăng nhập -> vào màn Onboarding
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
