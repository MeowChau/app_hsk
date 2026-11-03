import React from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { BackButton } from '@/components/atoms';
import { ms, hs, vs } from '@/theme';

export interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  variant?: 'detail' | 'page';
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleColor?: string;
  titleStyle?: StyleProp<TextStyle>;
  titleNumberOfLines?: number;
}

export const ScreenHeader = ({
  title,
  subtitle,
  onBack,
  variant = 'detail',
  rightElement,
  style,
  titleColor = '#111827',
  titleStyle,
  titleNumberOfLines,
}: ScreenHeaderProps) => {
  const isPage = variant === 'page';
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: hs(16),
          paddingTop: vs(isPage ? 16 : 8),
          paddingBottom: vs(isPage ? 16 : 12),
        },
        style,
      ]}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
          minWidth: 0,
        }}
      >
        {onBack ? <BackButton
          onPress={onBack}
          style={{ marginRight: hs(8), marginLeft: hs(-6) }}
        /> : null}
        {title ? (
          <View style={{ flex: 1 }}>
            <Text
              accessibilityRole="header"
              numberOfLines={titleNumberOfLines ?? (isPage ? undefined : 1)}
              style={[
                {
                  fontSize: ms(isPage ? 28 : 20),
                  ...(isPage ? { lineHeight: ms(36) } : {}),
                  fontWeight: '800',
                  color: titleColor,
                },
                titleStyle,
              ]}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={{
                  fontSize: ms(isPage ? 16 : 14),
                  ...(isPage ? { lineHeight: ms(22) } : {}),
                  color: '#4B5563',
                  fontWeight: isPage ? '400' : '500',
                  marginTop: vs(isPage ? 4 : 2),
                }}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
      {rightElement ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {rightElement}
        </View>
      ) : null}
    </View>
  );
};

export default ScreenHeader;
