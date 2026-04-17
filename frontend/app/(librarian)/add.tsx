import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../../constants/Colors';

// Mock data for search
const MOCK_BOOKS = [
  {
    id: '1',
    type: 'book',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    shelf: 'A-4',
    copies: 5,
    totalCopies: 5,
    location: 'Shelf A - Row 4',
    description: 'Comprehensive guide to algorithms with practical analysis and core techniques.',
  },
  {
    id: '2',
    type: 'book',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    shelf: 'B-1',
    copies: 2,
    totalCopies: 3,
    location: 'Shelf B - Row 1',
    description: 'Best practices for writing clean, maintainable, and readable software.',
  },
];

export default function BooksScreen() {
  const [activeTab, setActiveTab] = useState<'search' | 'add'>('add');
  
  // Add Form State
  const [itemType, setItemType] = useState<'book' | 'paper'>('book');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [shelf, setShelf] = useState('');
  const [copies, setCopies] = useState('');
  const [description, setDescription] = useState('');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const handleAdd = () => {
    alert(`${itemType === 'book' ? 'Book' : 'Paper'} "${title}" added!`);
    setTitle(''); setAuthor(''); setShelf(''); setCopies(''); setDescription('');
    setActiveTab('search');
  };

  const filteredBooks = MOCK_BOOKS.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        {/* Toggle Buttons */}
        <View style={styles.toggleContainer}>
          <Pressable 
            style={[styles.toggleBtn, activeTab === 'add' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
            
            onPress={() => setActiveTab('add')}
          >
            <Text style={[styles.toggleText, { color: activeTab === 'add' ? '#FFF' : colors.textSecondary }]}>Add New</Text>
          </Pressable>
          <Pressable 
            style={[styles.toggleBtn, activeTab === 'search' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
            onPress={() => setActiveTab('search')}
          >
            <Text style={[styles.toggleText, { color: activeTab === 'search' ? '#FFF' : colors.textSecondary }]}>Search</Text>
          </Pressable>
        </View>
      </View>

      {activeTab === 'add' ? (
        <ScrollView style={{ flex: 1 }}>
          <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            
            <View style={[styles.toggleContainer, { marginBottom: 20 }]}>
              <Pressable 
                style={[styles.toggleBtn, itemType === 'book' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => setItemType('book')}
              >
                <Text style={[styles.toggleText, { color: itemType === 'book' ? '#FFF' : colors.textSecondary }]}>Book</Text>
              </Pressable>
              <Pressable 
                style={[styles.toggleBtn, itemType === 'paper' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={() => setItemType('paper')}
              >
                <Text style={[styles.toggleText, { color: itemType === 'paper' ? '#FFF' : colors.textSecondary }]}>Research Paper</Text>
              </Pressable>
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>{itemType === 'book' ? 'Book Title' : 'Paper Title'}</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder={itemType === 'book' ? "e.g. Introduction to Algorithms" : "e.g. Distributed Systems in 2026"}
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Author Name</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="e.g. Thomas H. Cormen"
              placeholderTextColor={colors.textSecondary}
              value={author}
              onChangeText={setAuthor}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text, height: 100, textAlignVertical: 'top', paddingTop: 16 }]}
              placeholder="Brief description ..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Location (Shelf-Row)</Text>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                  placeholder="e.g. A-4"
                  placeholderTextColor={colors.textSecondary}
                  value={shelf}
                  onChangeText={setShelf}
                />
              </View>
              <View style={styles.half}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Total Copies</Text>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                  placeholder="e.g. 5"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                  value={copies}
                  onChangeText={setCopies}
                />
              </View>
            </View>

            <Pressable 
              style={({ pressed }) => [
                styles.submitBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1, shadowColor: colors.primary }
              ]} 
              onPress={handleAdd}
            >
              <FontAwesome name="check" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.submitText}>Save {itemType === 'book' ? 'Book' : 'Paper'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <FontAwesome name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by Title or Author..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <FlatList
            data={filteredBooks}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/(student)/detail/[id]',
                    params: {
                      id: item.id,
                      type: item.type,
                      title: item.title,
                      author: item.author,
                      available: String(item.copies),
                      totalCopies: String(item.totalCopies ?? item.copies),
                      location: item.location ?? item.shelf,
                      description: item.description,
                    },
                  })
                }
                style={[styles.bookCard, { backgroundColor: colors.surface }]}
              >
                <View style={styles.bookDetails}>
                  <Text style={[styles.bookTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.bookAuthor, { color: colors.textSecondary }]}>{item.author}</Text>
                </View>
                <View style={styles.bookStats}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>{item.copies}</Text>
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Copies</Text>
                </View>
              </Pressable>
            )}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDE5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontWeight: '600',
    fontSize: 14,
  },
  form: {
    margin: 16,
    padding: 24,
    borderWidth: 1,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  half: {
    flex: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  submitText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchSection: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  list: { padding: 16 },
  bookCard: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDE5F5',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  bookDetails: {
    flex: 1,
    paddingRight: 16,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
  },
  bookStats: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    borderLeftWidth: 1,
    borderLeftColor: '#DDE5F5',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  }
});
