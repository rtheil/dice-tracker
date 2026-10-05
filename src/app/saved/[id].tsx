import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DieButton } from '@/components/DieButton';
import { RollHistory } from '@/components/RollHistory';
import { StatsChart } from '@/components/StatsChart';
import { formatDate, formatElapsed, formatTime } from '@/lib/format';
import { useConfirm } from '@/state/ConfirmContext';
import { useGame } from '@/state/GameContext';
import { colors } from '@/theme';

export default function SavedGameScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { saved, deleteSaved } = useGame();
  const confirm = useConfirm();
  const game = saved.find((g) => g.id === id);

  if (!game) {
    return (
      <View style={styles.missing}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={styles.meta}>This game no longer exists.</Text>
      </View>
    );
  }

  const onDelete = async () => {
    const ok = await confirm({
      title: `Delete "${game.name}"?`,
      message: "This saved game will be removed permanently. This can't be undone.",
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;
    router.back();
    deleteSaved(game.id);
  };

  return (
    <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="automatic">
      <Stack.Screen
        options={{
          title: game.name,
          headerRight: () => (
            <DieButton
              icon="trash-outline"
              color={colors.danger}
              accessibilityLabel="Delete saved game"
              onPress={onDelete}
              style={styles.headerButton}
            />
          ),
        }}
      />

      <View style={styles.summary}>
        <Text style={styles.date}>{formatDate(game.startedAt)}</Text>
        <Text style={styles.meta}>
          {formatTime(game.startedAt)} – {formatTime(game.endedAt)} ·{' '}
          {formatElapsed(game.endedAt - game.startedAt)}
        </Text>
      </View>

      <StatsChart rolls={game.rolls} />
      <RollHistory
        rolls={game.rolls}
        onShowAll={() => router.push({ pathname: '/history', params: { game: game.id } })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  summary: { paddingHorizontal: 2, gap: 2 },
  date: { color: colors.text, fontSize: 17, fontWeight: '700' },
  meta: { color: colors.textDim, fontSize: 14 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // The iOS nav bar already insets header buttons; the web header doesn't.
  headerButton: { marginRight: Platform.OS === 'web' ? 12 : 0 },
});
