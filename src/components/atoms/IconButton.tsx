import type { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import type { TouchableOpacityProps } from 'react-native';
import { useControlSizes, useTheme } from '@/theme';

type Props = TouchableOpacityProps & {
  accessibilityLabel: string;
  color?: string;
  renderIcon: (size: number, color: string) => ReactNode;
};

export default function IconButton({
  renderIcon,
  color,
  style,
  ...props
}: Props) {
  const { colors } = useTheme();
  const sizes = useControlSizes();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.7}
      {...props}
      style={[
        {
          width: sizes.touchTarget,
          height: sizes.touchTarget,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        },
        style,
      ]}
    >
      {renderIcon(sizes.icon, color ?? colors.gray400)}
    </TouchableOpacity>
  );
}
