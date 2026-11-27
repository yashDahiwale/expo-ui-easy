import { type ReactElement, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { LazyColumn, PullToRefreshBox } from '@expo/ui/jetpack-compose';
import type { ComponentProps } from 'react';
import type { CommonProps } from '../internal/types.js';
type LazyColumnProps = ComponentProps<typeof LazyColumn>;
type PullToRefreshProps = ComponentProps<typeof PullToRefreshBox>;
export interface NativeListProps<T> extends CommonProps {
    /** The rows. */
    data: readonly T[];
    /** Renders one row. Return Compose elements (a `ListItem`, a `Row`, ...), not React Native views. */
    renderItem: (info: {
        item: T;
        index: number;
    }) => ReactElement;
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
declare function NativeListImpl<T>(props: NativeListProps<T>): ReactNode;
/**
 * A FlatList-style list rendered by ONE Compose Host with a recycling `LazyColumn`: the setup that
 * measured about twice as fast as a Host per row.
 */
export declare const NativeList: typeof NativeListImpl;
export {};
//# sourceMappingURL=NativeList.d.ts.map