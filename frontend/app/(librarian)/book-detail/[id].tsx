import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Colors from '../../../constants/Colors';

type ItemType = 'book' | 'paper';

type LibraryItem = {
  id: string;
  type: ItemType;
  title: string;
  author: string;
  available: number;
  totalCopies: number;
  location: string;
  shelf: string;
  tag: string;
  description: string;
};

const normalizeType = (value: string): ItemType => (value === 'paper' ? 'paper' : 'book');

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getMockData = (id: string) => {
  return {
    id,
    type: 'book',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    available: 3,
    totalCopies: 5,
    location: 'Shelf A - Row 4',
    shelf: 'A-4',
    tag: 'Computer Science',
    description: 'Comprehensive guide to algorithms with practical analysis and core techniques.',
  };
};

const getParam = (value: string | string[] | undefined, fallback: string) => {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
};

const getNumberParam = (value: string | string[] | undefined, fallback: number) => {
  const resolved = Array.isArray(value) ? value[0] : value;
  const parsed = Number(resolved);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export default function LibrarianBookDetailScreen() {
  const {
    id,
    title,
    author,
    available,
    totalCopies,
    location,
    shelf,
    tag,
    description,
    type,
    returnTo: returnToParam,
  } = useLocalSearchParams();

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const fallback = getMockData(getParam(id as string | string[] | undefined, ''));
  const returnTo = getParam(returnToParam as string | string[] | undefined, '');

  const initialItem: LibraryItem = {
    id: getParam(id as string | string[] | undefined, fallback.id),
    type: normalizeType(getParam(type as string | string[] | undefined, fallback.type)),
    title: getParam(title as string | string[] | undefined, fallback.title),
    author: getParam(author as string | string[] | undefined, fallback.author),
    available: getNumberParam(available as string | string[] | undefined, fallback.available),
    totalCopies: getNumberParam(totalCopies as string | string[] | undefined, fallback.totalCopies),
    location: getParam(location as string | string[] | undefined, fallback.location),
    shelf: getParam(shelf as string | string[] | undefined, fallback.shelf),
    tag: getParam(tag as string | string[] | undefined, fallback.tag),
    description: getParam(description as string | string[] | undefined, fallback.description),
  };

  const [item, setItem] = useState<LibraryItem>(initialItem);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);

  const [editError, setEditError] = useState<string | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);

  const [editDraft, setEditDraft] = useState<Pick<
    LibraryItem,
    'type' | 'title' | 'author' | 'location' | 'shelf' | 'tag' | 'description'
  >>(() => ({
    type: initialItem.type,
    title: initialItem.title,
    author: initialItem.author,
    location: initialItem.location,
    shelf: initialItem.shelf,
    tag: initialItem.tag,
    description: initialItem.description,
  }));

  const [stockDraft, setStockDraft] = useState<Pick<LibraryItem, 'available' | 'totalCopies'>>(() => ({
    available: initialItem.available,
    totalCopies: initialItem.totalCopies,
  }));

  useEffect(() => {
    setItem(initialItem);
    setStatusMessage(null);
  }, [initialItem.id]);

  const openEdit = () => {
    setEditError(null);
    setEditDraft({
      type: item.type,
      title: item.title,
      author: item.author,
      location: item.location,
      shelf: item.shelf,
      tag: item.tag,
      description: item.description,
    });
    setEditOpen(true);
  };

  const openStock = () => {
    setStockError(null);
    setStockDraft({ available: item.available, totalCopies: item.totalCopies });
    setStockOpen(true);
  };

  const saveEdits = () => {
    const nextTitle = editDraft.title.trim();
    const nextAuthor = editDraft.author.trim();

    if (!nextTitle) {
      setEditError('Title is required.');
      return;
    }
    if (!nextAuthor) {
      setEditError('Author is required.');
      return;
    }

    setItem((prev) => ({
      ...prev,
      type: editDraft.type,
      title: nextTitle,
      author: nextAuthor,
      location: editDraft.location.trim(),
      shelf: editDraft.shelf.trim(),
      tag: editDraft.tag.trim(),
      description: editDraft.description.trim(),
    }));

    setEditOpen(false);
    setStatusMessage('Book details updated.');
  };

  const saveStock = () => {
    const total = Math.max(0, Math.floor(stockDraft.totalCopies));
    const availableNow = clamp(Math.floor(stockDraft.available), 0, total);

    if (availableNow > total) {
      setStockError('Available copies cannot exceed total copies.');
      return;
    }

    setItem((prev) => ({
      ...prev,
      totalCopies: total,
      available: availableNow,
    }));

    setStockOpen(false);
    setStatusMessage('Stock updated.');
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.hero}>
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <FontAwesome name="arrow-left" size={18} color="#FFF" />
          </Pressable>
          <FontAwesome name={heroIcon} size={80} color="#FFF" style={styles.heroIcon} />
          <Text style={styles.heroTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.heroSubtitle} numberOfLines={1}>
            {item.author}
          </Text>
        </LinearGradient>

        <View style={[styles.contentArea, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {statusMessage ? (
            <View style={[styles.banner, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.bannerText, { color: colors.text }]}>{statusMessage}</Text>
              <Pressable onPress={() => setStatusMessage(null)} style={styles.bannerClose}>
                <FontAwesome name="times" size={16} color={colors.textSecondary} />
              </Pressable>
            </View>
          ) : null}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Book Information</Text>

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

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Shelf</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{item.shelf || '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Category</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{item.tag || '—'}</Text>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 18 }]}>Description</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description || '—'}</Text>

          <View style={styles.actionsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: colors.border,
                  backgroundColor: pressed ? colors.background : 'transparent',
                },
              ]}
              onPress={openEdit}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Edit</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.88 : 1 },
              ]}
              onPress={openStock}
            >
              <Text style={styles.primaryButtonText}>Adjust Stock</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={editOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setEditOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setEditOpen(false)} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalRoot}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}> 
              <Text style={[styles.modalTitle, { color: colors.text }]}>Edit book</Text>
              <Pressable onPress={() => setEditOpen(false)} style={styles.modalClose}>
                <FontAwesome name="times" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Type</Text>
              <View style={styles.segmentRow}>
                {(['book', 'paper'] as const).map((t) => {
                  const active = editDraft.type === t;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => setEditDraft((d) => ({ ...d, type: t }))}
                      style={[
                        styles.segmentBtn,
                        {
                          borderColor: colors.border,
                          backgroundColor: active ? colors.primary : 'transparent',
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: active ? '#FFF' : colors.textSecondary,
                          fontWeight: '800',
                          fontSize: 13,
                          textTransform: 'capitalize',
                        }}
                      >
                        {t}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Title</Text>
              <TextInput
                value={editDraft.title}
                onChangeText={(text) => {
                  setEditError(null);
                  setEditDraft((d) => ({ ...d, title: text }));
                }}
                placeholder="Book title"
                placeholderTextColor={colors.textSecondary}
                style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
              />

              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Author</Text>
              <TextInput
                value={editDraft.author}
                onChangeText={(text) => {
                  setEditError(null);
                  setEditDraft((d) => ({ ...d, author: text }));
                }}
                placeholder="Author name"
                placeholderTextColor={colors.textSecondary}
                style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
              />

              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Category</Text>
              <TextInput
                value={editDraft.tag}
                onChangeText={(text) => setEditDraft((d) => ({ ...d, tag: text }))}
                placeholder="e.g. Computer Science"
                placeholderTextColor={colors.textSecondary}
                style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
              />

              <View style={styles.twoColRow}>
                <View style={styles.twoCol}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Shelf</Text>
                  <TextInput
                    value={editDraft.shelf}
                    onChangeText={(text) => setEditDraft((d) => ({ ...d, shelf: text }))}
                    placeholder="e.g. A-4"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
                  />
                </View>
                <View style={styles.twoCol}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Location</Text>
                  <TextInput
                    value={editDraft.location}
                    onChangeText={(text) => setEditDraft((d) => ({ ...d, location: text }))}
                    placeholder="Shelf A - Row 4"
                    placeholderTextColor={colors.textSecondary}
                    style={[styles.fieldInput, { borderColor: colors.border, color: colors.text }]}
                  />
                </View>
              </View>

              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Description</Text>
              <TextInput
                value={editDraft.description}
                onChangeText={(text) => setEditDraft((d) => ({ ...d, description: text }))}
                placeholder="Short description"
                placeholderTextColor={colors.textSecondary}
                multiline
                style={[
                  styles.fieldInput,
                  styles.fieldTextArea,
                  { borderColor: colors.border, color: colors.text },
                ]}
              />

              {editError ? <Text style={[styles.errorText, { color: colors.error }]}>{editError}</Text> : null}
            </ScrollView>

            <View style={[styles.modalActions, { borderTopColor: colors.border }]}> 
              <Pressable
                style={[styles.modalActionBtn, { borderColor: colors.border }]}
                onPress={() => setEditOpen(false)}
              >
                <Text style={[styles.modalActionText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalActionBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={saveEdits}
              >
                <Text style={styles.modalActionTextPrimary}>Save</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={stockOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setStockOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setStockOpen(false)} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalRoot}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}> 
              <Text style={[styles.modalTitle, { color: colors.text }]}>Adjust stock</Text>
              <Pressable onPress={() => setStockOpen(false)} style={styles.modalClose}>
                <FontAwesome name="times" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.stepRow}>
                <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>Total copies</Text>
                <View style={styles.stepControls}>
                  <Pressable
                    onPress={() =>
                      setStockDraft((d) => {
                        setStockError(null);
                        const total = Math.max(0, d.totalCopies - 1);
                        const availableNow = Math.min(d.available, total);
                        return { ...d, totalCopies: total, available: availableNow };
                      })
                    }
                    style={[styles.stepBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
                  >
                    <Text style={[styles.stepBtnText, { color: colors.text }]}>−</Text>
                  </Pressable>
                  <Text style={[styles.stepValue, { color: colors.text }]}>{stockDraft.totalCopies}</Text>
                  <Pressable
                    onPress={() =>
                      setStockDraft((d) => {
                        setStockError(null);
                        return { ...d, totalCopies: d.totalCopies + 1 };
                      })
                    }
                    style={[styles.stepBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
                  >
                    <Text style={[styles.stepBtnText, { color: colors.text }]}>+</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.stepRow}>
                <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>Available now</Text>
                <View style={styles.stepControls}>
                  <Pressable
                    onPress={() =>
                      setStockDraft((d) => {
                        setStockError(null);
                        return { ...d, available: Math.max(0, d.available - 1) };
                      })
                    }
                    style={[styles.stepBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
                  >
                    <Text style={[styles.stepBtnText, { color: colors.text }]}>−</Text>
                  </Pressable>
                  <Text style={[styles.stepValue, { color: colors.text }]}>{stockDraft.available}</Text>
                  <Pressable
                    onPress={() =>
                      setStockDraft((d) => {
                        setStockError(null);
                        return { ...d, available: Math.min(d.totalCopies, d.available + 1) };
                      })
                    }
                    style={[styles.stepBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
                  >
                    <Text style={[styles.stepBtnText, { color: colors.text }]}>+</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                onPress={() => setStockDraft((d) => ({ ...d, available: d.totalCopies }))}
                style={[styles.pillBtn, { backgroundColor: colors.primary + '12', borderColor: colors.primary + '22' }]}
              >
                <Text style={[styles.pillText, { color: colors.primary }]}>Set Available = Total</Text>
              </Pressable>

              {stockError ? <Text style={[styles.errorText, { color: colors.error }]}>{stockError}</Text> : null}
              <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                Tip: Available copies are automatically kept within 0…Total.
              </Text>
            </View>

            <View style={[styles.modalActions, { borderTopColor: colors.border }]}> 
              <Pressable
                style={[styles.modalActionBtn, { borderColor: colors.border }]}
                onPress={() => setStockOpen(false)}
              >
                <Text style={[styles.modalActionText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalActionBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={saveStock}
              >
                <Text style={styles.modalActionTextPrimary}>Save</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  hero: {
    height: 270,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
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
  heroIcon: { opacity: 0.9, marginBottom: 12 },
  heroTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  contentArea: {
    flex: 1,
    marginTop: -26,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 22,
    marginHorizontal: 0,
  },
  banner: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
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
    fontWeight: '700',
  },
  infoValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 8,
  },
  secondaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
  },
  primaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 18 : 12,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: '88%',
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  fieldInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '700',
  },
  fieldTextArea: {
    height: 110,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 10,
  },
  twoCol: {
    flex: 1,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  segmentBtn: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActions: {
    borderTopWidth: 1,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
  },
  modalActionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActionText: {
    fontSize: 14,
    fontWeight: '900',
  },
  modalActionTextPrimary: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
  },
  errorText: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '800',
  },
  stepControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnText: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: -1,
  },
  stepValue: {
    minWidth: 44,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '900',
  },
  pillBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '900',
  },
});
