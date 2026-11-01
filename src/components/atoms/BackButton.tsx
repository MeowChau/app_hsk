import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme';
import IconButton from './IconButton';

interface BackButtonProps extends TouchableOpacityProps {}

const BackButton = ({ style, ...props }: BackButtonProps) => {
  const { colors } = useTheme();

  return (
    <IconButton
      accessibilityLabel="Quay lại"
      style={style}
      {...props}
      renderIcon={(size) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M19 12H5M12 19l-7-7 7-7"
            stroke={colors.primary}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    />
  );
};

export default BackButton;
