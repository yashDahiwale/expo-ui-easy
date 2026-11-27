"use strict";

import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Column, LazyColumn, PullToRefreshBox } from '@expo/ui/jetpack-compose';
import { NativeContent } from "../host/host.js";
import { useComposeModifiers } from "../internal/modifiers.js";
import { defined } from "../internal/utils.js";
import { defaultKeyExtractor, isNearEnd } from "./list-utils.js";
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
const FILL_PARENT_STYLE = {
  flex: 1
};
const FILL_PARENT_HOST = {
  matchContents: false
};

/** Mounts with its row; tells the list when a row near the end is on screen. Renders only its children. */
function EndWatcher({
  active,
  onReach,
  children
}) {
  useEffect(() => {
    if (active) onReach();
  }, [active, onReach]);
  return children;
}
function NativeListImpl(props) {
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
    accessibilityLabel
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
  const renderRow = useCallback(({
    item,
    index
  }) => {
    const row = renderItem({
      item,
      index
    });
    const withSeparator = ItemSeparatorComponent != null && index < length - 1 ? /*#__PURE__*/_jsxs(Column, {
      children: [row, ItemSeparatorComponent]
    }) : row;
    return watchEnd ? /*#__PURE__*/_jsx(EndWatcher, {
      active: isNearEnd(index, length, onEndReachedThreshold),
      onReach: reachEnd,
      children: withSeparator
    }) : withSeparator;
  }, [renderItem, ItemSeparatorComponent, length, watchEnd, onEndReachedThreshold, reachEnd]);
  const modifiers = useComposeModifiers({
    testID,
    accessibilityLabel,
    extra: userModifiers
  });
  const hostStyle = useMemo(() => [FILL_PARENT_STYLE, style], [style]);
  const mergedHostProps = useMemo(() => ({
    ...FILL_PARENT_HOST,
    ...hostProps
  }), [hostProps]);
  const list = /*#__PURE__*/_jsxs(LazyColumn, {
    ...defined({
      verticalArrangement,
      horizontalAlignment,
      contentPadding,
      modifiers
    }),
    children: [ListHeaderComponent, length === 0 ? ListEmptyComponent : /*#__PURE__*/_jsx(LazyColumn.Items, {
      data: data,
      keyExtractor: keyExtractor,
      recycling: recycling,
      ...defined({
        overscanCount,
        estimatedItemSize
      }),
      children: renderRow
    }), ListFooterComponent]
  });
  return /*#__PURE__*/_jsx(NativeContent, {
    name: "NativeList",
    style: hostStyle,
    hostProps: mergedHostProps,
    children: onRefresh !== undefined ? /*#__PURE__*/_jsx(PullToRefreshBox, {
      isRefreshing: refreshing,
      onRefresh: onRefresh,
      ...defined({
        indicator: refreshIndicator
      }),
      children: list
    }) : list
  });
}

/**
 * A FlatList-style list rendered by ONE Compose Host with a recycling `LazyColumn`: the setup that
 * measured about twice as fast as a Host per row.
 */
export const NativeList = /*#__PURE__*/memo(NativeListImpl);
//# sourceMappingURL=NativeList.js.map