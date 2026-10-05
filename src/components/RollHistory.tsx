import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import type { Roll } from '@/lib/dice';
import { colors } from '@/theme';
import { RollDie } from './RollDie';

const LATEST = 48;
const DIE = 34;
const GAP = 8;

type Props = {
  rolls: Roll[];
  /** Opens the detailed history screen. */
  onShowAll?: () => void;
};

export function RollHistory({ rolls, onShowAll }: Props) {
  const [width, setWidth] = useState(0);

  const newestFirst = useMemo(
    () => rolls.map((roll, i) => ({ ...roll, number: i + 1 })).reverse(),
    [rolls],
  );
  const [latest, ...older] = newestFirst;

  // Show as many older rolls as fit on one line; the full list lives on its own screen.
  const fitCount = width ? Math.max(1, Math.floor((width + GAP) / (DIE + GAP))) : 6;
  const visible = older.slice(0, fitCount);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>History</Text>
        {onShowAll && rolls.length > 0 && (
          <Pressable onPress={onShowAll} hitSlop={10} style={styles.showAll}>
            <Text style={styles.toggle}>Show all {rolls.length}</Text>
            <Ionicons name="chevron-forward" size={15} color={colors.primary} />
          </Pressable>
        )}
      </View>

      {!latest ? (
        <Text style={styles.empty}>No rolls yet. Tap a number below after each roll.</Text>
      ) : (
        <View style={styles.body}>
          <View style={styles.latest}>
            <RollDie value={latest.value} size={LATEST} highlighted />
            <Text style={styles.latestLabel}>LAST</Text>
          </View>

          <View style={styles.olderArea} onLayout={onLayout}>
            {older.length === 0 ? (
              <Text style={styles.olderHint}>Earlier rolls show here, newest first.</Text>
            ) : (
              <View style={styles.dice}>
                {visible.map((roll) => (
                  <View key={roll.number} style={styles.item}>
                    <RollDie value={roll.value} size={DIE} />
                    <Text style={styles.number}>#{roll.number}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: { color: colors.textDim, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  showAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  toggle: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  empty: { color: colors.textFaint, fontSize: 14, paddingVertical: 8 },
  body: { flexDirection: 'row', alignItems: 'flex-start' },
  latest: {
    alignItems: 'center',
    paddingTop: 3,
    paddingRight: 14,
    marginRight: 14,
    borderRightWidth: 1,
    borderRightColor: colors.cardBorder,
  },
  latestLabel: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 6 },
  olderArea: { flex: 1, paddingTop: 3, justifyContent: 'center', minHeight: LATEST },
  olderHint: { color: colors.textFaint, fontSize: 13 },
  dice: { flexDirection: 'row', gap: GAP, overflow: 'hidden' },
  item: { alignItems: 'center', width: DIE },
  number: { color: colors.textFaint, fontSize: 10, marginTop: 3, fontVariant: ['tabular-nums'] },
});
