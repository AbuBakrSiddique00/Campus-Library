import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../../constants/Colors';

// Mock Data
const MOCK_DATA = [
  {
    id: '1',
    type: 'book',
    title: 'Calculus Early Transcendentals',
    author: 'James Stewart',
    available: 3,
    totalCopies: 5,
    location: 'Shelf A - Row 2',
    description: 'A rigorous introduction to calculus for engineering and mathematics coursework.',
  },
  {
    id: '2',
    type: 'book',
    title: 'Data Structures and Algorithms',
    author: 'Thomas H. Cormen',
    available: 1,
    totalCopies: 4,
    location: 'Shelf C - Row 1',
    description: 'Classic reference on algorithm design, analysis, and core data structures.',
  },
  {
    id: '3',
    type: 'paper',
    title: 'Deep Learning for Computer Vision',
    author: 'Dr. Alan Turing',
    available: 5,
    totalCopies: 5,
    location: 'Digital / Sem Library',
    description: 'Survey of modern deep learning techniques applied to vision tasks.',
  },
  {
    id: '4',
    type: 'book',
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    available: 0,
    totalCopies: 3,
    location: 'Shelf B - Row 4',
    description: 'Comprehensive overview of OS fundamentals: processes, memory, and storage.',
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'book' | 'paper'>('book');
  
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const filteredData = MOCK_DATA.filter((item) => 
    item.type === activeTab && 
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <Pressable 
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() =>
        router.push({
          pathname: '/(student)/detail/[id]',
          params: {
            id: item.id,
            type: item.type,
            title: item.title,
            author: item.author,
            available: String(item.available),
            totalCopies: String(item.totalCopies ?? item.available),
            location: item.location,
            description: item.description,
            returnTo: '/(student)/search',
          },
        })
      }
    >
      <View style={[styles.iconPlaceholder, { backgroundColor: colors.background }]}>
        <FontAwesome name={item.type === 'book' ? 'book' : 'file-text-o'} size={32} color={colors.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.cardAuthor, { color: colors.textSecondary }]}>{item.author}</Text>
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, { backgroundColor: item.available > 0 ? colors.success + '20' : colors.error + '20' }]}>
            <Text style={[styles.badgeText, { color: item.available > 0 ? colors.success : colors.error }]}>
              {item.available > 0 ? `${item.available} Available` : 'Not Available'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <FontAwesome name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search title, author..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {/* Tab Toggles */}
        <View style={styles.tabsContainer}>
          <Pressable 
            style={[styles.tab, { borderColor: colors.border }, activeTab === 'book' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
            onPress={() => setActiveTab('book')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'book' ? '#FFF' : colors.textSecondary }]}>Books</Text>
          </Pressable>
          <Pressable 
            style={[styles.tab, { borderColor: colors.border }, activeTab === 'paper' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
            onPress={() => setActiveTab('paper')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'paper' ? '#FFF' : colors.textSecondary }]}>Papers</Text>
          </Pressable>
        </View>
      </View>

      {/* Results List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchHeader: {
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
    marginBottom: 16,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  tabsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconPlaceholder: {
    width: 70,
    height: 90,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardAuthor: {
    fontSize: 14,
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  }
});
