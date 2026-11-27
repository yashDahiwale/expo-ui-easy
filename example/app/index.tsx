import { useRouter } from 'expo-router';
import { useDeferredValue, useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CATEGORIES, COMPONENTS, TOOLS, type CategoryKey, type ComponentEntry } from '../src/registry';
import { radius, space, TOUCH, useTheme } from '../src/theme';
import { Chip, IS_ANDROID, Notice, missingViews } from '../src/ui';

interface Section {
  title: string;
  data: readonly ComponentEntry[];
}

const matches = (entry: ComponentEntry, query: string): boolean => {
  if (query === '') return true;
  const haystack = `${entry.name} ${entry.summary} ${entry.partOf ?? ''}`.toLowerCase();
  return query.split(/\s+/).every((word) => haystack.includes(word));
};

function Row({ entry }: { entry: ComponentEntry }): ReactNode {
  const t = useTheme();
  const router = useRouter();
  const needsBuild = missingViews(entry.requires).length > 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={entry.name}
      onPress={() => router.push(`/component/${entry.slug}`)}
      android_ripple={{ color: t.border }}
      style={({ pressed }) => [styles.row, { backgroundColor: t.card, borderColor: t.border, opacity: pressed ? 0.9 : 1 }]}>
      <View style={styles.rowTop}>
        <Text style={[styles.rowTitle, { color: t.text }]}>{entry.name}</Text>
        {entry.partOf !== undefined ? <Badge text={`part of ${entry.partOf}`} /> : null}
        {needsBuild ? <Badge text="dev build" warn /> : null}
      </View>
      <Text numberOfLines={2} style={[styles.rowSummary, { color: t.subtle }]}>{entry.summary}</Text>
    </Pressable>
  );
}

function Badge({ text, warn = false }: { text: string; warn?: boolean }): ReactNode {
  const t = useTheme();
  return (
    <View style={[styles.badge, { backgroundColor: warn ? t.warningContainer : t.well }]}>
      <Text style={[styles.badgeText, { color: warn ? t.onWarningContainer : t.subtle }]}>{text}</Text>
    </View>
  );
}

export default function ComponentIndex(): ReactNode {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryKey | 'all'>('all');
  const deferred = useDeferredValue(query.trim().toLowerCase());

  const sections = useMemo<Section[]>(
    () =>
      CATEGORIES.filter((c) => category === 'all' || c.key === category)
        .map((c) => ({ title: c.title, data: COMPONENTS.filter((e) => e.category === c.key && matches(e, deferred)) }))
        .filter((s) => s.data.length > 0),
    [category, deferred],
  );
  const total = sections.reduce((n, s) => n + s.data.length, 0);
  const showTools = deferred === '' && category === 'all';

  const header = (
    <View style={styles.listHeader}>
      {!IS_ANDROID ? (
        <Notice tone="danger" title="Android only">
          expo-ui-easy renders Jetpack Compose. Run `npx expo run:android` to see the components.
        </Notice>
      ) : null}
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search components"
        placeholderTextColor={t.subtle}
        accessibilityLabel="Search components"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
        returnKeyType="search"
        style={[styles.search, { backgroundColor: t.well, color: t.text }]}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} keyboardShouldPersistTaps="handled">
        <Chip label="All" selected={category === 'all'} onPress={() => setCategory('all')} />
        {CATEGORIES.map((c) => (
          <Chip key={c.key} label={c.title} selected={category === c.key} onPress={() => setCategory(c.key)} />
        ))}
      </ScrollView>
      {showTools ? (
        <View style={styles.tools}>
          <Text style={[styles.sectionTitle, { color: t.subtle }]}>TOOLS</Text>
          {TOOLS.map((tool) => (
            <Pressable
              key={tool.slug}
              accessibilityRole="button"
              accessibilityLabel={tool.title}
              onPress={() => router.push(`/${tool.slug}`)}
              android_ripple={{ color: t.border }}
              style={[styles.row, { backgroundColor: t.accentContainer, borderColor: t.accentContainer }]}>
              <Text style={[styles.rowTitle, { color: t.onAccentContainer }]}>{tool.title}</Text>
              <Text numberOfLines={2} style={[styles.rowSummary, { color: t.onAccentContainer }]}>{tool.summary}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      <Text style={[styles.count, { color: t.subtle }]}>{`${total} ${total === 1 ? 'component' : 'components'}`}</Text>
    </View>
  );

  return (
    <SectionList
      sections={sections}
      keyExtractor={(entry) => entry.slug}
      renderItem={({ item }) => <Row entry={item} />}
      renderSectionHeader={({ section }) => (
        <Text style={[styles.sectionTitle, styles.sectionHeader, { color: t.subtle, backgroundColor: t.bg }]}>{section.title.toUpperCase()}</Text>
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: t.text }]}>No components match</Text>
          <Text style={{ color: t.subtle }}>{`Nothing found for "${query}". Try a shorter name or clear the category filter.`}</Text>
          <Chip label="Clear filters" onPress={() => { setQuery(''); setCategory('all'); }} style={styles.clear} />
        </View>
      }
      stickySectionHeadersEnabled
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      style={{ backgroundColor: t.bg }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + space.xl }]}
      initialNumToRender={14}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg },
  listHeader: { gap: space.md, paddingBottom: space.sm },
  search: { minHeight: TOUCH, borderRadius: radius.pill, paddingHorizontal: space.lg, fontSize: 16 },
  chips: { gap: space.sm, paddingVertical: space.xs },
  tools: { gap: space.sm },
  count: { fontSize: 13 },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  sectionHeader: { paddingVertical: space.sm },
  row: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, padding: space.md + 2, gap: space.xs, marginBottom: space.sm, minHeight: TOUCH },
  rowTop: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: space.sm },
  rowTitle: { fontSize: 16, fontWeight: '700' },
  rowSummary: { fontSize: 13, lineHeight: 18 },
  badge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 2 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  empty: { paddingVertical: space.xl, gap: space.sm, alignItems: 'flex-start' },
  emptyTitle: { fontSize: 17, fontWeight: '700' },
  clear: { marginTop: space.sm },
});
