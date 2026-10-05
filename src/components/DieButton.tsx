import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  accessibilityLabel: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/** Square, die-shaped icon button for headers. */
export function DieButton({ icon, onPress, accessibilityLabel, color = colors.text, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 9,
    backgroundColor: colors.raised,
    borderBottomWidth: 3,
    borderBottomColor: colors.raisedEdge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7, transform: [{ translateY: 1 }] },
});
