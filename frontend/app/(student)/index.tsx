import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Colors from '../../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import NotificationPopup from '../../components/NotificationPopup';

// Mock Data for "Recently Added"
const RECENT_BOOKS = [
  { id: '1', title: 'Design Patterns', author: 'Gang of Four', dept: 'CSE Library', available: true, copies: 2 },
  { id: '2', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', dept: 'CSE Library', available: false, copies: 0 },
];

export default function StudentHomeDashboard() {
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [showNotifications, setShowNotifications] = useState(false);

  // Greeting logic
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING ☀️' : hour < 18 ? 'GOOD AFTERNOON 🌤️' : 'GOOD EVENING 🌙';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Header Section */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.greetingWrapper}>
          <Text style={[styles.greetingSub, { color: colors.textSecondary }]}>{greeting}</Text>
          <Text style={[styles.greetingMain, { color: colors.text }]}>Hello, {user?.name?.split(' ')[0] || 'User'}!</Text>
          <Text style={[styles.deptText, { color: colors.textSecondary }]}>
            {user?.department || 'Department'} {user?.role === 'reader' ? '· Reader' : '· Faculty'}
          </Text>
        </View>
        <Pressable 
          style={[styles.bellContainer, { backgroundColor: colors.surface }]}
          onPress={() => setShowNotifications(true)}
        >
          <FontAwesome name="bell" size={20} color={colors.primary} />
          <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

      {/* Main Banner Card */}
      <LinearGradient
        colors={[colors.primaryLight, colors.primary]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.bannerCard}
      >
        <Text style={styles.bannerOverline}>MY LIBRARY OVERVIEW</Text>
        <Text style={styles.bannerMain}>2 Books Borrowed</Text>
        <Text style={styles.bannerSub}>1 book due tomorrow — don't forget!</Text>
        <FontAwesome name="book" size={80} color="rgba(255,255,255,0.15)" style={styles.bannerWatermark} />
      </LinearGradient>

      {/* Statistics Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>2</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>BORROWED</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: colors.secondary }]}>248</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>AVAILABLE</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
          <Text style={[styles.statNumber, { color: colors.error }]}>1</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>DUE SOON</Text>
        </View>
      </View>

      {/* Quick Actions Title */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginBottom: 0 }]}>QUICK ACTIONS</Text>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.grid}>
        <Pressable
          style={[styles.gridItem, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/(student)/search')}
        >
          <View style={[styles.iconWrapper, { backgroundColor: colorScheme === 'dark' ? 'rgba(124, 58, 237, 0.15)' : '#F3E8FF' }]}>
            <FontAwesome name="search" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.gridTitle, { color: colors.text }]}>Search Books</Text>
          <Text style={[styles.gridSub, { color: colors.textSecondary }]}>Find & reserve</Text>
        </Pressable>

        <Pressable
          style={[styles.gridItem, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/(student)/loan')}
        >
          <View style={[styles.iconWrapper, { backgroundColor: colorScheme === 'dark' ? 'rgba(20, 184, 166, 0.15)' : '#CCFBF1' }]}>
            <FontAwesome name="book" size={22} color={colors.secondary} />
          </View>
          <Text style={[styles.gridTitle, { color: colors.text }]}>My Books</Text>
          <Text style={[styles.gridSub, { color: colors.textSecondary }]}>Active loans</Text>
        </Pressable>
      </View>

      {/* Recently Added Section */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>RECENTLY ADDED</Text>
        <Pressable><Text style={{ color: colors.primary, fontWeight: 'bold' }}>See all</Text></Pressable>
      </View>

      <View style={styles.recentList}>
        {RECENT_BOOKS.map(book => (
          <View key={book.id} style={[styles.bookCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.bookIconProxy, { backgroundColor: colors.background }]}>
              <FontAwesome name="book" size={24} color={book.available ? colors.secondary : colors.primaryLight} />
            </View>
            <View style={styles.bookDetails}>
              <Text style={[styles.bookTitle, { color: colors.text }]}>{book.title}</Text>
              <Text style={[styles.bookAuthor, { color: colors.textSecondary }]}>
                {book.author} · {book.dept}
              </Text>
              <View style={styles.badgeRow}>
                {book.available ? (
                  <View style={[styles.availabilityBadge, { backgroundColor: colorScheme === 'dark' ? 'rgba(20, 184, 166, 0.15)' : '#CCFBF1' }]}>
                    <FontAwesome name="check" size={10} color={colors.secondary} style={{ marginRight: 4 }} />
                    <Text style={[styles.availabilityText, { color: colors.secondary }]}>Available</Text>
                  </View>
                ) : (
                  <View style={[styles.availabilityBadge, { backgroundColor: colorScheme === 'dark' ? 'rgba(217, 70, 239, 0.15)' : '#FAE8FF' }]}>
                    <FontAwesome name="clock-o" size={10} color={colors.primaryLight} style={{ marginRight: 4 }} />
                    <Text style={[styles.availabilityText, { color: colors.primaryLight }]}>Checked Out</Text>
                  </View>
                )}
                {book.copies > 0 && (
                  <View style={[styles.availabilityBadge, { backgroundColor: colors.background, marginLeft: 8 }]}>
                    <Text style={[styles.availabilityText, { color: colors.textSecondary }]}>{book.copies} copies</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      <NotificationPopup visible={showNotifications} onClose={() => setShowNotifications(false)} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    zIndex: 10,
  },
  greetingWrapper: { flex: 1 },
  greetingSub: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  greetingMain: { fontSize: 28, fontWeight: '900', marginBottom: 2 },
  deptText: { fontSize: 14 },
  bellContainer: {
    width: 48, height: 48,
    borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: 10, right: 12,
    backgroundColor: '#EF4444',
    width: 14, height: 14,
    borderRadius: 7,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#FFF'
  },
  badgeText: { color: '#FFF', fontSize: 8, fontWeight: 'bold' },
  bannerCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  bannerOverline: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 8 },
  bannerMain: { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  bannerSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14 },
  bannerWatermark: { position: 'absolute', right: -15, bottom: -20, transform: [{ rotate: '-15deg' }] },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  statBox: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  statNumber: { fontSize: 24, fontWeight: '900', marginBottom: 4 },
  statLabel: { fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', letterSpacing: 1, marginBottom: 16 },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  iconWrapper: {
    width: 44, height: 44,
    borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  gridTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
  gridSub: { fontSize: 11, textAlign: 'center' },
  recentList: {
    gap: 12,
  },
  bookCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    alignItems: 'center',
  },
  bookIconProxy: {
    width: 50, height: 64,
    borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
  },
  bookDetails: { flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  bookAuthor: { fontSize: 13, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', alignItems: 'center' },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availabilityText: { fontSize: 11, fontWeight: 'bold' }
});
