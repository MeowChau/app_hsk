import { Text } from 'react-native';
import { ms, useTheme } from '@/theme';

export default function InputError({ message }: { message?: string }) {
  const { colors } = useTheme();
  if (!message) return null;
  return (
    <Text
      accessibilityLiveRegion="polite"
      style={{
        color: colors.red500,
        fontSize: ms(12),
        lineHeight: ms(18),
        marginTop: ms(6),
      }}
    >
      {message}
    </Text>
  );
}
