import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme';

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel: string;
  destructive?: boolean;
};

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

/**
 * In-app confirmation dialog. Used instead of Alert/window.confirm so it looks and
 * behaves the same on iOS and in a browser (where native dialogs can be blocked).
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [visible, setVisible] = useState(false);
  const resolveRef = useRef<((ok: boolean) => void) | null>(null);

  const confirm = useCallback<Confirm>((opts) => {
    resolveRef.current?.(false);
    setOptions(opts);
    setVisible(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const finish = (ok: boolean) => {
    resolveRef.current?.(ok);
    resolveRef.current = null;
    setVisible(false);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => finish(false)}>
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => finish(false)} accessibilityLabel="Cancel" />
          {options && (
            <View style={styles.dialog} accessibilityRole="alert">
              <Text style={styles.title}>{options.title}</Text>
              {options.message ? <Text style={styles.message}>{options.message}</Text> : null}
              <View style={styles.buttons}>
                <Pressable
                  onPress={() => finish(false)}
                  style={({ pressed }) => [styles.button, styles.cancel, pressed && styles.pressed]}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={() => finish(true)}
                  style={({ pressed }) => [
                    styles.button,
                    options.destructive ? styles.destructive : styles.primary,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={options.destructive ? styles.destructiveText : styles.primaryText}>
                    {options.confirmLabel}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): Confirm {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm must be used inside <ConfirmProvider>');
  return confirm;
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 28,
  },
  dialog: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    gap: 8,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  message: { color: colors.textDim, fontSize: 15, lineHeight: 21 },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 10 },
  button: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  cancel: { backgroundColor: colors.raised },
  cancelText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  primary: { backgroundColor: colors.primary },
  primaryText: { color: colors.primaryText, fontSize: 16, fontWeight: '700' },
  destructive: { backgroundColor: colors.danger },
  destructiveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.75 },
});
