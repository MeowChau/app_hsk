import { Text } from 'react-native';
import { ms, useTheme } from '@/theme';

export default function PopupCloseIcon() {
  const { colors } = useTheme();
  return (
    <Text
      style={{
        fontSize: ms(24),
        color: colors.dialogText,
        fontWeight: '700',
        lineHeight: ms(24),
      }}
    >
      ×
    </Text>
  );
}
