import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" color={color} size={28} />,
        }}
      />

      <Tabs.Screen
        name="ProductDetails"
        options={{
          title: 'Chi tiết',
          tabBarIcon: ({ color }) => <IconSymbol name="info.circle.fill" color={color} size={28} />,
        }}
      />

      <Tabs.Screen
        name="Cart"
        options={{
          title: 'Giỏ hàng',
          tabBarIcon: ({ color }) => <IconSymbol name="cart.fill" color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}