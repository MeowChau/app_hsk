import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme';

interface BackButtonProps extends TouchableOpacityProps {}

const BackButton = ({ style, ...props }: BackButtonProps) => {
  const { colors, layout } = useTheme();

  return (
    <TouchableOpacity
      style={[
        layout.itemsCenter,
        layout.justifyCenter,
        {
          width: 45,
          height: 45,
          backgroundColor: 'transparent',
        },
        style,
      ]}
      {...props}
    >
      <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
        <Path
          d="M19 12H5M12 19l-7-7 7-7"
          stroke={colors.primary}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
};

export default BackButton;
