import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { isHot, ways } from '@/lib/dice';
import { colors } from '@/theme';

type Props = {
  onRoll: (value: number) => void;
  onUndo: () => void;
  canUndo: boolean;
  buttonHeight?: number;
};

const ROWS: (number | 'undo')[][] = [
  [2, 3, 4, 5],
  [6, 7, 8, 9],
  [10, 11, 12, 'undo'],
];

export function RollPad({ onRoll, onUndo, canUndo, buttonHeight = 66 }: Props) {
  return (
    <View style={styles.pad}>
      {ROWS.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((cell) =>
            cell === 'undo' ? (
              <Pressable
                key="undo"
                onPress={onUndo}
                disabled={!canUndo}
                accessibilityLabel="Undo last roll"
                style={({ pressed }) => [
                  styles.button,
                  { height: buttonHeight },
                  styles.undo,
                  !canUndo && styles.disabled,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons name="arrow-undo" size={22} color={colors.text} />
                <Text style={styles.undoText}>Undo</Text>
              </Pressable>
            ) : (
              <NumberButton key={cell} value={cell} height={buttonHeight} onPress={() => onRoll(cell)} />
            ),
          )}
        </View>
      ))}
    </View>
  );
}

function NumberButton({ value, height, onPress }: { value: number; height: number; onPress: () => void }) {
  const seven = value === 7;
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={`Rolled ${value}`}
      style={({ pressed }) => [
        styles.button,
        { height },
        seven ? styles.seven : styles.token,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.number, isHot(value) && styles.hot, seven && styles.sevenText]}>{value}</Text>
      <View style={styles.pips}>
        {Array.from({ length: ways(value) }, (_, i) => (
          <View key={i} style={[styles.pip, isHot(value) && styles.hotPip, seven && styles.sevenPip]} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pad: { gap: 8 },
  row: { flexDirection: 'row', gap: 8 },
  button: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  token: { backgroundColor: colors.token },
  seven: { backgroundColor: colors.seven },
  undo: { backgroundColor: colors.raised, gap: 2 },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  disabled: { opacity: 0.35 },
  number: { fontSize: 28, fontWeight: '800', color: colors.tokenText, fontVariant: ['tabular-nums'] },
  hot: { color: colors.tokenHot },
  sevenText: { color: '#fff' },
  pips: { flexDirection: 'row', gap: 3, marginTop: 2, height: 5 },
  pip: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.tokenText },
  hotPip: { backgroundColor: colors.tokenHot },
  sevenPip: { backgroundColor: '#fff' },
  undoText: { color: colors.text, fontSize: 12, fontWeight: '600' },
});
