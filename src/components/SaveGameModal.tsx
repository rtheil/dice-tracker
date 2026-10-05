import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { formatDate } from '@/lib/format';
import { useGame } from '@/state/GameContext';
import { colors } from '@/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function SaveGameModal({ visible, onClose }: Props) {
  const { current, saveAndStartNew, discardCurrent } = useGame();
  const [name, setName] = useState('');
  // Discarding is confirmed inside this sheet rather than stacking a second modal on top.
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);

  const rollCount = current.rolls.length;
  const rollsLabel = `${rollCount} ${rollCount === 1 ? 'roll' : 'rolls'}`;
  const gameDate = current.rolls[0]?.at ?? current.createdAt;

  const close = () => {
    setName('');
    setConfirmingDiscard(false);
    onClose();
  };

  const save = () => {
    if (rollCount === 0) return;
    saveAndStartNew(name);
    close();
  };

  const discard = () => {
    discardCurrent();
    close();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Close" />
        {confirmingDiscard ? (
          <View style={styles.sheet}>
            <Text style={styles.title}>Start new without saving?</Text>
            <Text style={styles.body}>All {rollsLabel} from this game will be erased. This can&apos;t be undone.</Text>

            <Pressable
              onPress={discard}
              style={({ pressed }) => [styles.button, styles.danger, pressed && styles.pressed]}
            >
              <Text style={styles.dangerText}>Erase & start new game</Text>
            </Pressable>
            <Pressable
              onPress={() => setConfirmingDiscard(false)}
              style={({ pressed }) => [styles.button, styles.secondary, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryText}>Back</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.sheet}>
            <Text style={styles.title}>Save game</Text>
            <Text style={styles.meta}>
              {formatDate(gameDate)} · {rollsLabel}
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name (e.g. Catan with the Smiths)"
              placeholderTextColor={colors.textFaint}
              style={styles.input}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={save}
              maxLength={60}
            />

            <Pressable
              onPress={save}
              disabled={rollCount === 0}
              style={({ pressed }) => [
                styles.button,
                styles.primary,
                rollCount === 0 && styles.disabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.primaryText}>Save & start new game</Text>
            </Pressable>

            <Pressable onPress={close} style={({ pressed }) => [styles.button, styles.secondary, pressed && styles.pressed]}>
              <Text style={styles.secondaryText}>Keep playing</Text>
            </Pressable>

            {rollCount > 0 && (
              <Pressable onPress={() => setConfirmingDiscard(true)} hitSlop={8} style={styles.discard}>
                <Text style={styles.discardText}>Start new game without saving</Text>
              </Pressable>
            )}
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  sheet: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 12,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  meta: { color: colors.textDim, fontSize: 14, marginTop: -6 },
  body: { color: colors.textDim, fontSize: 15, lineHeight: 21, marginTop: -4 },
  input: {
    backgroundColor: colors.bg,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 12,
    color: colors.text,
    fontSize: 17,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  button: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primary: { backgroundColor: colors.primary },
  primaryText: { color: colors.primaryText, fontSize: 16, fontWeight: '700' },
  danger: { backgroundColor: colors.danger },
  dangerText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondary: { backgroundColor: colors.raised },
  secondaryText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.75 },
  discard: { alignItems: 'center', paddingTop: 4 },
  discardText: { color: colors.danger, fontSize: 14, fontWeight: '600' },
});
