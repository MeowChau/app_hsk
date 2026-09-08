import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme, vs } from '@/theme';
import IconByVariant from '@/components/atoms/IconByVariant/IconByVariant';

type TabKeys = 'home' | 'learn' | 'game' | 'stats' | 'profile';

interface BottomTabBarProps {
  activeTab: TabKeys;
  onTabChange: (tab: TabKeys) => void;
}

export const BottomTabBar = ({ activeTab, onTabChange }: BottomTabBarProps) => {
  const { layout } = useTheme();

  const getIconColor = (tab: TabKeys) => (activeTab === tab ? '#0E84F2' : '#9E9E9E');

  return (
    <View
      style={[
        layout.row,
        layout.justifyAround,
        {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EEEEEE',
          borderTopWidth: 1,
          paddingBottom: vs(8),
          paddingTop: vs(8),
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        delayPressIn={0}
        onPress={() => onTabChange('home')}
        style={[layout.itemsCenter, layout.flex_1, { paddingVertical: vs(4) }]}
      >
        <IconByVariant path="home" color={getIconColor('home')} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        delayPressIn={0}
        onPress={() => onTabChange('learn')}
        style={[layout.itemsCenter, layout.flex_1, { paddingVertical: vs(4) }]}
      >
        <IconByVariant path="learn" color={getIconColor('learn')} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        delayPressIn={0}
        onPress={() => onTabChange('game')}
        style={[layout.itemsCenter, layout.flex_1, { paddingVertical: vs(4) }]}
      >
        <IconByVariant path="game" color={getIconColor('game')} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        delayPressIn={0}
        onPress={() => onTabChange('stats')}
        style={[layout.itemsCenter, layout.flex_1, { paddingVertical: vs(4) }]}
      >
        <IconByVariant path="stats" color={getIconColor('stats')} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        delayPressIn={0}
        onPress={() => onTabChange('profile')}
        style={[layout.itemsCenter, layout.flex_1, { paddingVertical: vs(4) }]}
      >
        <IconByVariant path="profile" color={getIconColor('profile')} />
      </TouchableOpacity>
    </View>
  );
};
