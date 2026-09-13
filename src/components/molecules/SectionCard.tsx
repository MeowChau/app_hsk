import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { useTheme, hs, vs, ms } from '@/theme';

export interface SectionCardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
}

export const SectionCard = ({
  children,
  title,
  subtitle,
  icon,
  rightAction,
  style,
  containerStyle,
  headerStyle,
}: SectionCardProps) => {
  const { layout } = useTheme();

  return (
    <View style={[{ paddingHorizontal: hs(16), marginBottom: vs(16) }, containerStyle]}>
      <View
        style={[
          {
            backgroundColor: '#FFFFFF',
            borderColor: '#F0F2F5',
            borderRadius: ms(16),
            borderWidth: 1,
            elevation: 1.5,
            padding: ms(16),
            shadowColor: '#000',
            shadowOffset: { width: hs(0), height: vs(2) },
            shadowOpacity: 0.05,
            shadowRadius: 5,
          },
          style,
        ]}
      >
        {(title || icon || rightAction) ? (
          <View
            style={[
              layout.row,
              layout.justifyBetween,
              layout.itemsCenter,
              { marginBottom: vs(16) },
              headerStyle,
            ]}
          >
            <View style={[layout.row, layout.itemsCenter, { flex: 1 }]}>
              {icon ? (
                <View style={{ marginRight: hs(12) }}>
                  {icon}
                </View>
              ) : null}
              {title ? (
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#111827', fontSize: ms(16), fontWeight: '700' }}>
                    {title}
                  </Text>
                  {subtitle ? (
                    <Text style={{ color: '#6B7280', fontSize: ms(13), marginTop: vs(2) }}>
                      {subtitle}
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>
            {rightAction ? (
              <View style={[layout.row, layout.itemsCenter]}>
                {rightAction}
              </View>
            ) : null}
          </View>
        ) : null}
        {children}
      </View>
    </View>
  );
};

export default SectionCard;
