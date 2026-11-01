import { Text, View } from 'react-native';
import { ms, useTheme, vs } from '@/theme';
import { QuestionAudioPlayer } from './QuestionAudioPlayer';

export function SharedAudioHeader({
  url,
  label,
  onHeight,
}: {
  url: string;
  label: string;
  onHeight: (height: number) => void;
}) {
  const { colors } = useTheme();
  return (
    <View
      onLayout={(event) => onHeight(event.nativeEvent.layout.height)}
      style={{ backgroundColor: colors.secondary, paddingBottom: vs(10) }}
    >
      <View
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.gray100,
          borderWidth: 1,
          borderRadius: ms(12),
          padding: ms(12),
          gap: vs(6),
        }}
      >
        <Text
          accessibilityRole="header"
          style={{ fontSize: ms(13), fontWeight: '700', color: colors.dialogAction }}
        >
          Audio dùng chung · {label}
        </Text>
        <QuestionAudioPlayer
          url={url}
          label={`chung ${label.toLowerCase()}`}
          seekable
        />
      </View>
    </View>
  );
}

export function SharedAudioEnd() {
  const { colors } = useTheme();
  return <View style={{ height: 1, backgroundColor: colors.secondary }} />;
}
