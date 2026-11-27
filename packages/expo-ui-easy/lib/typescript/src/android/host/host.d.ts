import { type ComponentProps, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { RNHostView as ComposeRNHostView, type HostProps as ComposeHostProps } from '@expo/ui/jetpack-compose';
import type { AutoHostProps } from '../internal/types.js';
/** `true` when the calling component is rendered inside a {@link Host}. */
export declare function useIsInsideHost(): boolean;
export type HostProps = ComposeHostProps;
/**
 * Expo UI's `Host`, but it tells the components inside that they already have a Compose
 * root. Wrap a whole screen or section in ONE `Host` and put every library component
 * inside it: each then renders as a bare Compose node instead of paying for its own root.
 */
export declare function Host(props: HostProps): ReactNode;
export type RNHostViewProps = ComponentProps<typeof ComposeRNHostView>;
/**
 * Embeds React Native views inside a Compose tree. Resets the host context so that
 * library components used INSIDE the embedded RN subtree create their own `Host` again.
 */
export declare function RNHostView(props: RNHostViewProps): ReactNode;
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
export declare function NativeContent({ name, style, hostProps, children }: NativeContentProps): ReactNode;
export {};
//# sourceMappingURL=host.d.ts.map