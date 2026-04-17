import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
    description: 'This mathematically rigorous text introduces calculus early, setting the foundation for engineering and mathematics coursework.',
    totalCopies: 5
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

export default function DetailScreen() {
  const { id, title, author, available, totalCopies, location, description, type } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const fallback = getMockData(getParam(id as string | string[] | undefined, ''));
  const item = {
    id: getParam(id as string | string[] | undefined, fallback.id),
    type: getParam(type as string | string[] | undefined, fallback.type),
    title: getParam(title as string | string[] | undefined, fallback.title),
    author: getParam(author as string | string[] | undefined, fallback.author),
    available: getNumberParam(available as string | string[] | undefined, fallback.available),
    totalCopies: getNumberParam(totalCopies as string | string[] | undefined, fallback.totalCopies),
    location: getParam(location as string | string[] | undefined, fallback.location),
    description: getParam(description as string | string[] | undefined, fallback.description),
  };
  const heroIcon = item.type === 'paper' ? 'file-text-o' : 'book';

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.imageArea}
      >
        <Pressable
          onPress={() => router.back()}
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
        
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.background }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{item.available} / {item.totalCopies}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Available</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.background }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{item.location}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Location</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>{item.description}</Text>

        <Pressable 
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => alert('Request sent to librarian!')}
        >
          <Text style={styles.actionButtonText}>Request Book</Text>
        </Pressable>
      </View>
    </ScrollView>
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
    marginBottom: 24,
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
    marginBottom: 12,
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
