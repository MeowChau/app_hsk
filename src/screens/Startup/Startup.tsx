import type { RootScreenProps } from '@/navigation/types';

import { useEffect } from 'react';
import { View } from 'react-native';

import { Paths } from '@/navigation/paths';
import { useTheme } from '@/theme';
import { SafeScreen } from '@/components/templates';

function Startup({ navigation }: RootScreenProps<Paths.Startup>) {
  const { layout } = useTheme();

  useEffect(() => {
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
