import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '../../../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const item = getMockData(id as string);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.imageArea, { backgroundColor: colors.primary }]}>
        <FontAwesome name="book" size={80} color="#FFF" style={styles.heroIcon} />
      </View>
      
      <View style={[styles.contentArea, { backgroundColor: colors.surface }]}>
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
  heroIcon: {
    opacity: 0.9,
  },
  contentArea: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
