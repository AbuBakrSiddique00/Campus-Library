import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const MOCK_EXCHANGES = [
  { id: '1', type: 'Request', student: 'Alice M.', title: 'Calculus 5th Ed', notes: 'Need it for next semester.' },
  { id: '2', type: 'Offer', student: 'Bob S.', title: 'Physics 101', notes: 'Selling for $10 or trade.' },
];

export default function ExchangeScreen() {
  const [activeTab, setActiveTab] = useState<'All' | 'Offer' | 'Request'>('All');
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const filteredData = activeTab === 'All' 
    ? MOCK_EXCHANGES 
    : MOCK_EXCHANGES.filter(item => item.type === activeTab);

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.typeBadge, { 
          backgroundColor: item.type === 'Offer' ? colors.success + '20' : colors.primary + '20',
          color: item.type === 'Offer' ? colors.success : colors.primary
        }]}>
          {item.type}
        </Text>
        <Text style={[styles.studentName, { color: colors.textSecondary }]}>{item.student}</Text>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.notes, { color: colors.textSecondary }]}>{item.notes}</Text>
      <Pressable style={styles.contactBtn}>
        <Text style={[styles.contactText, { color: colors.primary }]}>Contact</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.filterRow}>
        {['All', 'Offer', 'Request'].map(tab => (
          <Pressable 
            key={tab}
            style={[
              styles.tab, 
              { borderColor: colors.border },
              activeTab === tab && { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? '#FFF' : colors.textSecondary }]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <Pressable style={[styles.fab, { backgroundColor: colors.primary }]}>
        <FontAwesome name="plus" size={24} color="#FFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDE5F5',
  },
  tabText: {
    fontWeight: '600',
  },
  listContainer: { padding: 16, paddingTop: 0, paddingBottom: 80 },
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
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: 'bold',
    fontSize: 12,
    overflow: 'hidden',
  },
  studentName: {
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    marginBottom: 16,
  },
  contactBtn: {
    alignSelf: 'flex-start',
  },
  contactText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  }
});
