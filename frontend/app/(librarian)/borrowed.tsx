import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../../constants/Colors';

const MOCK_BORROWED = [
  {
    id: '1',
    student: 'Alice M.',
    roll: '101',
    department: 'Computer Science',
    session: '2023-24',
    book: 'Data Structures and Algorithms',
    category: 'Computer Science',
    reservationDate: '2026-04-01',
    due: '2026-04-10',
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
    student: 'Bob S.',
    roll: '105',
    department: 'Mechanical Engineering',
    session: '2022-23',
    book: 'Operating Systems',
    category: 'Systems',
    reservationDate: '2026-03-15',
    due: '2026-03-30',
    status: 'Overdue',
    type: 'book',
    author: 'Andrew S. Tanenbaum',
    available: 0,
    totalCopies: 3,
    location: 'Shelf B - Row 4',
    description: 'Comprehensive overview of OS fundamentals: processes, memory, and storage.',
  },
];

export default function BorrowedScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const filtered = MOCK_BORROWED.filter(r => {
    const matchesSearch = r.student.toLowerCase().includes(search.toLowerCase()) || r.roll.includes(search);
    const matchesFilter = filter === 'All' || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(librarian)/loan-detail',
          params: {
            id: item.id,
            student: item.student,
            roll: item.roll,
            department: item.department,
            session: item.session,
            bookTitle: item.book,
            bookAuthor: item.author,
            bookCategory: item.category,
            previousLocation: item.location,
            remainingCopies: String(item.available),
            reservationDate: item.reservationDate,
            returnDate: item.due,
            dueDate: item.due,
          },
        })
      }
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.student, { color: colors.text }]}>{item.student}</Text>
          <Text style={[styles.roll, { color: colors.textSecondary }]}>Roll: {item.roll}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>Dept: {item.department}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>Session: {item.session}</Text>
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
      
      <Pressable
        onPress={(event) => event.stopPropagation()}
        style={[styles.restoreBtn, { backgroundColor: colors.secondary }]}
      >
        <FontAwesome name="undo" size={16} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.restoreText}>Process Return</Text>
      </Pressable>
    </Pressable>
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
        <View style={styles.filterRow}>
          {['All', 'Active', 'Overdue'].map(f => (
            <Pressable 
              key={f} 
              style={[
                styles.filterChip, 
                { 
                  backgroundColor: filter === f ? colors.primary : colors.surface,
                  borderColor: filter === f ? colors.primary : colors.border
                }
              ]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, { color: filter === f ? '#FFF' : colors.textSecondary }]}>{f}</Text>
            </Pressable>
          ))}
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
  filterRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontWeight: '600',
    fontSize: 14,
  },
  list: { padding: 16 },
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
  meta: {
    fontSize: 13,
    marginTop: 2,
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
