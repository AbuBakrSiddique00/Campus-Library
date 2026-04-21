import AppLogo from '@/components/AppLogo';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import NotificationPopup from '../../components/NotificationPopup';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';

const RECENT_BOOKS = [
  {
    id: '1',
    type: 'book',
    title: 'Design Patterns',
    author: 'Gang of Four',
    dept: 'CSE Library',
    tag: 'Software Engineering',
    available: true,
    copies: 2,
    totalCopies: 5,
    location: 'CSE Library · Shelf A - Row 3',
    description: 'A foundational guide to reusable object-oriented design patterns used in modern software.',
  },
  {
    id: '2',
    type: 'book',
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum',
    dept: 'CSE Library',
    tag: 'Networking',
    available: false,
    copies: 0,
    totalCopies: 4,
    location: 'CSE Library · Shelf B - Row 1',
    description: 'Core networking concepts covering protocols, architectures, and performance essentials.',
  },
];

const QUICK_ACTIONS = [
  { id: 'search', icon: 'search', title: 'Search Library', subtitle: 'Find books & papers', route: '/(student)/search', accent: '#2D5BFF' },
  { id: 'loan', icon: 'book', title: 'My Loans', subtitle: 'Track due dates', route: '/(student)/loan', accent: '#14C7A5' },
] as const;

