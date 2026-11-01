import Svg, { Path } from 'react-native-svg';
import IconButton from '@/components/atoms/IconButton';
import { useTheme } from '@/theme';

export function PracticeBookmarkButton({
  index,
  selected,
  onPress,
}: {
  index: number;
  selected?: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <IconButton
      accessibilityLabel={`${selected ? 'Bỏ đánh dấu' : 'Đánh dấu'} câu ${index}`}
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      color={selected ? colors.primary : colors.gray400}
      renderIcon={(size, color) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"
            fill={selected ? color : 'none'}
            stroke={color}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    />
  );
}
