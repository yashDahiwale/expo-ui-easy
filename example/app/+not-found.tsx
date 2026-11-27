import { Link, Stack } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { space, useTheme } from '../src/theme';

export default function NotFound(): ReactNode {
  const t = useTheme();
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={[styles.root, { backgroundColor: t.bg }]}>
        <Text style={[styles.title, { color: t.text }]}>This screen does not exist</Text>
        <Link href="/" style={{ color: t.accent, fontWeight: '600' }}>Back to the component list</Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md, padding: space.lg },
  title: { fontSize: 18, fontWeight: '700' },
});
