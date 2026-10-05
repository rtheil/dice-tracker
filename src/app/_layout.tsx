import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ConfirmProvider } from '@/state/ConfirmContext';
import { GameProvider } from '@/state/GameContext';
import { colors } from '@/theme';

// Opening a deep link or reloading on an inner screen still puts the tracker underneath,
// so there's always a back button to it.
export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <GameProvider>
      <ConfirmProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Tracker', headerShown: false }} />
        <Stack.Screen name="history" options={{ title: 'Roll History' }} />
        <Stack.Screen name="saved/index" options={{ title: 'Saved Games' }} />
        <Stack.Screen name="saved/[id]" options={{ title: '' }} />
      </Stack>
      </ConfirmProvider>
    </GameProvider>
  );
}
