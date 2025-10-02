import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { role } = useAuth();
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
        name="home"
        options={{
          title: 'Sản phẩm',
          tabBarIcon: ({ color }) => <Ionicons name="bag" color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="Cart"
        options={{
          title: 'Giỏ hàng',
          tabBarIcon: ({ color }) => <Ionicons name="cart" color={color} size={28} />,
        }}
      />
      {/* Tab chỉ cho admin */}
      {role === 'admin' && (
        <Tabs.Screen
          name="DeliveryAdmin"
          options={{
            title: 'Đơn hàng',
            tabBarIcon: ({ color }) => <Ionicons name="list" color={color} size={28} />,
          }}
        />
      )}
      <Tabs.Screen
        name="AccountInfo"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color }) => <Ionicons name="person" color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}