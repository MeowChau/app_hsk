import { memo, useCallback, useEffect, useState } from 'react';
import { Animated, Keyboard, Platform, Pressable } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TabActions } from '@react-navigation/native';
import IconByVariant from '@/components/atoms/IconByVariant/IconByVariant';
import { TAB_ITEMS } from '@/navigation/tabItems';
import { ms, useTheme, vs } from '@/theme';

const TabIcon = memo(IconByVariant);
const TabButton = memo(function TabButton({
  routeKey,
  icon,
  label,
  testID,
  selected,
  color,
  rippleColor,
  onSelect,
  onLongPress,
}: {
  routeKey: string;
  icon: string;
  label: string;
  testID?: string;
  selected: boolean;
  color: string;
  rippleColor: string;
  onSelect: (key: string) => void;
  onLongPress: (key: string) => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      testID={testID}
      onPress={() => onSelect(routeKey)}
      onLongPress={() => onLongPress(routeKey)}
      android_ripple={{ color: rippleColor, borderless: false }}
      style={{
        flex: 1,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <TabIcon path={icon} color={color} />
    </Pressable>
  );
});

export const BottomTabBar = memo(function BottomTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  const [keyboardVisible, setKeyboardVisible] = useState(() =>
    Keyboard.isVisible(),
  );
  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  const select = useCallback(
    (key: string) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: key,
        canPreventDefault: true,
      });
      const current = navigation.getState();
      const route = current.routes.find((item) => item.key === key);
      if (
        !route ||
        event.defaultPrevented ||
        current.routes[current.index].key === key
      )
        return;
      navigation.dispatch({
        ...TabActions.jumpTo(route.name, route.params),
        target: current.key,
      });
    },
    [navigation],
  );
  const longPress = useCallback(
    (key: string) => {
      navigation.emit({ type: 'tabLongPress', target: key });
    },
    [navigation],
  );
  const options = descriptors[state.routes[state.index].key].options;
  if (keyboardVisible && options.tabBarHideOnKeyboard) return null;
  return (
    <Animated.View
      role="tablist"
      style={[
        {
          flexDirection: 'row',
          backgroundColor: colors.surface,
          borderTopColor: colors.gray100,
          borderTopWidth: 1,
          height: ms(48) + vs(8) + insets.bottom,
          paddingTop: vs(4),
          paddingBottom: vs(4) + insets.bottom,
        },
        options.tabBarStyle,
      ]}
    >
      {state.routes.map((route, index) => {
        const tab = TAB_ITEMS[route.name as keyof typeof TAB_ITEMS];
        if (!tab) return null;
        const descriptor = descriptors[route.key].options;
        return (
          <TabButton
            key={route.key}
            routeKey={route.key}
            icon={tab.icon}
            label={descriptor.tabBarAccessibilityLabel ?? tab.label}
            testID={descriptor.tabBarButtonTestID}
            selected={index === state.index}
            color={
              index === state.index
                ? (descriptor.tabBarActiveTintColor ?? colors.primary)
                : (descriptor.tabBarInactiveTintColor ?? colors.gray200)
            }
            rippleColor={colors.gray100}
            onSelect={select}
            onLongPress={longPress}
          />
        );
      })}
    </Animated.View>
  );
});
