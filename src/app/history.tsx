import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { RollDie } from '@/components/RollDie';
import type { Roll } from '@/lib/dice';
import { formatDate, formatElapsed, formatTime } from '@/lib/format';
import { useNow } from '@/lib/useNow';
import { useGame } from '@/state/GameContext';
import { colors } from '@/theme';

const NO_ROLLS: Roll[] = [];

/**
 * Every roll with its time and the gap since the previous roll.
 * Shows the game in progress, or a saved game when `?game=<id>` is given.
 */
export default function HistoryScreen() {
  const { game: gameId } = useLocalSearchParams<{ game?: string }>();
  const { current, saved } = useGame();
  const savedGame = gameId ? saved.find((g) => g.id === gameId) : undefined;
  const rolls = gameId ? (savedGame?.rolls ?? NO_ROLLS) : current.rolls;
  const live = !gameId;

  // The game in progress keeps its clock running; a saved game is frozen at its last roll.
  const now = useNow(live ? 1000 : null);

  const rows = useMemo(
    () =>
      rolls
        .map((roll, i) => ({
          ...roll,
          number: i + 1,
          gap: i > 0 ? roll.at - rolls[i - 1].at : null,
        }))
        .reverse(),
    [rolls],
  );

  const first = rolls[0];
  const last = rolls[rolls.length - 1];
  const gameTime = first ? (live ? Math.max(now, last.at) : last.at) - first.at : 0;
  const avgGap = rolls.length > 1 ? (last.at - first.at) / (rolls.length - 1) : null;

  return (
    <>
      <Stack.Screen options={{ title: savedGame ? savedGame.name : 'Roll History' }} />
      <FlatList
        data={rows}
        keyExtractor={(r) => String(r.number)}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        ListHeaderComponent={
          <View style={styles.summary}>
            <View style={styles.stats}>
              <Stat label="GAME TIME" value={formatElapsed(gameTime)} />
              <Stat label="ROLLS" value={String(rolls.length)} />
              <Stat label="AVG / ROLL" value={avgGap == null ? '–' : formatElapsed(avgGap)} />
            </View>
            {first && (
              <Text style={styles.meta}>
                {formatDate(first.at)} · Started {formatTime(first.at)} ·{' '}
                {live
                  ? `last roll ${formatElapsed(Math.max(0, now - last.at))} ago`
                  : `ended ${formatTime(last.at)}`}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>No rolls yet.</Text>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.number}>#{item.number}</Text>
            <RollDie value={item.value} size={34} highlighted={index === 0} />
            <Text style={styles.time}>{formatTime(item.at)}</Text>
            <Text style={styles.gap}>{item.gap == null ? 'first roll' : `+${formatElapsed(item.gap)}`}</Text>
          </View>
        )}
      />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  summary: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
    marginBottom: 12,
  },
  stats: { flexDirection: 'row' },
  stat: { flex: 1 },
  statLabel: { color: colors.textDim, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  statValue: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 2, fontVariant: ['tabular-nums'] },
  meta: { color: colors.textDim, fontSize: 13 },
  empty: { color: colors.textFaint, fontSize: 15, textAlign: 'center', paddingTop: 40 },
  separator: { height: 1, backgroundColor: colors.cardBorder, marginLeft: 56 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9, paddingHorizontal: 4 },
  number: { width: 40, color: colors.textFaint, fontSize: 13, fontVariant: ['tabular-nums'] },
  time: { flex: 1, color: colors.text, fontSize: 16, fontVariant: ['tabular-nums'] },
  gap: { color: colors.textDim, fontSize: 14, fontVariant: ['tabular-nums'] },
});
