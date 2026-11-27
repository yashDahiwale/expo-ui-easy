import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import type { ReactNode } from 'react';
import { IS_ANDROID } from '../src/ui';
import { useTheme } from '../src/theme';

/** Dev badge counting auto-created Compose Hosts. Loaded lazily: the library only exists on Android. */
function DebugOverlay(): ReactNode {
  if (!IS_ANDROID) return null;
  const { HostDebugOverlay } = require('expo-ui-easy') as typeof import('expo-ui-easy');
  return <HostDebugOverlay />;
}

export default function RootLayout(): ReactNode {
  const t = useTheme();
  return (
    <>
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: t.bg },
          headerTintColor: t.text,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: t.bg },
        }}>
        <Stack.Screen name="index" options={{ title: 'expo-ui-easy' }} />
        <Stack.Screen name="component/[slug]" options={{ title: '' }} />
        <Stack.Screen name="stress" options={{ title: 'Stress test' }} />
      </Stack>
      <DebugOverlay />
    </>
  );
}
