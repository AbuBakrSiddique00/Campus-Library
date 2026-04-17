import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';

interface NotificationPopupProps {
  visible: boolean;
  onClose: () => void;
}

const MOCK_DATA = [
  { id: '1', type: 'success', title: 'New Book Added', msg: '"Design Patterns" is now available.', time: '2m ago' },
  { id: '2', type: 'warning', title: 'Due Alert', msg: 'Your book "Networks" is due tomorrow.', time: '1h ago' },
  { id: '3', type: 'info', title: 'Library Notice', msg: 'Weekend hours are 9:00 AM to 3:00 PM.', time: '3h ago' },
] as const;

function getIcon(type: (typeof MOCK_DATA)[number]['type']) {
  if (type === 'success') return 'check';
  if (type === 'warning') return 'clock-o';
  return 'info';
}

export default function NotificationPopup({ visible, onClose }: NotificationPopupProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.panel, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
              <Text style={[styles.headerSub, { color: colors.textSecondary }]}>3 unread updates</Text>
            </View>
            <Pressable
              onPress={onClose}
              style={[styles.closeBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
            >
              <FontAwesome name="times" size={14} color={colors.textSecondary} />
            </Pressable>
          </View>

          <FlatList
            data={MOCK_DATA}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const toneColor =
                item.type === 'success' ? colors.success : item.type === 'warning' ? '#E5A200' : colors.primary;
              return (
                <View style={[styles.itemCard, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <View style={[styles.iconWrap, { backgroundColor: toneColor + '1A' }]}>
                    <FontAwesome name={getIcon(item.type)} size={12} color={toneColor} />
                  </View>
                  <View style={styles.itemBody}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.itemMsg, { color: colors.textSecondary }]} numberOfLines={2}>
                      {item.msg}
                    </Text>
                  </View>
                  <Text style={[styles.timeText, { color: colors.textSecondary }]}>{item.time}</Text>
                </View>
              );
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 12, 24, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 74 : 54,
    paddingHorizontal: 14,
  },
  panel: {
    width: '100%',
    maxWidth: 430,
    maxHeight: 470,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#0A1224',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    elevation: 10,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 12,
    gap: 8,
  },
  itemCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  itemBody: {
    flex: 1,
    paddingRight: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  itemMsg: {
    fontSize: 12,
    lineHeight: 17,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
