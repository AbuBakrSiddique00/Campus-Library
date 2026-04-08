import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const MOCK_BORROWED = [
  { id: '1', student: 'Alice M.', roll: '101', book: 'Data Structures and Algorithms', due: '2026-04-10', status: 'Active' },
  { id: '2', student: 'Bob S.', roll: '105', book: 'Operating Systems', due: '2026-03-30', status: 'Overdue' },
];

export default function BorrowedScreen() {
  const [search, setSearch] = useState('');
  
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const filtered = MOCK_BORROWED.filter(r => 
    r.student.toLowerCase().includes(search.toLowerCase()) || 
    r.roll.includes(search)
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.student, { color: colors.text }]}>{item.student}</Text>
          <Text style={[styles.roll, { color: colors.textSecondary }]}>Roll: {item.roll}</Text>
        </View>
        <View style={[
          styles.badge, 
          { backgroundColor: item.status === 'Overdue' ? colors.error + '20' : colors.success + '20' }
        ]}>
          <Text style={{ color: item.status === 'Overdue' ? colors.error : colors.success, ...styles.badgeText }}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
      <Text style={[styles.bookTitle, { color: colors.text }]}>{item.book}</Text>
      <Text style={[styles.dueDate, { color: item.status === 'Overdue' ? colors.error : colors.textSecondary }]}>
        Due: {item.due}
      </Text>
      
      <Pressable style={[styles.restoreBtn, { backgroundColor: colors.secondary }]}>
        <FontAwesome name="undo" size={16} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.restoreText}>Process Return</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FontAwesome name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search Student by Name or Roll..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    padding: 16,
    paddingTop: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  list: { padding: 16 },
  card: {
    padding: 16,
    borderRadius: 16,
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  student: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roll: {
    fontSize: 14,
    marginTop: 4,
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
  divider: {
    height: 1,
    marginBottom: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 14,
    marginBottom: 16,
  },
  restoreBtn: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restoreText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  }
});
