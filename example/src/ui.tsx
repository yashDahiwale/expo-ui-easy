import type { ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { missingNativeViews } from "expo-ui-easy";
import { useTheme } from "./theme";

/** Scrolling page used by every preview screen. */
export function Page({ children }: { children: ReactNode }): ReactNode {
  const t = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.bg }}
      contentContainerStyle={styles.page}
      contentInsetAdjustmentBehavior="automatic"
    >
      {children}
    </ScrollView>
  );
}

/** One test case: a title, an optional note on what to look for, and the live component. */
export function Case({
  title,
  note,
  requires,
  children,
}: {
  title: string;
  note?: string;
  /** Native Expo UI view names this case needs. If the running app lacks any, a notice replaces the demo. */
  requires?: readonly string[];
  children: ReactNode;
}): ReactNode {
  const t = useTheme();
  const missing = requires === undefined ? [] : missingNativeViews(requires);
  if (missing.length > 0) {
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: t.card, borderColor: t.danger },
        ]}
      >
        <Text style={[styles.caseTitle, { color: t.text }]}>{title}</Text>
        <Text style={[styles.note, { color: t.danger }]}>
          {`Needs a development build. This app's native Expo UI module has no ${missing.join(
            ", "
          )}. ` +
            "Expo Go ships a fixed native module; run `npx expo run:android` (or update Expo Go) to see this case."}
        </Text>
      </View>
    );
  }
  return (
    <View
      style={[styles.card, { backgroundColor: t.card, borderColor: t.border }]}
    >
      <Text style={[styles.caseTitle, { color: t.text }]}>{title}</Text>
      {note !== undefined ? (
        <Text style={[styles.note, { color: t.subtle }]}>{note}</Text>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

/** Monospace line that shows live state next to a component. */
export function Readout({ text }: { text: string }): ReactNode {
  const t = useTheme();
  return <Text style={[styles.readout, { color: t.subtle }]}>{text}</Text>;
}

export function Chip(props: {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
}): ReactNode {
  const t = useTheme();
  const { label, selected = false, disabled = false, onPress } = props;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.chip,
        {
          borderColor: selected ? t.accent : t.border,
          backgroundColor: selected ? t.accent : "transparent",
        },
        disabled && styles.disabled,
      ]}
    >
      <Text style={{ color: selected ? "#fff" : t.text, fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ActionButton(props: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: "primary" | "danger" | "neutral";
  style?: StyleProp<ViewStyle>;
}): ReactNode {
  const t = useTheme();
  const { label, onPress, disabled = false, tone = "primary", style } = props;
  const bg =
    tone === "primary" ? t.accent : tone === "danger" ? t.danger : t.border;
  const fg = tone === "neutral" ? t.text : "#fff";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.action,
        { backgroundColor: bg },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={{ color: fg, fontWeight: "600", fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { padding: 16, gap: 12 },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    gap: 6,
  },
  caseTitle: { fontSize: 15, fontWeight: "600" },
  note: { fontSize: 12, lineHeight: 17 },
  body: { gap: 8, paddingTop: 6 },
  readout: { fontFamily: "monospace", fontSize: 12 },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  action: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.4 },
});
