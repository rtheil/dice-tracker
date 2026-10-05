import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { countRolls, FACES, type Roll } from '@/lib/dice';
import { colors } from '@/theme';

/** Tiny distribution sparkline for list rows. */
export function MiniBars({ rolls, height = 28 }: { rolls: Roll[]; height?: number }) {
  const counts = useMemo(() => countRolls(rolls), [rolls]);
  const max = Math.max(1, ...FACES.map((n) => counts[n]));

  return (
    <View style={[styles.row, { height }]}>
      {FACES.map((n) => (
        <View
          key={n}
          style={[
            styles.bar,
            {
              height: Math.max(2, (counts[n] / max) * height),
              backgroundColor: n === 7 ? colors.seven : colors.bar,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 4, borderRadius: 1 },
});
