import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import IconButton from '@/components/atoms/IconButton';
import { useAudioPlayback, audioTime } from '@/services/audio/AudioProvider';
import { ms, useControlSizes, useTheme } from '@/theme';

export function QuestionAudioPlayer({
  url,
  label,
  seekable = false,
}: {
  url?: string | null;
  label: string;
  seekable?: boolean;
}) {
  const audio = useAudioPlayback(url);
  const { colors } = useTheme();
  const sizes = useControlSizes();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        minWidth: 0,
        gap: 4,
      }}
    >
      <IconButton
        accessibilityLabel={`${audio.playing ? 'Tạm dừng' : 'Phát'} audio ${label}`}
        accessibilityState={{ busy: audio.loading }}
        onPress={audio.toggle}
        style={{
          backgroundColor: colors.accentLightBlue,
          borderRadius: sizes.touchTarget / 2,
        }}
        color={colors.dialogAction}
        renderIcon={(size, color) =>
          audio.loading ? (
            <ActivityIndicator color={color} size="small" />
          ) : (
            <Svg width={size} height={size} viewBox="0 0 24 24">
              <Path
                d={
                  audio.playing
                    ? 'M6 4h4v16H6zM14 4h4v16h-4z'
                    : 'M7 4l13 8-13 8V4z'
                }
                fill={color}
              />
            </Svg>
          )
        }
      />
      <View style={{ flex: 1, minWidth: 0, gap: 6, paddingHorizontal: 4 }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: ms(12),
            color: colors.dialogAction,
            fontVariant: ['tabular-nums'],
          }}
        >
          {audioTime(audio.position)} / {audioTime(audio.duration)}
        </Text>
        <View
          style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.gray100,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: `${audio.progress}%`,
              height: '100%',
              backgroundColor: colors.dialogAction,
            }}
          />
        </View>
      </View>
      {seekable
        ? [-5, 5].map((offset) => (
            <TouchableOpacity
              key={offset}
              accessibilityRole="button"
              accessibilityLabel={`${offset < 0 ? 'Lùi' : 'Tiến'} 5 giây audio ${label}`}
              disabled={!audio.duration}
              onPress={() => audio.seek(offset)}
              style={{
                minWidth: sizes.touchTarget,
                minHeight: sizes.touchTarget,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: audio.duration ? 1 : 0.45,
              }}
            >
              <Text
                style={{
                  fontSize: ms(12),
                  color: colors.dialogAction,
                  fontWeight: '600',
                }}
              >
                {offset > 0 ? '+' : ''}
                {offset}s
              </Text>
            </TouchableOpacity>
          ))
        : null}
    </View>
  );
}
