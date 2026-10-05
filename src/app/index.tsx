import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DieButton } from '@/components/DieButton';
import { RollHistory } from '@/components/RollHistory';
import { RollPad } from '@/components/RollPad';
import { SaveGameModal } from '@/components/SaveGameModal';
import { StatsChart } from '@/components/StatsChart';
import { formatTime } from '@/lib/format';
import { useConfirm } from '@/state/ConfirmContext';
import { useGame } from '@/state/GameContext';
import { colors } from '@/theme';

// Wake lock and vibration are phone features; in a desktop browser they only throw errors.
const isNative = Platform.OS !== 'web';

/** Keeps the phone from dimming while it sits on the table between turns. */
function KeepAwake() {
  useKeepAwake();
  return null;
}

export default function TrackerScreen() {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { loaded, current, addRoll, undoLastRoll } = useGame();
  const confirm = useConfirm();
  const [saveOpen, setSaveOpen] = useState(false);
  const { rolls } = current;

  // Size the chart so the stats, recent history and pad all fit without scrolling,
  // from an iPhone SE up to a Pro Max.
  const buttonHeight = height < 700 ? 56 : 66;
  const bottomPad = Math.max(insets.bottom, 12);
  const barHeight = Math.min(160, Math.max(64, height - insets.top - bottomPad - 3 * buttonHeight - 418));

  const onRoll = (value: number) => {
    if (isNative) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    addRoll(value);
  };

  const onUndo = async () => {
    const last = rolls[rolls.length - 1];
    if (!last) return;
    const ok = await confirm({
      title: `Remove the last roll (${last.value})?`,
      message: `Roll #${rolls.length} at ${formatTime(last.at)} will be deleted.`,
      confirmLabel: 'Remove',
      destructive: true,
    });
    if (ok) undoLastRoll();
  };

  const subtitle = rolls.length
    ? `Started ${formatTime(rolls[0].at)}`
    : 'New game';

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {isNative && <KeepAwake />}
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          {/* Smaller title on narrow phones so it clears the header buttons. */}
          <Text style={[styles.title, { fontSize: width < 400 ? 21 : 24 }]} numberOfLines={1}>
            Dice Tracker
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <DieButton icon="folder-open-outline" accessibilityLabel="Saved games" onPress={() => router.push('/saved')} />
          <Pressable
            onPress={() => setSaveOpen(true)}
            disabled={!loaded}
            accessibilityLabel="Save or start a new game"
            style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
          >
            <Ionicons name="save-outline" size={17} color={colors.primaryText} />
            <Text style={styles.saveText}>Save / New</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <StatsChart rolls={rolls} barHeight={barHeight} />
        <RollHistory rolls={rolls} onShowAll={() => router.push('/history')} />
      </ScrollView>

      <View style={[styles.padArea, { paddingBottom: bottomPad }]}>
        <RollPad onRoll={onRoll} onUndo={onUndo} canUndo={rolls.length > 0} buttonHeight={buttonHeight} />
      </View>

      <SaveGameModal visible={saveOpen} onClose={() => setSaveOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  titleBlock: { flex: 1, minWidth: 0, marginRight: 10 },
  title: { color: colors.text, fontWeight: '800' },
  subtitle: { color: colors.textDim, fontSize: 13, marginTop: 1 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  // Same die-like shape as DieButton, so the header buttons match.
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 9,
    backgroundColor: colors.primary,
    borderBottomWidth: 3,
    borderBottomColor: colors.primaryEdge,
  },
  saveText: { color: colors.primaryText, fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.7 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 12, gap: 12 },
  padArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    backgroundColor: colors.bg,
  },
});
