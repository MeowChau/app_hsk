import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, Text, ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/theme';
import { IconByVariant } from '@/components/atoms';
import type { IconPaths } from '@/theme/assets/icons';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'outline' | 'text';
  loading?: boolean;
  icon?: IconPaths;
  fullWidth?: boolean;
}

const Button = ({
  title,
  variant = 'primary',
  loading = false,
  icon,
  fullWidth = false,
  style,
  disabled,
  ...props
}: ButtonProps) => {
  const { colors, layout } = useTheme();

  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isText = variant === 'text';

  const getBackgroundColor = () => {
    if (disabled) return colors.gray100;
    if (isPrimary) return colors.primary;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.gray400;
    if (isPrimary) return '#FFFFFF';
    return colors.primary;
  };

  const getBorder = () => {
    if (isOutline) {
      return { borderWidth: 1, borderColor: disabled ? colors.gray100 : colors.primary };
    }
    return {};
  };

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        layout.row,
        layout.itemsCenter,
        layout.justifyCenter,
        {
          minHeight: 47,
          borderRadius: 54,
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: getBackgroundColor(),
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        getBorder(),
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : colors.primary} />
      ) : (
        <>
          {icon && (
            <View style={{ marginRight: 8 }}>
              <IconByVariant path={icon} stroke={getTextColor()} />
            </View>
          )}
          <Text
            style={{
              color: getTextColor(),
              fontSize: 16,
              fontWeight: '600',
            }}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;
