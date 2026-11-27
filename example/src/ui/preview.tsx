import type { ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, space, TOUCH, useTheme } from '../theme';
import { PreviewCode } from './controls';
import { IS_ANDROID, missingViews } from './native-views';

/** Scrolling body of a preview route. The Stack header already handles the top inset. */
export function PreviewPage({ children }: { children: ReactNode }): ReactNode {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.bg }}
      contentContainerStyle={[styles.page, { paddingBottom: insets.bottom + space.xl }]}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic">
      {children}
    </ScrollView>
  );
}

/** Title block at the top of a preview: what the component is, which category it lives in, links. */
export function PreviewHeader(props: {
  title: string;
  summary: string;
  category: string;
  /** Shown when this route demonstrates a component through its parent's demo. */
  partOf?: string;
  sourceUrl?: string;
}): ReactNode {
  const t = useTheme();
  const { title, summary, category, partOf, sourceUrl } = props;
  return (
    <View style={styles.header}>
      <View style={styles.headerMeta}>
        <View style={[styles.pill, { backgroundColor: t.accentContainer }]}>
          <Text style={[styles.pillText, { color: t.onAccentContainer }]}>{category}</Text>
        </View>
        {partOf !== undefined ? (
          <View style={[styles.pill, { backgroundColor: t.well }]}>
            <Text style={[styles.pillText, { color: t.subtle }]}>{`Used with ${partOf}`}</Text>
          </View>
        ) : null}
      </View>
      <Text accessibilityRole="header" numberOfLines={1} adjustsFontSizeToFit style={[styles.headerTitle, { color: t.text }]}>{`<${title} />`}</Text>
      <Text style={[styles.headerSummary, { color: t.subtle }]}>{summary}</Text>
      {sourceUrl !== undefined ? (
        <Pressable accessibilityRole="link" hitSlop={8} onPress={() => void Linking.openURL(sourceUrl)} style={styles.link}>
          <Text style={{ color: t.accent, fontWeight: '600', fontSize: 13 }}>View demo source ↗</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** One focused example: a heading, an optional explanation, the live component and optionally its code. */
export function PreviewSection({
  title,
  description,
  requires,
  code,
  children,
}: {
  title: string;
  description?: string;
  /** Native Expo UI view names this example needs. If the running app lacks any, a notice replaces the demo. */
  requires?: readonly string[];
  code?: string;
  children: ReactNode;
}): ReactNode {
  const t = useTheme();
  const missing = missingViews(requires);
  return (
    <View style={[styles.section, { backgroundColor: t.card, borderColor: t.border }]}>
      <Text accessibilityRole="header" style={[styles.sectionTitle, { color: t.text }]}>{title}</Text>
      {description !== undefined ? <Text style={[styles.description, { color: t.subtle }]}>{description}</Text> : null}
      {missing.length > 0 ? <MissingViewsNotice views={missing} /> : (
        <>
          <View style={styles.body}>{children}</View>
          {code !== undefined ? <PreviewCode code={code} /> : null}
        </>
      )}
    </View>
  );
}

/** Live state next to a component, so a tap or a drag visibly does something. */
export function StateRow({ text }: { text: string }): ReactNode {
  const t = useTheme();
  return (
    <View style={[styles.state, { backgroundColor: t.well }]}>
      <Text style={[styles.stateText, { color: t.subtle }]}>{text}</Text>
    </View>
  );
}

type NoticeTone = 'warning' | 'danger';

export function Notice({ tone = 'warning', title, children }: { tone?: NoticeTone; title: string; children?: ReactNode }): ReactNode {
  const t = useTheme();
  const bg = tone === 'warning' ? t.warningContainer : t.card;
  const fg = tone === 'warning' ? t.onWarningContainer : t.danger;
  return (
    <View accessibilityRole="alert" style={[styles.notice, { backgroundColor: bg, borderColor: tone === 'danger' ? t.danger : 'transparent' }]}>
      <Text style={[styles.noticeTitle, { color: fg }]}>{title}</Text>
      {children !== undefined ? <Text style={[styles.noticeBody, { color: fg }]}>{children}</Text> : null}
    </View>
  );
}

function MissingViewsNotice({ views }: { views: readonly string[] }): ReactNode {
  return (
    <Notice title="Needs a development build">
      {`This app's native Expo UI module has no ${views.join(', ')}. Expo Go ships a fixed native module: run \`npx expo run:android\` (or update Expo Go) to see this example.`}
    </Notice>
  );
}

/** Shown instead of a preview on platforms without Jetpack Compose. */
export function PlatformNotice({ what = 'This preview' }: { what?: string }): ReactNode {
  return IS_ANDROID ? null : (
    <Notice tone="danger" title="Android only">
      {`${what} needs Jetpack Compose. expo-ui-easy currently supports Android: run \`npx expo run:android\`.`}
    </Notice>
  );
}

const styles = StyleSheet.create({
  page: { padding: space.lg, gap: space.md },
  header: { gap: space.sm, paddingBottom: space.xs },
  headerMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  pill: { borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: 4 },
  pillText: { fontSize: 12, fontWeight: '600' },
  headerTitle: { fontSize: 26, fontWeight: '700', fontFamily: 'monospace' },
  headerSummary: { fontSize: 15, lineHeight: 22 },
  link: { minHeight: TOUCH - 8, justifyContent: 'center', alignSelf: 'flex-start' },
  section: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, padding: space.lg, gap: space.sm },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  description: { fontSize: 13, lineHeight: 19 },
  body: { gap: space.sm, paddingTop: space.xs },
  state: { borderRadius: radius.sm, paddingHorizontal: space.md, paddingVertical: space.sm },
  stateText: { fontFamily: 'monospace', fontSize: 12 },
  notice: { borderRadius: radius.md, borderWidth: 1, padding: space.md, gap: space.xs },
  noticeTitle: { fontSize: 14, fontWeight: '700' },
  noticeBody: { fontSize: 13, lineHeight: 19 },
});
