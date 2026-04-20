import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../../constants/Colors';

const MOCK_REQUESTS = [
  {
    id: '1',
    student: 'Alice M.',
    roll: '101',
    department: 'Computer Science',
    session: '2023-24',
    date: '2 hrs ago',
    book: {
      title: 'Calculus 5th Ed',
      author: 'James Stewart',
      category: 'Mathematics',
      location: 'Shelf A - Row 2',
      remaining: 3,
    },
  },
  {
    id: '2',
    student: 'John D.',
    roll: '102',
    department: 'Physics',
    session: '2022-23',
    date: '5 hrs ago',
    book: {
      title: 'Physics 101',
      author: 'David Halliday',
      category: 'Science',
      location: 'Shelf B - Row 1',
      remaining: 1,
    },
  },
];

export default function RequestsScreen() {
  const [search, setSearch] = useState('');

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const filtered = MOCK_REQUESTS.filter(r =>
    r.student.toLowerCase().includes(search.toLowerCase()) ||
    r.roll.includes(search)
  );

  const handleOpenRequest = (item: (typeof MOCK_REQUESTS)[number]) => {
    router.push({
      pathname: '/(librarian)/request-detail',
      params: {
        id: item.id,
        student: item.student,
        roll: item.roll,
        department: item.department,
        session: item.session,
        bookTitle: item.book.title,
        bookAuthor: item.book.author,
        bookCategory: item.book.category,
        bookLocation: item.book.location,
        remainingCopies: String(item.book.remaining),
      },
    });
  };

  const renderItem = ({ item }: { item: (typeof MOCK_REQUESTS)[number] }) => (
    <Pressable
      onPress={() => handleOpenRequest(item)}
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
        <View style={styles.studentBlock}>
          <Text style={[styles.student, { color: colors.text }]}>{item.student}</Text>
          <Text style={[styles.roll, { color: colors.textSecondary }]}>Roll: {item.roll}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>Dept: {item.department}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>Session: {item.session}</Text>
        </View>
        <Text style={[styles.time, { color: colors.textSecondary }]}>{item.date}</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <Text style={[styles.bookTitle, { color: colors.text }]}>Requested: {item.book.title}</Text>

      <View style={styles.actions}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={[styles.btn, styles.rejectBtn, { borderColor: colors.error }]}
        >
          <Text style={[styles.btnText, { color: colors.error }]}>Reject</Text>
        </Pressable>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={[styles.btn, styles.approveBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.btnText, { color: '#FFF' }]}>Approve</Text>
        </Pressable>
      </View>
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
  studentBlock: {
    flex: 1,
    paddingRight: 12,
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
