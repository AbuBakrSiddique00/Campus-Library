import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const MOCK_REQUESTS = [
  { id: '1', student: 'Alice M.', roll: '101', book: 'Calculus 5th Ed', date: '2 hrs ago' },
  { id: '2', student: 'John D.', roll: '102', book: 'Physics 101', date: '5 hrs ago' },
];

export default function RequestsScreen() {
  const [search, setSearch] = useState('');
  
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const filtered = MOCK_REQUESTS.filter(r => 
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
        <Text style={[styles.time, { color: colors.textSecondary }]}>{item.date}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <Text style={[styles.bookTitle, { color: colors.text }]}>Requested: {item.book}</Text>
      
      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.rejectBtn, { borderColor: colors.error }]}>
          <Text style={[styles.btnText, { color: colors.error }]}>Reject</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.approveBtn, { backgroundColor: colors.primary }]}>
          <Text style={[styles.btnText, { color: '#FFF' }]}>Approve</Text>
        </Pressable>
      </View>
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
  time: {
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBtn: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  approveBtn: {},
  btnText: {
    fontWeight: 'bold',
    fontSize: 14,
  }
});
