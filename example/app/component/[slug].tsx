import { Stack, useLocalSearchParams, type ErrorBoundaryProps } from 'expo-router';
import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { CATEGORIES, findComponent } from '../../src/registry';
import { space, useTheme } from '../../src/theme';
import { ActionButton, IS_ANDROID, Notice, PlatformNotice, PreviewHeader, PreviewPage } from '../../src/ui';

const REPO = 'https://github.com/yashDahiwale/expo-ui-easy/blob/main';

/** A demo that throws (for example a native view missing in Expo Go) must not take the whole app down. */
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps): ReactNode {
  return (
    <PreviewPage>
      <Notice tone="danger" title="This preview crashed">{error.message}</Notice>
      <ActionButton label="Try again" onPress={() => void retry()} />
    </PreviewPage>
  );
}

export default function ComponentScreen(): ReactNode {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const entry = findComponent(slug ?? '');
  const t = useTheme();
  // The demo module imports the Android-only library, so it is only loaded on Android.
  const Demo = useMemo(() => (IS_ANDROID && entry !== undefined ? entry.load() : undefined), [entry]);

  if (entry === undefined) {
    return (
      <PreviewPage>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Notice tone="danger" title="Unknown component">{`There is no preview called "${slug ?? ''}". Go back to the list and pick one.`}</Notice>
      </PreviewPage>
    );
  }

  const header = (
    <PreviewHeader
      title={entry.name}
      summary={entry.summary}
      category={CATEGORIES.find((c) => c.key === entry.category)?.title ?? entry.category}
      {...(entry.partOf !== undefined ? { partOf: entry.partOf } : null)}
      sourceUrl={`${REPO}/${entry.source}`}
    />
  );

  if (Demo === undefined) {
    return (
      <PreviewPage>
        <Stack.Screen options={{ title: entry.name }} />
        {header}
        <PlatformNotice />
      </PreviewPage>
    );
  }

  // Full-height screens (lists) manage their own scrolling.
  if (!entry.scroll) {
    return (
      <View style={[styles.fill, { backgroundColor: t.bg }]}>
        <Stack.Screen options={{ title: entry.name }} />
        <View style={styles.compactHeader}>{header}</View>
        <Demo />
      </View>
    );
  }

  return (
    <PreviewPage>
      <Stack.Screen options={{ title: entry.name }} />
      {header}
      <Demo />
    </PreviewPage>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  compactHeader: { paddingHorizontal: space.lg },
});
