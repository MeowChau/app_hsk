import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { BackButton } from '@/components/atoms';
import { ms, hs, vs } from '@/theme';

export interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  onBack: () => void;
  rightElement?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleColor?: string;
}

export const ScreenHeader = ({
  title,
  subtitle,
  onBack,
  rightElement,
  style,
  titleColor = '#111827',
}: ScreenHeaderProps) => {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: hs(16),
          paddingTop: vs(8),
          paddingBottom: vs(12),
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <BackButton
          onPress={onBack}
          style={{ marginRight: hs(8), marginLeft: hs(-6) }}
        />
        {title ? (
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: ms(20),
                fontWeight: '800',
                color: titleColor,
              }}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={{
                  fontSize: ms(14),
                  color: '#4B5563',
                  fontWeight: '500',
                  marginTop: vs(2),
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