export default function StudentHomeDashboard() {
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [showNotifications, setShowNotifications] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const fullName = user?.name || 'Reader';
  const roleLabel = user?.role === 'librarian' ? 'Librarian' : 'Reader';
  const sessionLabel = user?.session || 'Session';
  const departmentLabel = user?.department || 'Department';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.topBar}>
            <View style={styles.topBarSpacer} />
            <AppLogo size="sm" />
            <Pressable
              style={[styles.bellContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={() => setShowNotifications(true)}
            >
              <View style={[styles.bellGlow, { backgroundColor: colors.primary + '14' }]}>
                <FontAwesome name="bell-o" size={17} color={colors.primary} />
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>•</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.greetingWrapper}>
            <View style={styles.greetingLeft}>
              <Text style={[styles.greetingMain, { color: colors.text }]} numberOfLines={1}>
                {greeting}, {fullName}
              </Text>
              <Text style={[styles.deptText, { color: colors.textSecondary }]}>
                {roleLabel} {departmentLabel} {sessionLabel}
              </Text>
            </View>
          </View>
        </View>

        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroQuoteTop}>Read Dream Repeat</Text>
          <Text style={styles.heroOverline}>Today overview</Text>
          <Text style={styles.heroTitle}>You have 2 active loans</Text>
          <Text style={styles.heroSub}>One title is due tomorrow. Renew now to avoid late fees.</Text>
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaPill}>
              <FontAwesome name="clock-o" size={11} color="#FFF" />
              <Text style={styles.heroMetaText}>Due in 1 day</Text>
            </View>
            <View style={styles.heroMetaPill}>
              <FontAwesome name="check-circle-o" size={11} color="#FFF" />
              <Text style={styles.heroMetaText}>No penalties</Text>
            </View>
          </View>
          <FontAwesome name="graduation-cap" size={86} color="rgba(255,255,255,0.15)" style={styles.heroWatermark} />
        </LinearGradient>

        <View style={styles.metricRow}>
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.metricValue, { color: colors.primary }]}>2</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Borrowed</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.metricValue, { color: colors.secondary }]}>248</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Available</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.metricValue, { color: colors.error }]}>1</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Due soon</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick actions</Text>
        </View>
        <View style={styles.actionGrid}>
          {QUICK_ACTIONS.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(item.route)}
              style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={[styles.actionIconWrap, { backgroundColor: item.accent + '1A' }]}>
                <FontAwesome name={item.icon} size={20} color={item.accent} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.actionSub, { color: colors.textSecondary }]}>{item.subtitle}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recently added</Text>
          <Pressable>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.recentList}>
          {RECENT_BOOKS.map((book) => (
            <Pressable
              key={book.id}
              onPress={() =>
                router.push({
                  pathname: '/(student)/detail/[id]',
                  params: {
                    id: book.id,
                    type: book.type,
                    title: book.title,
                    author: book.author,
                    available: String(book.available ? book.copies : 0),
                    totalCopies: String(book.totalCopies),
                    location: book.location,
                    description: book.description,
                    libraryName: book.dept,
                    tag: book.tag,
                    returnTo: '/(student)',
                  },
                })
              }
              style={[styles.bookCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={[styles.bookIconProxy, { backgroundColor: colors.background }]}>
                <FontAwesome name="book" size={22} color={book.available ? colors.secondary : colors.primaryLight} />
              </View>
              <View style={styles.bookDetails}>
                <Text style={[styles.bookTitle, { color: colors.text }]} numberOfLines={1}>
                  {book.title}
                </Text>
                <Text style={[styles.bookAuthor, { color: colors.textSecondary }]}>
                  {book.author} · {book.dept}
                </Text>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.availabilityBadge,
                      { backgroundColor: (book.available ? colors.success : colors.error) + '1A' },
                    ]}
                  >
                    <Text style={[styles.availabilityText, { color: book.available ? colors.success : colors.error }]}>
                      {book.available ? 'Available' : 'Checked out'}
                    </Text>
                  </View>
                  {book.copies > 0 ? (
                    <View style={[styles.availabilityBadge, { backgroundColor: colors.background }]}>
                      <Text style={[styles.availabilityText, { color: colors.textSecondary }]}>{book.copies} copies</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <NotificationPopup visible={showNotifications} onClose={() => setShowNotifications(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 32,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 18,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  topBarSpacer: {
    width: 48,
    height: 48,
  },
  greetingWrapper: { position: 'relative', marginTop: 6, minHeight: 50, justifyContent: 'center' },
  greetingLeft: { alignItems: 'flex-start', maxWidth: '70%' },
  greetingMain: { fontSize: 16, fontWeight: '800', textAlign: 'left' },
  deptText: { fontSize: 15, marginTop: 6, textAlign: 'left' },
  bellContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F1A30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  bellGlow: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 9,
    backgroundColor: '#EF4444',
    width: 10,
    height: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#FFF',
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '900', lineHeight: 10 },
  heroCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
    overflow: 'hidden',
  },
  heroQuoteTop: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600', fontStyle: 'italic', letterSpacing: 0.3, marginBottom: 6 },
  heroOverline: { color: 'rgba(255,255,255,0.82)', fontSize: 11, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroTitle: { color: '#FFF', fontSize: 27, fontWeight: '900', marginTop: 8, marginBottom: 8, maxWidth: '85%' },
  heroSub: { color: 'rgba(255,255,255,0.92)', fontSize: 14, lineHeight: 21, maxWidth: '86%' },
  heroMetaRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  heroMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroMetaText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  heroWatermark: { position: 'absolute', right: -12, bottom: -16, transform: [{ rotate: '-12deg' }] },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#0F1A30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricValue: { fontSize: 23, fontWeight: '900' },
  metricLabel: { fontSize: 11, marginTop: 3, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  seeAllText: { fontSize: 13, fontWeight: '700' },
  actionGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#0F1A30',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 9,
    elevation: 2,
  },
  actionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: { fontSize: 14, fontWeight: '800' },
  actionSub: { fontSize: 12, marginTop: 4 },
  recentList: { gap: 10 },
  bookCard: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
    alignItems: 'center',
    shadowColor: '#0F1A30',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bookIconProxy: {
    width: 46,
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookDetails: { flex: 1 },
  bookTitle: { fontSize: 15, fontWeight: '800' },
  bookAuthor: { fontSize: 12, marginTop: 4, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  availabilityBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  availabilityText: { fontSize: 11, fontWeight: '700' },
});
