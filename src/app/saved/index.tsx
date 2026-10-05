import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { MiniBars } from '@/components/MiniBars';
import { formatDate } from '@/lib/format';
import { useGame } from '@/state/GameContext';
import { colors } from '@/theme';

export default function SavedGamesScreen() {
  const { saved } = useGame();

  return (
    <FlatList
      data={saved}
      keyExtractor={(g) => g.id}
      contentContainerStyle={styles.list}
      contentInsetAdjustmentBehavior="automatic"
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="folder-open-outline" size={40} color={colors.textFaint} />
          <Text style={styles.emptyTitle}>No saved games yet</Text>
          <Text style={styles.emptyText}>When a game ends, tap Save / New on the tracker to keep its stats here.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push({ pathname: '/saved/[id]', params: { id: item.id } })}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        >
          <View style={styles.rowText}>
            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.meta}>
              {formatDate(item.startedAt)} · {item.rolls.length} rolls
            </Text>
          </View>
          <MiniBars rolls={item.rolls} />
          <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  pressed: { opacity: 0.7 },
  rowText: { flex: 1 },
  name: { color: colors.text, fontSize: 17, fontWeight: '700' },
  meta: { color: colors.textDim, fontSize: 13, marginTop: 2 },
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32, gap: 8 },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  emptyText: { color: colors.textDim, fontSize: 14, textAlign: 'center' },
});
