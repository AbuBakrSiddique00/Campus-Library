import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLoans } from '@/contexts/LoanContext';
import Colors from '../../../constants/Colors';

// Mock function (in reality we fetch based on ID)
const getMockData = (id: string) => {
  return {
    id,
    type: 'book',
    title: 'Calculus Early Transcendentals',
    author: 'James Stewart',
    available: 3,
    location: 'Shelf A - Row 2',
    libraryName: 'Main Library',
    tag: 'Mathematics',
    description:
      'This mathematically rigorous text introduces calculus early, setting the foundation for engineering and mathematics coursework.',
    totalCopies: 5,
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

const toISODateOnly = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
};

const formatDate = (value: string) => {
  if (!value) return '—';

  const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/;
  const date = isoDateOnly.test(value)
    ? (() => {
        const [y, m, d] = value.split('-').map(Number);
        return new Date(y!, (m ?? 1) - 1, d);
      })()
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
};

export default function DetailScreen() {
  const { addLoan } = useLoans();
  const {
    id,
    title,
    author,
    available,
    totalCopies,
    location,
    description,
    type,
    libraryName,
    tag,
    borrowDate: borrowDateParam,
    returnDate: returnDateParam,
    status: statusParam,
    mode: modeParam,
    returnTo: returnToParam,
  } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fallback = getMockData(getParam(id as string | string[] | undefined, ''));
  const returnTo = getParam(returnToParam as string | string[] | undefined, '');
  const mode = getParam(modeParam as string | string[] | undefined, '');

  const isMyBooksDetail = mode === 'loan' || returnTo === '/(student)/loan';
  const loanBorrowDate = getParam(borrowDateParam as string | string[] | undefined, '');
  const loanReturnDate = getParam(returnDateParam as string | string[] | undefined, '');
  const loanStatus = getParam(statusParam as string | string[] | undefined, '');
  const item = {
    id: getParam(id as string | string[] | undefined, fallback.id),
    type: getParam(type as string | string[] | undefined, fallback.type),
    title: getParam(title as string | string[] | undefined, fallback.title),
    author: getParam(author as string | string[] | undefined, fallback.author),
    available: getNumberParam(available as string | string[] | undefined, fallback.available),
    totalCopies: getNumberParam(totalCopies as string | string[] | undefined, fallback.totalCopies),
    location: getParam(location as string | string[] | undefined, fallback.location),
    libraryName: getParam(libraryName as string | string[] | undefined, fallback.libraryName),
    tag: getParam(tag as string | string[] | undefined, fallback.tag),
    description: getParam(description as string | string[] | undefined, fallback.description),
  };

  const [durationDays, setDurationDays] = useState('7');
  const [durationError, setDurationError] = useState<string | null>(null);

  const durationParsed = useMemo(() => {
    const parsed = Number(durationDays);
    return Number.isFinite(parsed) ? Math.floor(parsed) : NaN;
  }, [durationDays]);

  const todayIso = useMemo(() => toISODateOnly(new Date()), []);
  const returnIso = useMemo(() => {
    if (!Number.isFinite(durationParsed) || durationParsed <= 0) return '';
    return toISODateOnly(addDays(new Date(), durationParsed));
  }, [durationParsed]);

  const canRequest =
    !isMyBooksDetail && item.available > 0 && Number.isFinite(durationParsed) && durationParsed > 0 && durationParsed <= 30;

  const handleRequest = () => {
    if (isMyBooksDetail) return;

    if (item.available <= 0) {
      setDurationError('This book is currently unavailable.');
      return;
    }
    if (!Number.isFinite(durationParsed) || durationParsed <= 0) {
      setDurationError('Please enter a valid number of days.');
      return;
    }
    if (durationParsed > 30) {
      setDurationError('Maximum reservation duration is 30 days.');
      return;
    }

    setDurationError(null);

    addLoan({
      id: item.id,
      type: item.type === 'paper' ? 'paper' : 'book',
      title: item.title,
      author: item.author,
      borrowDate: todayIso,
      returnDate: returnIso,
      status: 'Pending',
      location: item.location,
      description: item.description,
      totalCopies: item.totalCopies,
      available: item.available,
      libraryName: item.libraryName,
      tag: item.tag,
      durationDays: durationParsed,
    });

    router.replace('/(student)/loan');
  };
  const heroIcon = item.type === 'paper' ? 'file-text-o' : 'book';
  const handleBack = () => {
    if (returnTo) {
      router.replace(returnTo);
      return;
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView>
        <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.imageArea}>
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <FontAwesome name="arrow-left" size={18} color="#FFF" />
          </Pressable>
          <FontAwesome name={heroIcon} size={80} color="#FFF" style={styles.heroIcon} />
        </LinearGradient>

        <View style={[styles.contentArea, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.author, { color: colors.textSecondary }]}>By {item.author}</Text>

          <View style={styles.pillsRow}>
            {item.libraryName ? (
              <View style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border }]}> 
                <FontAwesome name="university" size={13} color={colors.textSecondary} />
                <Text style={[styles.pillText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.libraryName}
                </Text>
              </View>
            ) : null}
            {item.tag ? (
              <View style={[styles.pill, { backgroundColor: colors.background, borderColor: colors.border }]}> 
                <FontAwesome name="tag" size={13} color={colors.textSecondary} />
                <Text style={[styles.pillText, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.tag}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: colors.background }]}> 
              <Text style={[styles.statValue, { color: colors.text }]}>
                {item.available} / {item.totalCopies}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Available</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: colors.background }]}> 
              <Text style={[styles.statValue, { color: colors.text }]} numberOfLines={2}>
                {item.location}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Location</Text>
            </View>
          </View>

          {isMyBooksDetail ? (
            <View style={[styles.infoCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Borrowed</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{loanBorrowDate ? formatDate(loanBorrowDate) : '—'}</Text>
              </View>
              <View style={[styles.infoRow, { borderTopColor: colors.border }]}> 
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Return date</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}> 
                  {loanReturnDate ? formatDate(loanReturnDate) : '—'}
                </Text>
              </View>
            </View>
          ) : (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Reservation duration</Text>
              <Text style={[styles.helperText, { color: colors.textSecondary }]}>Choose how many days you need this book. This sets your return date.</Text>

              <View style={[styles.durationCard, { backgroundColor: colors.background, borderColor: colors.border }]}> 
                <View style={styles.durationRow}>
                  <TextInput
                    value={durationDays}
                    onChangeText={(text) => {
                      setDurationError(null);
                      setDurationDays(text.replace(/[^0-9]/g, ''));
                    }}
                    keyboardType="numeric"
                    placeholder="7"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.durationInput, { color: colors.text, borderColor: colors.border }]}
                    maxLength={2}
                  />
                  <Text style={[styles.durationUnit, { color: colors.textSecondary }]}>days</Text>

                  <View style={styles.quickRow}>
                    {[7, 14, 30].map((d) => {
                      const active = durationDays === String(d);
                      return (
                        <Pressable
                          key={d}
                          onPress={() => {
                            setDurationError(null);
                            setDurationDays(String(d));
                          }}
                          style={[
                            styles.quickChip,
                            {
                              backgroundColor: active ? colors.primary : colors.surface,
                              borderColor: active ? colors.primary : colors.border,
                            },
                          ]}
                        >
                          <Text style={{ color: active ? '#FFF' : colors.textSecondary, fontWeight: '800', fontSize: 12 }}>
                            {d}d
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View style={[styles.previewRow, { borderTopColor: colors.border }]}> 
                  <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>Estimated return date</Text>
                  <Text style={[styles.previewValue, { color: colors.text }]}>{returnIso ? formatDate(returnIso) : '—'}</Text>
                </View>

                {durationError ? <Text style={[styles.errorText, { color: colors.error }]}>{durationError}</Text> : null}
              </View>
            </>
          )}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>

          {!isMyBooksDetail ? (
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: colors.primary,
                  opacity: !canRequest ? 0.5 : pressed ? 0.85 : 1,
                },
              ]}
              onPress={handleRequest}
              disabled={!canRequest}
            >
              <Text style={styles.actionButtonText}>Request Book</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageArea: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIcon: {
    opacity: 0.9,
  },
  contentArea: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    marginBottom: 14,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  helperText: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    marginBottom: 12,
  },
  durationCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 22,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 6,
    marginBottom: 22,
  },
  infoRow: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'transparent',
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '900',
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  durationInput: {
    width: 70,
    height: 46,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  durationUnit: {
    fontSize: 13,
    fontWeight: '700',
  },
  quickRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  quickChip: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewValue: {
    fontSize: 13,
    fontWeight: '900',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 32,
  },
  actionButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
