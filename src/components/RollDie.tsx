import { StyleSheet, Text, View } from 'react-native';

import { isHot } from '@/lib/dice';
import { colors } from '@/theme';

type Props = {
  value: number;
  size?: number;
  highlighted?: boolean;
};

/** A die-shaped tile showing one roll's total. */
export function RollDie({ value, size = 34, highlighted }: Props) {
  const seven = value === 7;
  // Small dice (e.g. in the stats chart) get a thinner outline so it doesn't crowd neighbors.
  const small = size < 30;
  return (
    <View
      style={[
        styles.die,
        {
          width: size,
          height: size,
          borderRadius: size * 0.22,
          borderBottomWidth: Math.max(2, size * 0.08),
        },
        seven && styles.seven,
        highlighted && [
          styles.highlighted,
          { outlineWidth: small ? 2 : 3, outlineOffset: small ? 1 : 2 },
        ],
      ]}
    >
      <Text
        style={[
          styles.text,
          { fontSize: size * 0.5 },
          isHot(value) && styles.hotText,
          seven && styles.sevenText,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  die: {
    backgroundColor: colors.token,
    borderColor: colors.tokenEdge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seven: { backgroundColor: colors.seven, borderColor: colors.sevenEdge },
  highlighted: { outlineColor: colors.primary, outlineStyle: 'solid' },
  text: { color: colors.tokenText, fontWeight: '800', fontVariant: ['tabular-nums'] },
  hotText: { color: colors.tokenHot },
  sevenText: { color: '#fff' },
});
