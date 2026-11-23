import { memo, useCallback, useEffect, useMemo, useRef, type ReactElement, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Column, LazyColumn, PullToRefreshBox } from '@expo/ui/jetpack-compose';
import type { ComponentProps } from 'react';
import { NativeContent } from '../host/host';
import { useComposeModifiers } from '../internal/modifiers';
import type { AutoHostProps, CommonProps } from '../internal/types';
import { defined } from '../internal/utils';
import { defaultKeyExtractor, isNearEnd } from './list-utils';

type LazyColumnProps = ComponentProps<typeof LazyColumn>;
type PullToRefreshProps = ComponentProps<typeof PullToRefreshBox>;

export interface NativeListProps<T> extends CommonProps {
  /** The rows. */
  data: readonly T[];
  /** Renders one row. Return Compose elements (a `ListItem`, a `Row`, ...), not React Native views. */
  renderItem: (info: { item: T; index: number }) => ReactElement;
  /** Stable key per row. Default: `item.key`, then `item.id`, then the index (same as FlatList). */
  keyExtractor?: (item: T, index: number) => string;
  /** Rendered before the first row. Compose elements. */
  ListHeaderComponent?: ReactNode;
  /** Rendered after the last row. Compose elements. */
  ListFooterComponent?: ReactNode;
  /** Rendered instead of rows when `data` is empty. Compose elements. */
  ListEmptyComponent?: ReactNode;
  /** Rendered between rows. Compose elements. */
  ItemSeparatorComponent?: ReactNode;
  /**
   * Called once each time the list is scrolled near its end (and again after `data` grows).
   * Detected from which rows are mounted, so it needs `recycling` (the default).
   */
  onEndReached?: () => void;
  /** How close to the end, in ROWS (not viewport lengths as in FlatList), `onEndReached` fires. @default 4 */
  onEndReachedThreshold?: number;
  /** Wraps the list in Expo's PullToRefreshBox. */
  refreshing?: boolean;
  /** Called when the user pulls to refresh. Setting it enables pull to refresh. */
  onRefresh?: () => void;
  /** Expo's `PullToRefreshBox` indicator props (color, containerColor, modifiers). */
  refreshIndicator?: PullToRefreshProps['indicator'];
  /** Expo's recycling options for `LazyColumn.Items`. */
  recycling?: boolean;
  overscanCount?: number;
  estimatedItemSize?: number;
  /** Expo's `LazyColumn` props, unchanged. */
  verticalArrangement?: LazyColumnProps['verticalArrangement'];
  horizontalAlignment?: LazyColumnProps['horizontalAlignment'];
  contentPadding?: LazyColumnProps['contentPadding'];
  modifiers?: LazyColumnProps['modifiers'];
  /** Layout of the auto-created Host (default: fills its parent). Ignored inside a `Host`. */
  style?: StyleProp<ViewStyle>;
}

const FILL_PARENT_STYLE: ViewStyle = { flex: 1 };
const FILL_PARENT_HOST: AutoHostProps = { matchContents: false };

/** Mounts with its row; tells the list when a row near the end is on screen. Renders only its children. */
function EndWatcher({ active, onReach, children }: { active: boolean; onReach: () => void; children: ReactElement }): ReactElement {
  useEffect(() => {
    if (active) onReach();
  }, [active, onReach]);
  return children;
}

function NativeListImpl<T>(props: NativeListProps<T>): ReactNode {
  const {
    data,
    renderItem,
    keyExtractor = defaultKeyExtractor,
    ListHeaderComponent,
    ListFooterComponent,
    ListEmptyComponent,
    ItemSeparatorComponent,
    onEndReached,
    onEndReachedThreshold = 4,
    refreshing = false,
    onRefresh,
    refreshIndicator,
    recycling = true,
    overscanCount,
    estimatedItemSize,
    verticalArrangement,
    horizontalAlignment,
    contentPadding,
    modifiers: userModifiers,
    style,
    hostProps,
    testID,
    accessibilityLabel,
  } = props;

  if (__DEV__ && onEndReached !== undefined && !recycling) {
    console.warn('[expo-ui-easy] NativeList: onEndReached needs `recycling` (without it every row is mounted at once).');
  }

  // onEndReached fires once per data length, so a row re-mounting while scrolling cannot call it twice.
  const length = data.length;
  const lengthRef = useRef(length);
  const firedForLength = useRef(-1);
  const onEndRef = useRef(onEndReached);
  useEffect(() => {
    lengthRef.current = length;
    onEndRef.current = onEndReached;
  });
  const reachEnd = useCallback(() => {
    if (firedForLength.current === lengthRef.current) return;
    firedForLength.current = lengthRef.current;
    onEndRef.current?.();
  }, []);

  const watchEnd = onEndReached !== undefined;
  const renderRow = useCallback(
    ({ item, index }: { item: T; index: number }): ReactElement => {
      const row = renderItem({ item, index });
      const withSeparator =
        ItemSeparatorComponent != null && index < length - 1 ? (
          <Column>
            {row}
            {ItemSeparatorComponent}
          </Column>
        ) : (
          row
        );
      return watchEnd ? (
        <EndWatcher active={isNearEnd(index, length, onEndReachedThreshold)} onReach={reachEnd}>
          {withSeparator}
        </EndWatcher>
      ) : (
        withSeparator
      );
    },
    [renderItem, ItemSeparatorComponent, length, watchEnd, onEndReachedThreshold, reachEnd],
  );

  const modifiers = useComposeModifiers({ testID, accessibilityLabel, extra: userModifiers });
  const hostStyle = useMemo(() => [FILL_PARENT_STYLE, style], [style]);
  const mergedHostProps = useMemo(() => ({ ...FILL_PARENT_HOST, ...hostProps }), [hostProps]);

  const list = (
    <LazyColumn {...defined({ verticalArrangement, horizontalAlignment, contentPadding, modifiers })}>
      {ListHeaderComponent}
      {length === 0 ? (
        ListEmptyComponent
      ) : (
        <LazyColumn.Items
          data={data}
          keyExtractor={keyExtractor}
          recycling={recycling}
          {...defined({ overscanCount, estimatedItemSize })}>
          {renderRow}
        </LazyColumn.Items>
      )}
      {ListFooterComponent}
    </LazyColumn>
  );

  return (
    <NativeContent name="NativeList" style={hostStyle} hostProps={mergedHostProps}>
      {onRefresh !== undefined ? (
        <PullToRefreshBox isRefreshing={refreshing} onRefresh={onRefresh} {...defined({ indicator: refreshIndicator })}>
          {list}
        </PullToRefreshBox>
      ) : (
        list
      )}
    </NativeContent>
  );
}

/**
 * A FlatList-style list rendered by ONE Compose Host with a recycling `LazyColumn`: the setup that
 * measured about twice as fast as a Host per row.
 */
export const NativeList = memo(NativeListImpl) as typeof NativeListImpl;
