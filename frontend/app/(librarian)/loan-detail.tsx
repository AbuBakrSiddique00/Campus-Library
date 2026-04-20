import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';

const getMockData = (id: string) => {
  return {
    id,
    student: 'Student Name',
    department: 'Department',
    session: '2023-24',
    roll: '000',
    bookTitle: 'Book Title',
    bookAuthor: 'Author Name',
    bookCategory: 'Category',
    previousLocation: 'Shelf - Row',
    remainingCopies: 0,
    dueDate: '2026-04-10',
  };
};

const getParam = (value: string | string[] | undefined, fallback: string) => {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }
  return value ?? fallback;
};

const getNumberParam = (value: string | string[] | undefined, fallback: number) => {
  const resolved = Array.isArray(value) ? value[0] : value;
  const parsed = Number(resolved);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function LoanDetailScreen() {
  const {
    id,
    student,
    department,
    session,
    roll,
    bookTitle,
    bookAuthor,
    bookCategory,
    previousLocation,
    remainingCopies,
    dueDate,
  } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fallback = getMockData(getParam(id as string | string[] | undefined, ''));
  const details = {
    id: getParam(id as string | string[] | undefined, fallback.id),
    student: getParam(student as string | string[] | undefined, fallback.student),
    department: getParam(department as string | string[] | undefined, fallback.department),
    session: getParam(session as string | string[] | undefined, fallback.session),
    roll: getParam(roll as string | string[] | undefined, fallback.roll),
    bookTitle: getParam(bookTitle as string | string[] | undefined, fallback.bookTitle),
    bookAuthor: getParam(bookAuthor as string | string[] | undefined, fallback.bookAuthor),
    bookCategory: getParam(bookCategory as string | string[] | undefined, fallback.bookCategory),
    previousLocation: getParam(previousLocation as string | string[] | undefined, fallback.previousLocation),
    remainingCopies: getNumberParam(remainingCopies as string | string[] | undefined, fallback.remainingCopies),
    dueDate: getParam(dueDate as string | string[] | undefined, fallback.dueDate),
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Pressable
          onPress={() => router.replace('/(librarian)/borrowed')}
          style={[styles.backButton, { borderColor: colors.border, backgroundColor: colors.background }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <FontAwesome name="arrow-left" size={18} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Loan Details</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>{details.student}</Text>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Student Information</Text>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Name</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{details.student}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Department</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{details.department}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Session</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{details.session}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Roll / ID</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{details.roll}</Text>
        </View>
      </View>

      <View style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Book Information</Text>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Book Name</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{details.bookTitle}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Author</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{details.bookAuthor}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Category</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{details.bookCategory}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Previous Location</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{details.previousLocation}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Remaining Copies</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{details.remainingCopies}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Due Date</Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>{details.dueDate}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={[styles.actionBtn, { backgroundColor: colors.secondary }]}>
          <FontAwesome name="undo" size={16} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.actionText}>Process Return</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerCard: {
    margin: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 6,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 18,
    borderWidth: 1,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 12,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  actions: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  actionBtn: {
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
