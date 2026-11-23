import { createContext, useContext, useEffect, type ComponentProps, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  Host as ComposeHost,
  RNHostView as ComposeRNHostView,
  type HostProps as ComposeHostProps,
} from '@expo/ui/jetpack-compose';
import { formatTopOffenders, getHostStats, registerAutoHost } from '../internal/host-stats';
import type { AutoHostProps } from '../internal/types';

const HostContext = createContext(false);

/** `true` when the calling component is rendered inside a {@link Host}. */
export function useIsInsideHost(): boolean {
  return useContext(HostContext);
}

export type HostProps = ComposeHostProps;

/**
 * Expo UI's `Host`, but it tells the components inside that they already have a Compose
 * root. Wrap a whole screen or section in ONE `Host` and put every library component
 * inside it: each then renders as a bare Compose node instead of paying for its own root.
 */
export function Host(props: HostProps): ReactNode {
  return (
    <HostContext.Provider value>
      <ComposeHost {...props} />
    </HostContext.Provider>
  );
}

export type RNHostViewProps = ComponentProps<typeof ComposeRNHostView>;

/**
 * Embeds React Native views inside a Compose tree. Resets the host context so that
 * library components used INSIDE the embedded RN subtree create their own `Host` again.
 */
export function RNHostView(props: RNHostViewProps): ReactNode {
  return (
    <HostContext.Provider value={false}>
      <ComposeRNHostView {...props} />
    </HostContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Dev-only tracking: many separate auto-created Hosts is the main way to lose the performance this
// library exists to provide (e.g. one <Switch> per list row). See HostDebugOverlay.
// ---------------------------------------------------------------------------
const AUTO_HOST_WARN_THRESHOLD = 25;
let warned = false;

function useAutoHostTracking(active: boolean, name: string): void {
  useEffect(() => {
    if (!__DEV__ || !active) return undefined;
    const unregister = registerAutoHost(name);
    const stats = getHostStats();
    if (stats.autoHosts >= AUTO_HOST_WARN_THRESHOLD && !warned) {
      warned = true;
      console.warn(
        `[expo-ui-easy] ${stats.autoHosts} components each create their own Compose Host (${formatTopOffenders(stats)}). ` +
          'Wrap the screen in one <Host>, or use <NativeList> for lists, so they share a single Compose root.',
      );
    }
    return unregister;
  }, [active, name]);
}

interface NativeContentProps {
  /** Shown in dev diagnostics when this component creates its own Host. */
  name?: string;
  style: StyleProp<ViewStyle> | undefined;
  hostProps: AutoHostProps | undefined;
  children: ReactNode;
}

/**
 * Renders `children` bare when already inside a `Host`, otherwise wraps them in a
 * `Host` sized to its contents.
 */
export function NativeContent({ name = 'component', style, hostProps, children }: NativeContentProps): ReactNode {
  const inside = useContext(HostContext);
  useAutoHostTracking(!inside, name);
  if (inside) return children;
  return (
    <Host matchContents {...hostProps} style={style}>
      {children}
    </Host>
  );
}
