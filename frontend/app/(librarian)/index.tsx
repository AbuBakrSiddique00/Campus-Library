import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import NotificationPopup from '../../components/NotificationPopup';

export default function LibrarianDashboard() {
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header Section (Sticky) */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.greetingSub, { color: colors.textSecondary }]}>LIBRARIAN SECURE PORTAL</Text>
          <Text style={[styles.greetingMain, { color: colors.text }]}>Hello, Admin!</Text>
        </View>
        <Pressable 
          style={[styles.profileContainer, { backgroundColor: colors.surface }]}
          onPress={() => setShowNotifications(true)}
        >
          <FontAwesome name="bell" size={20} color={colors.primary} />
          <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Global Overview Banner */}
        <LinearGradient
          colors={[colors.primaryLight, colors.primary]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.bannerCard}
        >
          <Text style={styles.bannerOverline}>CAMPUS LIBRARY STATUS</Text>
          <Text style={styles.bannerMain}>18 Pending Reqs</Text>
          <Text style={styles.bannerSub}>Review requests immediately to avoid backlog.</Text>
          <FontAwesome name="server" size={80} color="rgba(255,255,255,0.15)" style={styles.bannerWatermark} />
        </LinearGradient>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>METRICS</Text>
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>1,245</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>TOTAL BOOKS</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statNumber, { color: colors.secondary }]}>132</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>ACTIVE LOANS</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statNumber, { color: colors.error }]}>7</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>OVERDUE</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 16 }]}>MANAGEMENT TOOLS</Text>
        <View style={styles.grid}>
          <Pressable
            style={[styles.gridItem, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/(librarian)/add')}
          >
            <View style={[styles.iconWrapper, { backgroundColor: colorScheme === 'dark' ? 'rgba(124, 58, 237, 0.15)' : '#F3E8FF' }]}>
              <FontAwesome name="plus" size={22} color={colors.primary} />
            </View>
            <Text style={[styles.gridTitle, { color: colors.text }]}>Add Title</Text>
            <Text style={[styles.gridSub, { color: colors.textSecondary }]}>New book entry</Text>
          </Pressable>

          <Pressable
            style={[styles.gridItem, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/(librarian)/requests')}
          >
            <View style={[styles.iconWrapper, { backgroundColor: colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2' }]}>
              <FontAwesome name="check-square-o" size={22} color={colors.error} />
            </View>
            <Text style={[styles.gridTitle, { color: colors.text }]}>Requests</Text>
            <Text style={[styles.gridSub, { color: colors.textSecondary }]}>18 waiting</Text>
          </Pressable>
        </View>

      </ScrollView>
      <NotificationPopup visible={showNotifications} onClose={() => setShowNotifications(false)} />
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
  greetingSub: { fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  greetingMain: { fontSize: 28, fontWeight: '900', marginBottom: 2 },
  profileContainer: {
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
});
