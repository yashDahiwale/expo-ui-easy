import { memo, type ReactNode } from "react";
import {
  ActivityIndicator as RNActivityIndicator,
  Button as RNButton,
  Pressable,
  StyleSheet,
  Switch as RNSwitch,
  Text as RNText,
  View,
} from "react-native";
import { Row, Spacer } from "@expo/ui/jetpack-compose";
import {
  fillMaxWidth,
  height,
  padding,
  size,
  weight,
  type ModifierConfig,
} from "@expo/ui/jetpack-compose/modifiers";
import {
  CircularProgressIndicator,
  Checkbox,
  FilledTonalButton,
  FilterChip,
  Host,
  RadioButton,
  Slider,
  Switch,
  Text,
  type AutoHostProps,
} from "expo-ui-easy";
import { concreteKind, type ConcreteKind, type ControlKind } from "./types";

export const ROW_HEIGHT = 56;
const noop = (): void => {};

export interface RowProps {
  i: number;
  kind: ControlKind;
  on: boolean;
}

// ---------------------------------------------------------------------------
// React Native baseline (what you would write without this library)
// ---------------------------------------------------------------------------
function RnControl({
  kind,
  on,
  i,
}: {
  kind: ConcreteKind;
  on: boolean;
  i: number;
}): ReactNode {
  switch (kind) {
    case "switch":
      return <RNSwitch value={on} onValueChange={noop} />;
    case "checkbox":
      // RN core has no checkbox: a Pressable + View approximation.
      return (
        <Pressable onPress={noop} style={[styles.box, on && styles.boxOn]}>
          {on ? <RNText style={styles.tick}>✓</RNText> : null}
        </Pressable>
      );
    case "radio":
      return (
        <Pressable
          onPress={noop}
          style={[styles.circle, on && styles.circleOn]}
        >
          {on ? <View style={styles.dot} /> : null}
        </Pressable>
      );
    case "slider":
      return null; // no RN core slider
    case "button":
      return (
        <RNButton title={on ? `Tap ${i}` : `Tapped ${i}`} onPress={noop} />
      );
    case "text":
      return <RNText style={styles.value}>{on ? "ON" : "OFF"}</RNText>;
    case "spinner":
      return on ? <RNActivityIndicator /> : <View style={styles.spinnerGap} />;
    case "chip":
      // RN core has no chip: a Pressable pill approximation.
      return (
        <Pressable onPress={noop} style={[styles.chip, on && styles.chipOn]}>
          <RNText
            style={[styles.chipText, on && styles.chipTextOn]}
          >{`Chip ${i}`}</RNText>
        </Pressable>
      );
  }
}

export const RnRow = memo(function RnRow({ i, kind, on }: RowProps): ReactNode {
  return (
    <View style={styles.row}>
      <RNText style={styles.label}>{`Row ${i}`}</RNText>
      <RnControl kind={concreteKind(kind, i)} on={on} i={i} />
    </View>
  );
});

// ---------------------------------------------------------------------------
// Native controls
// ---------------------------------------------------------------------------
const FLEX_ONE = { flex: 1 } as const;
const SLIDER_IN_COMPOSE_ROW: ModifierConfig[] = [weight(1)];
const SPINNER_MODIFIERS: ModifierConfig[] = [size(24, 24)];
const LIGHT_HOST: AutoHostProps = { colorScheme: "light" };
const SLIDER_AUTO_HOST: AutoHostProps = {
  colorScheme: "light",
  matchContents: { vertical: true },
};

type Layout = "rn-row" | "compose-row";

