import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const fullName = user?.name || 'Reader';
  const initials = (user?.name || 'R')
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTop}>
            <View style={styles.avatarRing}>
              <View style={styles.avatarCore}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            </View>
            <View style={styles.rolePill}>
              <Text style={styles.rolePillText}>{user?.role === 'librarian' ? 'Librarian' : 'Reader'}</Text>
            </View>
          </View>
          <Text style={styles.heroName}>Hi {fullName}.</Text>
          <Text style={styles.heroSub}>
            {user?.department || 'Department'}{user?.rollNumber ? ` · Roll ${user.rollNumber}` : ''}
          </Text>
        </LinearGradient>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Account details</Text>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <View style={styles.infoLabelWrap}>
              <FontAwesome name="envelope-o" size={14} color={colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Email</Text>
            </View>
            <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
              {user?.email || 'N/A'}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <View style={styles.infoLabelWrap}>
              <FontAwesome name="building-o" size={14} color={colors.textSecondary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Department</Text>
            </View>
            <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>
              {user?.department || 'N/A'}
            </Text>
          </View>

          {user?.session ? (
            <View style={styles.infoRow}>
              <View style={styles.infoLabelWrap}>
                <FontAwesome name="calendar" size={14} color={colors.textSecondary} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Session</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text }]}>{user.session}</Text>
            </View>
          ) : null}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutBtn,
            { backgroundColor: colors.error, opacity: pressed ? 0.88 : 1, shadowColor: colors.error },
          ]}
          onPress={handleLogout}
        >
          <FontAwesome name="sign-out" size={16} color="#FFF" />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 34,
    gap: 14,
  },
  heroCard: {
    borderRadius: 24,
    padding: 18,
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: 'rgba(255,255,255,0.28)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCore: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#2D5BFF',
    fontSize: 18,
    fontWeight: '900',
  },
  rolePill: {
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.23)',
  },
  rolePillText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  heroName: {
    marginTop: 14,
    color: '#FFF',
    fontSize: 26,
    fontWeight: '900',
  },
  heroSub: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#0F1A30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  infoLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    maxWidth: '56%',
    textAlign: 'right',
  },
  logoutBtn: {
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
