import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';

const MOCK_LOANS = [
  {
    id: '1',
    title: 'Data Structures and Algorithms',
    borrowDate: '2026-04-01',
    returnDate: '2026-04-10',
    status: 'Active',
    type: 'book',
    author: 'Thomas H. Cormen',
    available: 1,
    totalCopies: 4,
    location: 'Shelf C - Row 1',
    description: 'Classic reference on algorithm design, analysis, and core data structures.',
  },
  {
    id: '2',
    title: 'Introduction to Mechanics',
    borrowDate: '2026-03-15',
    returnDate: '2026-03-30',
    status: 'Overdue',
    type: 'book',
    author: 'Kleppner & Kolenkow',
    available: 0,
    totalCopies: 3,
    location: 'Shelf D - Row 2',
    description: 'Mechanics fundamentals with rigorous problem-based explanations.',
  },
];

export default function LoanScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(student)/detail/[id]',
          params: {
            id: item.id,
            type: item.type,
            title: item.title,
            author: item.author,
            available: String(item.available),
            totalCopies: String(item.totalCopies),
            location: item.location,
            description: item.description,
          },
        })
      }
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.cardHeader}>
        <FontAwesome name="book" size={24} color={colors.primary} />
        <View style={[
          styles.badge, 
          { backgroundColor: item.status === 'Overdue' ? colors.error + '20' : colors.success + '20' }
        ]}>
          <Text style={{ color: item.status === 'Overdue' ? colors.error : colors.success, ...styles.badgeText }}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
      
      <View style={styles.dateRow}>
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>Borrowed: {item.borrowDate}</Text>
        <Text style={[styles.dateText, { color: item.status === 'Overdue' ? colors.error : colors.text }]}>
          Due: {item.returnDate}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={MOCK_LOANS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>You have no active loans.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { padding: 16 },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  }
});