const NativeControl = memo(function NativeControl(props: {
  kind: ConcreteKind;
  on: boolean;
  i: number;
  layout: Layout;
}): ReactNode {
  const { kind, on, i, layout } = props;
  switch (kind) {
    case "switch":
      return <Switch value={on} onValueChange={noop} hostProps={LIGHT_HOST} />;
    case "checkbox":
      return (
        <Checkbox value={on} onValueChange={noop} hostProps={LIGHT_HOST} />
      );
    case "radio":
      return (
        <RadioButton selected={on} onPress={noop} hostProps={LIGHT_HOST} />
      );
    case "slider":
      return layout === "rn-row" ? (
        <Slider
          value={on ? 0.8 : 0.2}
          style={FLEX_ONE}
          hostProps={SLIDER_AUTO_HOST}
        />
      ) : (
        <Slider value={on ? 0.8 : 0.2} modifiers={SLIDER_IN_COMPOSE_ROW} />
      );
    case "button":
      return (
        <FilledTonalButton onPress={noop} hostProps={LIGHT_HOST}>
          {on ? `Tap ${i}` : `Tapped ${i}`}
        </FilledTonalButton>
      );
    case "text":
      return <Text hostProps={LIGHT_HOST}>{on ? "ON" : "OFF"}</Text>;
    case "spinner":
      return on ? (
        <CircularProgressIndicator
          modifiers={SPINNER_MODIFIERS}
          hostProps={LIGHT_HOST}
        />
      ) : (
        <CircularProgressIndicator
          progress={0}
          modifiers={SPINNER_MODIFIERS}
          hostProps={LIGHT_HOST}
        />
      );
    case "chip":
      return (
        <FilterChip selected={on} onPress={noop} hostProps={LIGHT_HOST}>
          <FilterChip.Label>
            <Text>{`Chip ${i}`}</Text>
          </FilterChip.Label>
        </FilterChip>
      );
  }
});

/** Strategy "Native · FlatList · Host per control": RN row, every control standalone. */
export const NativeAutoRow = memo(function NativeAutoRow({
  i,
  kind,
  on,
}: RowProps): ReactNode {
  return (
    <View style={styles.row}>
      <RNText style={styles.label}>{`Row ${i}`}</RNText>
      <NativeControl
        kind={concreteKind(kind, i)}
        on={on}
        i={i}
        layout="rn-row"
      />
    </View>
  );
});

// ---------------------------------------------------------------------------
// Compose rows (label + control inside one Host)
// ---------------------------------------------------------------------------
const ROW_MODIFIERS: ModifierConfig[] = [
  fillMaxWidth(),
  height(ROW_HEIGHT),
  padding(16, 0, 16, 0),
];
const SPACER_MODIFIERS: ModifierConfig[] = [weight(1)];
const LABEL_STYLE = { fontSize: 16 } as const;

export const ComposeRow = memo(function ComposeRow({
  i,
  kind,
  on,
}: RowProps): ReactNode {
  const concrete = concreteKind(kind, i);
  return (
    <Row
      verticalAlignment="center"
      horizontalArrangement={{ spacedBy: 12 }}
      modifiers={ROW_MODIFIERS}
    >
      <Text style={LABEL_STYLE}>{`Row ${i}`}</Text>
      {concrete === "slider" ? null : <Spacer modifiers={SPACER_MODIFIERS} />}
      <NativeControl kind={concrete} on={on} i={i} layout="compose-row" />
    </Row>
  );
});

const HOST_ROW_STYLE = { width: "100%" } as const;

/** Strategy "Native · FlatList · Host per row". */
export const NativeHostRow = memo(function NativeHostRow(
  props: RowProps
): ReactNode {
  return (
    <Host
      matchContents={{ vertical: true }}
      colorScheme="light"
      style={HOST_ROW_STYLE}
    >
      <ComposeRow {...props} />
    </Host>
  );
});

const styles = StyleSheet.create({
  row: {
    height: ROW_HEIGHT,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: { fontSize: 16, color: "#1C1B1F" },
  value: { fontSize: 16, color: "#1C1B1F" },
  box: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#625B71",
    alignItems: "center",
    justifyContent: "center",
  },
  boxOn: { backgroundColor: "#6750A4", borderColor: "#6750A4" },
  tick: { color: "#fff", fontSize: 14, lineHeight: 16 },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#625B71",
    alignItems: "center",
    justifyContent: "center",
  },
  circleOn: { borderColor: "#6750A4" },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#6750A4" },
  spinnerGap: { width: 20, height: 20 },
  chip: {
    borderWidth: 1,
    borderColor: "#79747E",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipOn: { backgroundColor: "#E8DEF8", borderColor: "#E8DEF8" },
  chipText: { fontSize: 14, color: "#1C1B1F" },
  chipTextOn: { color: "#1D192B" },
});
