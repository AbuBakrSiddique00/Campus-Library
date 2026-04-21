import AppLogo from '@/components/AppLogo';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import NotificationPopup from '../../components/NotificationPopup';
import Colors from '../../constants/Colors';

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
          fontWeight: '800',
          color: themeColors.text,
        },
        headerTitleAlign: 'center',
        headerLeftContainerStyle: {
          minWidth: 52,
        },
        headerRightContainerStyle: {
          minWidth: 52,
        },
        headerTitle: () => <AppLogo size="sm" />,
        headerTintColor: themeColors.primary,
        headerRight: () => (
          <Pressable
            onPress={() => setShowNotifications(true)}
            style={{
              marginRight: 14,
              width: 38,
              height: 38,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: themeColors.border,
              backgroundColor: themeColors.background,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <FontAwesome name="bell-o" size={18} color={themeColors.primary} />
            <View
              style={{
                position: 'absolute',
                top: 7,
                right: 7,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#EF4444',
              }}
            />
          </Pressable>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Books',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          headerLeft: () => (
            <Pressable onPress={() => router.push('/(librarian)')} style={{ marginLeft: 16, marginRight: 16, padding: 8 }}>
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
            <Pressable onPress={() => router.push('/(librarian)')} style={{ marginLeft: 16, marginRight: 16, padding: 8 }}>
              <FontAwesome name="arrow-left" size={20} color={themeColors.primary} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="request-detail"
        options={{
          href: null,
          title: 'Request Details',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="borrowed"
        options={{
          title: 'Loans',
          tabBarIcon: ({ color }) => <TabBarIcon name="list-alt" color={color} />,
          headerLeft: () => (
            <Pressable onPress={() => router.push('/(librarian)')} style={{ marginLeft: 16, marginRight: 16, padding: 8 }}>
              <FontAwesome name="arrow-left" size={20} color={themeColors.primary} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="loan-detail"
        options={{
          href: null,
          title: 'Loan Details',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="book-detail/[id]"
        options={{
          href: null,
          title: 'Book Details',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          headerLeft: () => (
            <Pressable onPress={() => router.push('/(librarian)')} style={{ marginLeft: 16, marginRight: 16, padding: 8 }}>
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
