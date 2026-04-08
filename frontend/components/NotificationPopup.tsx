import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, FlatList } from 'react-native';
import Colors from '../constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface NotificationPopupProps {
  visible: boolean;
  onClose: () => void;
}

const MOCK_DATA = [
  { id: '1', title: 'New Book Added', msg: '"Design Patterns" is now available.', time: '2m ago' },
  { id: '2', title: 'Due Alert', msg: 'Your book "Networks" is due tomorrow.', time: '1h ago' },
];

export default function NotificationPopup({ visible, onClose }: NotificationPopupProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Background Dimmer */}
      <Pressable style={styles.overlay} onPress={onClose}>
        
        {/* Floating Dropdown Box */}
        <Pressable style={[styles.popupBlock, { backgroundColor: colors.surface }]} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Updates</Text>
            <Pressable onPress={onClose}>
              <FontAwesome name="times" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <FlatList
            data={MOCK_DATA}
            keyExtractor={it => it.id}
            contentContainerStyle={styles.listArea}
            renderItem={({ item }) => (
              <View style={[styles.itemCard, { borderBottomColor: colors.border }]}>
                <View style={styles.iconCircle}>
                  <FontAwesome name="bell" size={12} color="#10B981" />
                </View>
                <View style={styles.itemTextData}>
                  <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.itemMsg, { color: colors.textSecondary }]}>{item.msg}</Text>
                </View>
                <Text style={styles.timeStr}>{item.time}</Text>
              </View>
            )}
          />

        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // The "blurry"/dark background!
    alignItems: 'flex-end', 
  },
  popupBlock: {
    marginTop: 100, // Distance from top so it sits neatly right below the header tabs!
    marginRight: 20,
    width: 320,
    maxHeight: 400,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  listArea: {
    paddingBottom: 8,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  itemTextData: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  itemMsg: {
    fontSize: 12,
  },
  timeStr: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 12,
  }
});
