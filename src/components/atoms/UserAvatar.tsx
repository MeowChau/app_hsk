import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Rect, Circle, Path } from 'react-native-svg';

export interface UserAvatarProps {
  size?: number;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const UserAvatar = ({
  size = 32,
  backgroundColor = '#F3E8FF',
  style,
}: UserAvatarProps) => {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Rect fill="#FDF4FF" height="100" width="100" />
        <Circle cx="50" cy="46" fill="#3E2723" r="28" />
        <Circle cx="50" cy="50" fill="#FFDFC4" r="20" />
        <Path
          d="M32 40c4-10 14-16 26-14 8 2 14 8 16 16-4-2-9-2-14 1-5 3-10 3-14-1-6-1-10 0-14-2z"
          fill="#2D1B16"
        />
        <Circle cx="44" cy="50" fill="#2D1B16" r="3.5" />
        <Circle cx="56" cy="50" fill="#2D1B16" r="3.5" />
        <Path d="M26 88c2-12 12-18 24-18s22 6 24 18z" fill="#374151" />
      </Svg>
    </View>
  );
};

export default UserAvatar;
