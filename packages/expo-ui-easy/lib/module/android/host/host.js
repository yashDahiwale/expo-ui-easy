"use strict";

import { createContext, useContext, useEffect } from 'react';
import { Host as ComposeHost, RNHostView as ComposeRNHostView } from '@expo/ui/jetpack-compose';
import { formatTopOffenders, getHostStats, registerAutoHost } from "../internal/host-stats.js";
import { jsx as _jsx } from "react/jsx-runtime";
const HostContext = /*#__PURE__*/createContext(false);

/** `true` when the calling component is rendered inside a {@link Host}. */
export function useIsInsideHost() {
  return useContext(HostContext);
}
/**
 * Expo UI's `Host`, but it tells the components inside that they already have a Compose
 * root. Wrap a whole screen or section in ONE `Host` and put every library component
 * inside it: each then renders as a bare Compose node instead of paying for its own root.
 */
export function Host(props) {
  return /*#__PURE__*/_jsx(HostContext.Provider, {
    value: true,
    children: /*#__PURE__*/_jsx(ComposeHost, {
      ...props
    })
  });
}
/**
 * Embeds React Native views inside a Compose tree. Resets the host context so that
 * library components used INSIDE the embedded RN subtree create their own `Host` again.
 */
export function RNHostView(props) {
  return /*#__PURE__*/_jsx(HostContext.Provider, {
    value: false,
    children: /*#__PURE__*/_jsx(ComposeRNHostView, {
      ...props
    })
  });
}

// ---------------------------------------------------------------------------
// Dev-only tracking: many separate auto-created Hosts is the main way to lose the performance this
// library exists to provide (e.g. one <Switch> per list row). See HostDebugOverlay.
// ---------------------------------------------------------------------------
const AUTO_HOST_WARN_THRESHOLD = 25;
let warned = false;
function useAutoHostTracking(active, name) {
  useEffect(() => {
    if (!__DEV__ || !active) return undefined;
    const unregister = registerAutoHost(name);
    const stats = getHostStats();
    if (stats.autoHosts >= AUTO_HOST_WARN_THRESHOLD && !warned) {
      warned = true;
      console.warn(`[expo-ui-easy] ${stats.autoHosts} components each create their own Compose Host (${formatTopOffenders(stats)}). ` + 'Wrap the screen in one <Host>, or use <NativeList> for lists, so they share a single Compose root.');
    }
    return unregister;
  }, [active, name]);
}
/**
 * Renders `children` bare when already inside a `Host`, otherwise wraps them in a
 * `Host` sized to its contents.
 */
export function NativeContent({
  name = 'component',
  style,
  hostProps,
  children
}) {
  const inside = useContext(HostContext);
  useAutoHostTracking(!inside, name);
  if (inside) return children;
  return /*#__PURE__*/_jsx(Host, {
    matchContents: true,
    ...hostProps,
    style: style,
    children: children
  });
}
//# sourceMappingURL=host.js.map