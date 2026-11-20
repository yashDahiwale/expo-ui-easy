import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { BackHandler, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen, type Route } from './HomeScreen';
import { DEMOS } from './registry';
import { useTheme } from './theme';

/** Preview of one component. The library is only imported on Android (it throws elsewhere). */
function Preview({ demoKey }: { demoKey: string }): ReactNode {
  const entry = DEMOS.find((demo) => demo.key === demoKey);
  const Demo = useMemo(() => (Platform.OS === 'android' ? entry?.load() : undefined), [entry]);
  if (Demo === undefined) {
    return (
      <View style={styles.message}>
        <Text>{entry === undefined ? `Unknown preview: ${demoKey}` : 'Jetpack Compose previews only run on Android.'}</Text>
      </View>
    );
  }
  return <Demo />;
}

/** Dev badge counting auto-created Compose Hosts. Loaded lazily: the library only exists on Android. */
function DebugOverlay(): ReactNode {
  if (Platform.OS !== 'android') return null;
  const { HostDebugOverlay } = require('expo-ui-easy') as typeof import('expo-ui-easy');
  return <HostDebugOverlay />;
}

function Stress(): ReactNode {
  if (Platform.OS !== 'android') {
    return (
      <View style={styles.message}>
        <Text>The stress test only runs on Android (Jetpack Compose).</Text>
      </View>
    );
  }
  const { StressScreen } = require('./stress/StressScreen') as typeof import('./stress/StressScreen');
  return <StressScreen />;
}

function Shell(): ReactNode {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [route, setRoute] = useState<Route>({ name: 'home' });

  // Android hardware back: go home first, exit the app from home.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (route.name === 'home') return false;
      setRoute({ name: 'home' });
      return true;
    });
    return () => subscription.remove();
  }, [route]);

  const title =
    route.name === 'home'
      ? 'Native UI playground'
      : route.name === 'stress'
        ? 'Stress test'
        : (DEMOS.find((d) => d.key === route.key)?.title ?? 'Preview');

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: t.card, borderColor: t.border }]}>
        {route.name !== 'home' ? (
          <Pressable onPress={() => setRoute({ name: 'home' })} hitSlop={12} style={styles.back}>
            <Text style={[styles.backText, { color: t.accent }]}>‹ Back</Text>
          </Pressable>
        ) : null}
        <Text style={[styles.headerTitle, { color: t.text }]} numberOfLines={1}>{title}</Text>
      </View>

      <View style={styles.body}>
        {route.name === 'home' ? <HomeScreen onOpen={setRoute} /> : null}
        {route.name === 'preview' ? <Preview demoKey={route.key} /> : null}
        {route.name === 'stress' ? <Stress /> : null}
      </View>
      <DebugOverlay />
    </View>
  );
}

export default function PlaygroundApp(): ReactNode {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Shell />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  back: { paddingVertical: 4 },
  backText: { fontSize: 16, fontWeight: '600' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700' },
  body: { flex: 1 },
  message: { padding: 16 },
});
