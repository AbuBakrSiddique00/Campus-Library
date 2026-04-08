import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import Colors from '../../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import NotificationPopup from '../../components/NotificationPopup';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function StudentTabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: themeColors.surface,
          borderTopColor: themeColors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerStyle: {
          backgroundColor: themeColors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: themeColors.border,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: themeColors.text,
        },
        headerTintColor: themeColors.primary,
        headerRight: () => (
          <Pressable onPress={() => setShowNotifications(true)} style={{ marginRight: 15 }}>
            <FontAwesome name="bell" size={20} color={themeColors.primary} />
          </Pressable>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false, // The dashboard uses its own custom padded scroll layout
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          headerLeft: () => (
            <Pressable onPress={() => router.push('/(student)')} style={{ marginLeft: 15 }}>
              <FontAwesome name="arrow-left" size={20} color={themeColors.primary} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="loan"
        options={{
          title: 'My Books',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          headerLeft: () => (
            <Pressable onPress={() => router.push('/(student)')} style={{ marginLeft: 15 }}>
              <FontAwesome name="arrow-left" size={20} color={themeColors.primary} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="exchange"
        options={{
          title: 'Exchange',
          tabBarIcon: ({ color }) => <TabBarIcon name="exchange" color={color} />,
          headerLeft: () => (
            <Pressable onPress={() => router.push('/(student)')} style={{ marginLeft: 15 }}>
              <FontAwesome name="arrow-left" size={20} color={themeColors.primary} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerLeft: () => (
            <Pressable onPress={() => router.push('/(student)')} style={{ marginLeft: 15 }}>
              <FontAwesome name="arrow-left" size={20} color={themeColors.primary} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="detail/[id]"
        options={{
          href: null, // Hides this from the tab bar
          title: 'Details',
          headerShown: true, // We still want a header mapping the back button
        }}
      />
    </Tabs>
    <NotificationPopup visible={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
}
