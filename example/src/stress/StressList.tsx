import { memo, useCallback, type ReactNode } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  type ListRenderItemInfo,
} from "react-native";
import { Column, LazyColumn } from "@expo/ui/jetpack-compose";
import {
  fillMaxSize,
  verticalScroll,
  type ModifierConfig,
} from "@expo/ui/jetpack-compose/modifiers";
import { Host } from "expo-ui-easy";
import { ComposeRow, NativeAutoRow, NativeHostRow, RnRow } from "./rows";
import { isOn, type ControlKind, type StrategyId } from "./types";

export interface StressListProps {
  strategy: StrategyId;
  kind: ControlKind;
  ids: readonly number[];
  flip: number;
  one: number;
}

const keyOf = (n: number): string => String(n);
const COLUMN_MODIFIERS: ModifierConfig[] = [fillMaxSize(), verticalScroll()];

type RowComponent = typeof RnRow;

function FlatStress({
  Row,
  kind,
  ids,
  flip,
  one,
}: { Row: RowComponent } & Omit<StressListProps, "strategy">): ReactNode {
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<number>) => (
      <Row i={item} kind={kind} on={isOn(item, flip, one)} />
    ),
    [Row, kind, flip, one]
  );
  return (
    <FlatList
      style={styles.fill}
      data={ids}
      keyExtractor={keyOf}
      renderItem={renderItem}
      extraData={`${flip}:${one}`}
    />
  );
}

function LazyStress({
  kind,
  ids,
  flip,
  one,
}: Omit<StressListProps, "strategy">): ReactNode {
  // A new render function identity re-renders the visible rows, which is what a value change needs.
  const renderItem = useCallback(
    ({ item }: { item: number; index: number }) => (
      <ComposeRow i={item} kind={kind} on={isOn(item, flip, one)} />
    ),
    [kind, flip, one]
  );
  return (
    <Host colorScheme="light" style={styles.fill}>
      <LazyColumn>
        <LazyColumn.Items data={ids} keyExtractor={keyOf}>
          {renderItem}
        </LazyColumn.Items>
      </LazyColumn>
    </Host>
  );
}

export const StressList = memo(function StressList(
  props: StressListProps
): ReactNode {
  const { strategy, kind, ids, flip, one } = props;
  switch (strategy) {
    case "rn-flatlist":
      return (
        <FlatStress Row={RnRow} kind={kind} ids={ids} flip={flip} one={one} />
      );
    case "native-auto-flatlist":
      return (
        <FlatStress
          Row={NativeAutoRow}
          kind={kind}
          ids={ids}
          flip={flip}
          one={one}
        />
      );
    case "native-row-host-flatlist":
      return (
        <FlatStress
          Row={NativeHostRow}
          kind={kind}
          ids={ids}
          flip={flip}
          one={one}
        />
      );
    case "rn-scrollview":
      return (
        <ScrollView style={styles.fill}>
          {ids.map((i) => (
            <RnRow key={i} i={i} kind={kind} on={isOn(i, flip, one)} />
          ))}
        </ScrollView>
      );
    case "native-single-host-column":
      return (
        <Host colorScheme="light" style={styles.fill}>
          <Column modifiers={COLUMN_MODIFIERS}>
            {ids.map((i) => (
              <ComposeRow key={i} i={i} kind={kind} on={isOn(i, flip, one)} />
            ))}
          </Column>
        </Host>
      );
    case "native-single-host-lazy":
      return <LazyStress kind={kind} ids={ids} flip={flip} one={one} />;
  }
});

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: "#FFFFFF" },
});
