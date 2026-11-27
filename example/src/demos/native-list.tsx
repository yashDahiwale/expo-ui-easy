import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CircularProgressIndicator, HorizontalDivider, Icon, ListItem, NativeList, Text, size } from 'expo-ui-easy';
import { ICONS } from '../icons';
import { ActionButton, StateRow } from '../ui';
import { space, useTheme } from '../theme';

interface Row {
  id: number;
  title: string;
}

const PAGE = 50;
const MAX = 500;
const makeRows = (from: number, count: number): Row[] => Array.from({ length: count }, (_, i) => ({ id: from + i, title: `Row ${from + i}` }));

export function NativeListDemo() {
  const t = useTheme();
  const [rows, setRows] = useState<Row[]>(() => makeRows(0, 100));
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [endCalls, setEndCalls] = useState(0);
  const [refreshes, setRefreshes] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const onEndReached = useCallback(() => {
    setEndCalls((n) => n + 1);
    if (rows.length >= MAX || loadingMore) return;
    setLoadingMore(true);
    later(() => {
      setRows((prev) => [...prev, ...makeRows(prev.length, PAGE)]);
      setLoadingMore(false);
    }, 600);
  }, [rows.length, loadingMore]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    later(() => {
      setRows(makeRows(0, 100));
      setRefreshes((n) => n + 1);
      setRefreshing(false);
    }, 1200);
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <View style={styles.controls}>
        <StateRow text={`rows=${rows.length}  onEndReached calls=${endCalls}  refreshes=${refreshes}`} />
        <View style={styles.buttons}>
          <ActionButton label="Empty list" tone="neutral" onPress={() => setRows([])} />
          <ActionButton label="Reset 100" tone="neutral" onPress={() => setRows(makeRows(0, 100))} />
          <ActionButton label="Prepend 5" tone="neutral" onPress={() => setRows((prev) => [...makeRows(-5, 5), ...prev])} />
        </View>
      </View>

      <NativeList
        data={rows}
        renderItem={({ item }) => (
          <ListItem>
            <ListItem.HeadlineContent><Text>{item.title}</Text></ListItem.HeadlineContent>
            <ListItem.SupportingContent><Text>{`id ${item.id}`}</Text></ListItem.SupportingContent>
            <ListItem.LeadingContent><Icon source={ICONS.star} size={24} /></ListItem.LeadingContent>
          </ListItem>
        )}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={<Text variant="titleMedium">Header (a Compose element)</Text>}
        ListFooterComponent={
          loadingMore ? <CircularProgressIndicator modifiers={[size(32, 32)]} /> : <Text>{rows.length >= MAX ? 'End of list' : 'Footer'}</Text>
        }
        ListEmptyComponent={<Text>Nothing here. Press Reset 100.</Text>}
        ItemSeparatorComponent={<HorizontalDivider />}
        onEndReached={onEndReached}
        refreshing={refreshing}
        onRefresh={onRefresh}
        testID="native-list-demo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  controls: { padding: space.md, gap: space.sm },
  buttons: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
});
