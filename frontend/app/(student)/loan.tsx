import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLoans } from '@/contexts/LoanContext';
import Colors from '../../constants/Colors';

const getStatusColors = (status: string, colors: (typeof Colors)[keyof typeof Colors]) => {
  if (status === 'Overdue') return { bg: colors.error + '20', fg: colors.error };
  if (status === 'Pending') return { bg: colors.primary + '18', fg: colors.primary };
  return { bg: colors.success + '20', fg: colors.success };
};

export default function LoanScreen() {
  const { loans, message, clearMessage } = useLoans();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const renderItem = ({ item }: { item: (typeof loans)[number] }) => {
    const badge = getStatusColors(item.status, colors);
    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: '/(student)/detail/[id]',
            params: {
              id: item.id,
              type: item.type,
              title: item.title,
              author: item.author,
              available: String(item.available),
              totalCopies: String(item.totalCopies),
              location: item.location,
              description: item.description,
              libraryName: item.libraryName ?? '',
              tag: item.tag ?? '',
              borrowDate: item.borrowDate,
              returnDate: item.returnDate,
              status: item.status,
              mode: 'loan',
              returnTo: '/(student)/loan',
            },
          })
        }
        style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View style={styles.cardHeader}>
          <FontAwesome name="book" size={24} color={colors.primary} />
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={{ color: badge.fg, ...styles.badgeText }}>{item.status}</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.dateRow}>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>Borrowed: {item.borrowDate}</Text>
          <Text style={[styles.dateText, { color: item.status === 'Overdue' ? colors.error : colors.text }]}>Due: {item.returnDate}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {message ? (
        <View style={[styles.banner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.bannerText, { color: colors.text }]}>{message}</Text>
          <Pressable onPress={clearMessage} style={styles.bannerClose}>
            <FontAwesome name="times" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={loans}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>You have no active loans.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  bannerClose: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: { padding: 16, paddingTop: 12 },
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
    alignItems: 'center',
    marginBottom: 12,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  }
});
