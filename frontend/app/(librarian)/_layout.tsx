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

export default function LibrarianTabLayout() {
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
        },
        headerStyle: {
          backgroundColor: themeColors.surface,
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
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Books',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          headerLeft: () => (
            <Pressable onPress={() => router.push('/(librarian)')} style={{ marginLeft: 15 }}>
              <FontAwesome name="arrow-left" size={20} color={themeColors.primary} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color }) => <TabBarIcon name="inbox" color={color} />,
          headerLeft: () => (
            <Pressable onPress={() => router.push('/(librarian)')} style={{ marginLeft: 15 }}>
              <FontAwesome name="arrow-left" size={20} color={themeColors.primary} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="borrowed"
        options={{
          title: 'Loans',
          tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color} />,
          headerLeft: () => (
            <Pressable onPress={() => router.push('/(librarian)')} style={{ marginLeft: 15 }}>
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
            <Pressable onPress={() => router.push('/(librarian)')} style={{ marginLeft: 15 }}>
              <FontAwesome name="arrow-left" size={20} color={themeColors.primary} />
            </Pressable>
          ),
        }}
      />
    </Tabs>
    <NotificationPopup visible={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  );
}
