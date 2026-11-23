import type { StyleProp, ViewStyle } from 'react-native';
import type { HostProps as ExpoHostProps } from '@expo/ui/jetpack-compose';

/**
 * Props forwarded to the `Host` that a component creates around itself when it is
 * rendered outside a {@link Host}. `matchContents` defaults to `true`.
 */
export type AutoHostProps = Omit<ExpoHostProps, 'children' | 'style' | 'ref'>;

/** Props every wrapped component accepts on top of its Expo UI props. */
export interface CommonProps {
  /** Mapped to the Compose `testID` modifier. */
  testID?: string;
  /** Mapped to the Compose `semantics { contentDescription }` modifier (read by TalkBack). */
  accessibilityLabel?: string;
  /** Extra props for the auto-created `Host`. Ignored inside a {@link Host}. */
  hostProps?: AutoHostProps;
}

/** Layout style of the auto-created Host. Called `style` (RN name) unless Expo's own props already use `style`. */
export type HostStyleProps<P> = 'style' extends keyof P
  ? { containerStyle?: StyleProp<ViewStyle> }
  : { style?: StyleProp<ViewStyle> };

/** `onClick` -> `onPress` (RN name). Only present when the Expo component has `onClick`. */
type PressAlias<P> = 'onClick' extends keyof P ? { onPress?: P['onClick'] } : unknown;
/** `enabled` -> `disabled` (RN name, inverted). Only present when the Expo component has `enabled`. */
type DisabledAlias<P> = 'enabled' extends keyof P ? { disabled?: boolean } : unknown;
/** Extra renames declared per component, e.g. `{ onValueChange: 'onCheckedChange' }`. */
type RenamedProps<P, R> = { [K in keyof R]?: R[K] extends keyof P ? P[R[K]] : never };
type DropAliased<P, R> = Omit<P, ('onClick' & keyof P) | ('enabled' & keyof P) | (R[keyof R] & string)>;

export type RenameMap = Readonly<Record<string, string>>;

/**
 * The public props of a wrapped component: every Expo UI prop with its Expo name and
 * type, except that the props React Native shares are renamed to the RN names.
 */
export type NativeProps<P, R extends RenameMap = {}> = DropAliased<P, R> &
  PressAlias<P> &
  DisabledAlias<P> &
  RenamedProps<P, R> &
  CommonProps &
  HostStyleProps<P>;
