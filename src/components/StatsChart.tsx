import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';

import { countRolls, expectedPct, FACES, type Roll } from '@/lib/dice';
import { colors } from '@/theme';
import { RollDie } from './RollDie';

const COLUMN_GAP = 4;

type Props = {
  rolls: Roll[];
  barHeight?: number;
};

export function StatsChart({ rolls, barHeight = 120 }: Props) {
  const [width, setWidth] = useState(0);
  const counts = useMemo(() => countRolls(rolls), [rolls]);
  const total = rolls.length;
  const lastValue = rolls[rolls.length - 1]?.value;

  const pct = (n: number) => (total ? (counts[n] / total) * 100 : 0);
  // Keep the expected markers on-scale even when no number is over-represented yet.
  const scaleMax = Math.max(expectedPct(7) * 1.2, ...FACES.map(pct));
  const toHeight = (p: number) => (p / scaleMax) * barHeight;

  // Each number's die fills its column, within readable limits.
  const columnWidth = (width - COLUMN_GAP * (FACES.length - 1)) / FACES.length;
  const dieSize = Math.min(30, Math.max(20, Math.floor(columnWidth)));

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.totalLabel}>TOTAL ROLLS</Text>
          <Text style={styles.total}>{total}</Text>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={styles.legendSwatch} />
            <Text style={styles.legendText}>Actual</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendLine} />
            <Text style={styles.legendText}>Expected</Text>
          </View>
        </View>
      </View>

      <View style={styles.columns} onLayout={onLayout}>
        {FACES.map((n) => (
          <View key={n} style={styles.column}>
            <RollDie value={n} size={dieSize} highlighted={n === lastValue} />
            <View style={[styles.track, { height: barHeight }]}>
              <View
                style={[
                  styles.bar,
                  { height: toHeight(pct(n)), backgroundColor: n === 7 ? colors.seven : colors.bar },
                ]}
              />
              <View style={[styles.expected, { bottom: toHeight(expectedPct(n)) - 1 }]} />
            </View>
            <Text style={[styles.count, counts[n] === 0 && styles.dim]}>{counts[n]}</Text>
            <Text style={styles.pct}>{total ? `${Math.round(pct(n))}%` : '–'}</Text>
          </View>
        ))}
      </View>
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
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  totalLabel: { color: colors.textDim, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  total: { color: colors.text, fontSize: 34, fontWeight: '800', fontVariant: ['tabular-nums'] },
  legend: { gap: 6, paddingTop: 2 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendSwatch: { width: 12, height: 10, borderRadius: 2, backgroundColor: colors.bar },
  legendLine: { width: 12, height: 2, backgroundColor: colors.expected },
  legendText: { color: colors.textDim, fontSize: 12 },
  columns: { flexDirection: 'row', gap: COLUMN_GAP },
  column: { flex: 1, alignItems: 'center' },
  track: {
    width: '100%',
    marginTop: 8,
    backgroundColor: colors.barTrack,
    borderRadius: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  bar: { width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  expected: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: colors.expected },
  count: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
    fontVariant: ['tabular-nums'],
  },
  dim: { color: colors.textFaint },
  pct: { color: colors.textDim, fontSize: 11, marginTop: 1, fontVariant: ['tabular-nums'] },
});
