import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';

export default function LibrarianDashboard() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: any, color: string }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <FontAwesome name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome Back,</Text>
        <Text style={[styles.title, { color: colors.text }]}>Admin Dashboard</Text>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <StatCard title="Total Books" value="1,245" icon="book" color={colors.primary} />
          <StatCard title="Active Loans" value="132" icon="list-alt" color={colors.secondary} />
        </View>
        <View style={styles.gridRow}>
          <StatCard title="Pending Requests" value="18" icon="inbox" color={colors.error} />
          <StatCard title="Overdue" value="7" icon="exclamation-triangle" color={colors.error} />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
      
      <Pressable 
        style={[styles.actionBtn, { backgroundColor: colors.surface }]}
        onPress={() => router.push('/(librarian)/add')}
      >
        <FontAwesome name="plus" size={20} color={colors.primary} style={styles.actionIcon} />
        <Text style={[styles.actionText, { color: colors.text }]}>Add New Book to Catalog</Text>
      </Pressable>

      <Pressable 
        style={[styles.actionBtn, { backgroundColor: colors.surface }]}
        onPress={() => router.push('/(librarian)/requests')}
      >
        <FontAwesome name="check-square-o" size={20} color={colors.primary} style={styles.actionIcon} />
        <Text style={[styles.actionText, { color: colors.text }]}>Approve Student Requests</Text>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 24,
    paddingTop: 32,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  gridContainer: {
    padding: 16,
    gap: 16,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  }
});
