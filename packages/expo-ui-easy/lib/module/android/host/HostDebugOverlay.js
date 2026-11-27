"use strict";

import { useSyncExternalStore } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { formatTopOffenders, getHostStats, subscribeHostStats } from "../internal/host-stats.js";

/** Live count of auto-created Hosts (dev builds only; always `{ autoHosts: 0 }` in production). */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function useHostStats() {
  return useSyncExternalStore(subscribeHostStats, getHostStats, getHostStats);
}
const WARN_AT = 25;

/**
 * Small floating badge showing how many Compose Hosts components created for themselves, and which
 * components. Drop it anywhere (usually at the app root). Renders nothing in production builds.
 */
export function HostDebugOverlay() {
  const stats = useHostStats();
  if (!__DEV__) return null;
  const hot = stats.autoHosts >= WARN_AT;
  return /*#__PURE__*/_jsxs(View, {
    pointerEvents: "none",
    style: [styles.badge, hot ? styles.hot : styles.ok],
    children: [/*#__PURE__*/_jsx(Text, {
      style: styles.title,
      children: `auto Hosts: ${stats.autoHosts}`
    }), stats.autoHosts > 0 ? /*#__PURE__*/_jsx(Text, {
      style: styles.detail,
      children: formatTopOffenders(stats)
    }) : null]
  });
}
const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    maxWidth: 240
  },
  ok: {
    backgroundColor: '#1B5E20CC'
  },
  hot: {
    backgroundColor: '#B71C1CCC'
  },
  title: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  detail: {
    color: '#FFFFFF',
    fontSize: 10
  }
});
//# sourceMappingURL=HostDebugOverlay.js.map