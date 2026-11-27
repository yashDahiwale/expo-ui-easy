import {
  memo,
  useMemo,
  type ComponentProps,
  type ComponentType,
  type FC,
  type JSXElementConstructor,
  type MemoExoticComponent,
  type ReactNode,
} from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ModifierConfig } from '@expo/ui/jetpack-compose/modifiers';
import { NativeContent } from '../host/host';
import { useComposeModifiers } from './modifiers';
import { copyStatics, type Statics } from './statics';
import { translateProps } from './translate';
import type { AutoHostProps, NativeProps, RenameMap } from './types';

/**
 * Components whose Expo props already have their own `style` (Text, DropdownMenu) must say
 * `hostStyleProp: 'containerStyle'`, so Expo's `style` still reaches Expo. Forgetting it is a compile error.
 */
export type StyleOption<C extends JSXElementConstructor<any>> = 'style' extends keyof ComponentProps<C>
  ? { hostStyleProp: 'containerStyle' }
  : { hostStyleProp?: 'style' };

export interface WrapOptions<R extends RenameMap> {
  displayName: string;
  /** Extra RN-name -> Expo-name renames for this component (e.g. `{ onValueChange: 'onCheckedChange' }`). */
  rename?: R;
  /** Defaults for the auto-created Host (merged under the caller's `hostProps` / `style`). */
  hostDefaults?: { hostProps?: AutoHostProps; style?: ViewStyle };
  /** Compose modifiers that always come first (e.g. `fillMaxWidth()` for sliders). Use a module-level constant. */
  leadingModifiers?: readonly ModifierConfig[];
}

/** A wrapped Expo UI component: same name, same props, same statics (e.g. `Switch.ThumbContent`). */
export type NativeComponent<
  C extends JSXElementConstructor<any>,
  R extends RenameMap = {},
> = MemoExoticComponent<FC<NativeProps<ComponentProps<C>, R>>> & Statics<C>;

/**
 * Wraps an Expo UI Jetpack Compose component so that it:
 *  - works standalone in a React Native tree (creates a `Host` unless already inside one),
 *  - accepts the RN names for props both worlds share (`onPress`, `disabled`, `testID`, ...),
 *  - keeps EVERY Expo UI prop, with Expo's name and type, and Expo's static sub-components.
 */
export function wrap<C extends JSXElementConstructor<any>, const R extends RenameMap = {}>(
  Expo: C,
  options: WrapOptions<R> & StyleOption<C>,
): NativeComponent<C, R> {
  const { displayName, rename, hostDefaults, leadingModifiers } = options;
  const hostStyleProp = (options as { hostStyleProp?: 'style' | 'containerStyle' }).hostStyleProp ?? 'style';
  const Inner = Expo as unknown as ComponentType<Record<string, unknown>>;

  function Wrapped(props: Record<string, unknown>): ReactNode {
    const testID = props['testID'] as string | undefined;
    const accessibilityLabel = props['accessibilityLabel'] as string | undefined;
    const hostProps = props['hostProps'] as AutoHostProps | undefined;
    const style = props[hostStyleProp] as StyleProp<ViewStyle> | undefined;
    const userModifiers = props['modifiers'] as readonly ModifierConfig[] | undefined;

    const modifiers = useComposeModifiers({
      testID,
      accessibilityLabel,
      leading: leadingModifiers,
      extra: userModifiers,
    });
    const mergedHostProps = useMemo(
      () => (hostDefaults?.hostProps ? { ...hostDefaults.hostProps, ...hostProps } : hostProps),
      [hostProps],
    );
    const hostStyle = useMemo(
      () => (hostDefaults?.style ? [hostDefaults.style, style] : style),
      [style],
    );

    const native = translateProps(props, rename, hostStyleProp);
    if (modifiers !== undefined) native['modifiers'] = modifiers;

    return (
      <NativeContent name={displayName} style={hostStyle} hostProps={mergedHostProps}>
        <Inner {...native} />
      </NativeContent>
    );
  }

  Wrapped.displayName = displayName;
  const wrapped = memo(Wrapped);
  wrapped.displayName = displayName;

  copyStatics(Expo, wrapped);
  return wrapped as unknown as NativeComponent<C, R>;
}
