import type { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DEMOS } from './registry';
import { useTheme } from './theme';

export type Route = { name: 'home' } | { name: 'preview'; key: string } | { name: 'stress' };

export function HomeScreen({ onOpen }: { onOpen: (route: Route) => void }): ReactNode {
  const t = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.bg }}
      contentContainerStyle={styles.content}>
      {Platform.OS !== 'android' ? (
        <View style={[styles.banner, { borderColor: t.danger }]}>
          <Text style={{ color: t.danger }}>
            This library is Android-only (Jetpack Compose). Run with `npx expo start --android`.
          </Text>
        </View>
      ) : null}

      <Text style={[styles.heading, { color: t.subtle }]}>PERFORMANCE</Text>
      <Pressable
        onPress={() => onOpen({ name: 'stress' })}
        style={[styles.row, { backgroundColor: t.card, borderColor: t.accent }]}>
        <Text style={[styles.title, { color: t.text }]}>Stress test</Text>
        <Text style={[styles.subtitle, { color: t.subtle }]}>
          Mount hundreds to 10,000 controls, flip them all, burst-update and compare Native vs RN strategies.
        </Text>
      </Pressable>

      <Text style={[styles.heading, { color: t.subtle }]}>COMPONENT PREVIEWS</Text>
      {DEMOS.map((demo) => (
        <Pressable
          key={demo.key}
          onPress={() => onOpen({ name: 'preview', key: demo.key })}
          style={[styles.row, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={[styles.title, { color: t.text }]}>{demo.title}</Text>
          <Text style={[styles.subtitle, { color: t.subtle }]}>{demo.subtitle}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 10 },
  heading: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: 8 },
  row: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 14, gap: 4 },
  title: { fontSize: 17, fontWeight: '600' },
  subtitle: { fontSize: 13 },
  banner: { borderWidth: 1, borderRadius: 12, padding: 12 },
});
