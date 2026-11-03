import type { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import IconButton from '@/components/atoms/IconButton';
import { ScreenHeader } from '@/components/molecules';
import { ms, useControlSizes, useTheme } from '@/theme';

type Props = {
  title: string;
  subtitle: string;
  onBack: () => void;
  onOpenGrid: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  disabled?: boolean;
  timer?: ReactNode;
};

export function PracticeHeader({
  title,
  subtitle,
  onBack,
  onOpenGrid,
  onSubmit,
  submitLabel = 'Nộp bài',
  disabled,
  timer,
}: Props) {
  const { colors } = useTheme();
  const sizes = useControlSizes();
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray100,
      }}
    >
      <ScreenHeader
        title={title}
        subtitle={subtitle}
        titleNumberOfLines={2}
        titleColor={colors.gray800}
        titleStyle={{ fontSize: ms(17) }}
        onBack={onBack}
        rightElement={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            {timer ? (
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: colors.secondary,
                  borderRadius: ms(6),
                  flexShrink: 0,
                  minWidth: ms(54),
                  paddingHorizontal: ms(8),
                  paddingVertical: ms(4),
                }}
              >
                {timer}
              </View>
            ) : null}
            <IconButton
              accessibilityLabel="Danh sách câu hỏi"
              onPress={onOpenGrid}
              renderIcon={(size, color) => (
                <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                  {[
                    [3, 3],
                    [14, 3],
                    [3, 14],
                    [14, 14],
                  ].map(([x, y]) => (
                    <Rect
                      key={`${x}-${y}`}
                      x={x}
                      y={y}
                      width="7"
                      height="7"
                      rx="1"
                      stroke={color}
                      strokeWidth="1.8"
                    />
                  ))}
                </Svg>
              )}
            />
            <TouchableOpacity
              accessibilityRole="button"
              disabled={disabled}
              onPress={onSubmit}
              style={{
                minHeight: sizes.touchTarget,
                paddingHorizontal: 10,
                borderRadius: ms(8),
                backgroundColor: colors.primaryAction,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <Text
                style={{
                  fontSize: ms(14),
                  fontWeight: '700',
                  color: colors.onPrimary,
                }}
              >
                {submitLabel}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
