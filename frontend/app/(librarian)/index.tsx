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

const TOOLS = [
  { id: 'requests', icon: 'inbox', title: 'Requests Inbox', subtitle: 'Review and approve pending requests', meta: '18 pending', route: '/(librarian)/requests', accent: '#14C7A5' },
  { id: 'add', icon: 'plus', title: 'Catalog Entry', subtitle: 'Add books or research papers', meta: 'Quick add', route: '/(librarian)/add', accent: '#2D5BFF' },
  { id: 'borrowed', icon: 'exchange', title: 'Returns Desk', subtitle: 'Process returns and update stock', meta: '132 active', route: '/(librarian)/borrowed', accent: '#E5484D' },
] as const;

export default function LibrarianDashboard() {
  const { user } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [showNotifications, setShowNotifications] = useState(false);
  const firstName = user?.name?.split(' ')[0] || 'Admin';

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

          <View style={styles.headerLeft}>
            <Text style={[styles.greetingSub, { color: colors.textSecondary }]}>Library operations dashboard</Text>
            <Text style={[styles.greetingMain, { color: colors.text }]}>Welcome back, {firstName}</Text>
          </View>
        </View>

        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.heroOverline}>Operations health</Text>
          <Text style={styles.heroTitle}>18 requests need review</Text>
          <Text style={styles.heroSub}>Process approvals quickly to keep circulation smooth across departments.</Text>
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMetaPill}>
              <FontAwesome name="warning" size={11} color="#FFF" />
              <Text style={styles.heroMetaText}>7 overdue books</Text>
            </View>
            <View style={styles.heroMetaPill}>
              <FontAwesome name="book" size={11} color="#FFF" />
              <Text style={styles.heroMetaText}>132 active loans</Text>
            </View>
          </View>
          <FontAwesome name="line-chart" size={88} color="rgba(255,255,255,0.15)" style={styles.heroWatermark} />
        </LinearGradient>

        <View style={styles.metricRow}>
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.metricValue, { color: colors.primary }]}>1,245</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Total books</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.metricValue, { color: colors.secondary }]}>132</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Active loans</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.metricValue, { color: colors.error }]}>7</Text>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Overdue</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Management tools</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Core workflows for daily operations</Text>
        </View>
        <View style={styles.toolsBlock}>
          <Pressable
            onPress={() => router.push(TOOLS[0].route)}
            style={[styles.featuredToolCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <View style={[styles.toolIconWrap, { backgroundColor: TOOLS[0].accent + '1A' }]}>
              <FontAwesome name={TOOLS[0].icon} size={20} color={TOOLS[0].accent} />
            </View>
            <View style={styles.featuredToolBody}>
              <Text style={[styles.toolTitle, { color: colors.text }]}>{TOOLS[0].title}</Text>
              <Text style={[styles.toolSub, { color: colors.textSecondary }]}>{TOOLS[0].subtitle}</Text>
              <Text style={[styles.toolMeta, { color: TOOLS[0].accent }]}>{TOOLS[0].meta}</Text>
            </View>
            <FontAwesome name="chevron-right" size={14} color={colors.textSecondary} />
          </Pressable>

          <View style={styles.compactToolsRow}>
            {TOOLS.slice(1).map((tool) => (
              <Pressable
                key={tool.id}
                onPress={() => router.push(tool.route)}
                style={[styles.compactToolCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={[styles.toolIconWrap, { backgroundColor: tool.accent + '1A' }]}>
                  <FontAwesome name={tool.icon} size={18} color={tool.accent} />
                </View>
                <Text style={[styles.compactToolTitle, { color: colors.text }]}>{tool.title}</Text>
                <Text style={[styles.toolSub, { color: colors.textSecondary }]} numberOfLines={2}>
                  {tool.subtitle}
                </Text>
                <View style={[styles.metaPill, { backgroundColor: tool.accent + '1A' }]}>
                  <Text style={[styles.metaPillText, { color: tool.accent }]}>{tool.meta}</Text>
                </View>
              </Pressable>
            ))}
          </View>
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
  headerLeft: { alignItems: 'center' },
  greetingSub: { fontSize: 13, fontWeight: '700', marginTop: 12, textTransform: 'uppercase', letterSpacing: 0.6 },
  greetingMain: { fontSize: 26, fontWeight: '900', marginTop: 4, textAlign: 'center' },
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
  heroOverline: { color: 'rgba(255,255,255,0.82)', fontSize: 11, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  heroTitle: { color: '#FFF', fontSize: 27, fontWeight: '900', marginTop: 8, marginBottom: 8, maxWidth: '86%' },
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
  heroWatermark: { position: 'absolute', right: -12, bottom: -16, transform: [{ rotate: '-8deg' }] },
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
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  sectionSubtitle: { fontSize: 12, marginTop: 4, fontWeight: '500' },
  toolsBlock: {
    gap: 10,
    marginBottom: 20,
  },
  featuredToolCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#0F1A30',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 9,
    elevation: 2,
  },
  featuredToolBody: {
    flex: 1,
  },
  compactToolsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  compactToolCard: {
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
  toolIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  toolTitle: { fontSize: 14, fontWeight: '800' },
  compactToolTitle: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  toolSub: { fontSize: 12, marginTop: 4, lineHeight: 17 },
  toolMeta: { fontSize: 11, fontWeight: '700', marginTop: 8 },
  metaPill: {
    alignSelf: 'flex-start',
    marginTop: 10,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
