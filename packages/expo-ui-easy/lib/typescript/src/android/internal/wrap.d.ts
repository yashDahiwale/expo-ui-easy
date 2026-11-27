import { type ComponentProps, type FC, type JSXElementConstructor, type MemoExoticComponent } from 'react';
import type { ViewStyle } from 'react-native';
import type { ModifierConfig } from '@expo/ui/jetpack-compose/modifiers';
import { type Statics } from './statics.js';
import type { AutoHostProps, NativeProps, RenameMap } from './types.js';
/**
 * Components whose Expo props already have their own `style` (Text, DropdownMenu) must say
 * `hostStyleProp: 'containerStyle'`, so Expo's `style` still reaches Expo. Forgetting it is a compile error.
 */
export type StyleOption<C extends JSXElementConstructor<any>> = 'style' extends keyof ComponentProps<C> ? {
    hostStyleProp: 'containerStyle';
} : {
    hostStyleProp?: 'style';
};
export interface WrapOptions<R extends RenameMap> {
    displayName: string;
    /** Extra RN-name -> Expo-name renames for this component (e.g. `{ onValueChange: 'onCheckedChange' }`). */
    rename?: R;
    /** Defaults for the auto-created Host (merged under the caller's `hostProps` / `style`). */
    hostDefaults?: {
        hostProps?: AutoHostProps;
        style?: ViewStyle;
    };
    /** Compose modifiers that always come first (e.g. `fillMaxWidth()` for sliders). Use a module-level constant. */
    leadingModifiers?: readonly ModifierConfig[];
}
/** A wrapped Expo UI component: same name, same props, same statics (e.g. `Switch.ThumbContent`). */
export type NativeComponent<C extends JSXElementConstructor<any>, R extends RenameMap = {}> = MemoExoticComponent<FC<NativeProps<ComponentProps<C>, R>>> & Statics<C>;
/**
 * Wraps an Expo UI Jetpack Compose component so that it:
 *  - works standalone in a React Native tree (creates a `Host` unless already inside one),
 *  - accepts the RN names for props both worlds share (`onPress`, `disabled`, `testID`, ...),
 *  - keeps EVERY Expo UI prop, with Expo's name and type, and Expo's static sub-components.
 */
export declare function wrap<C extends JSXElementConstructor<any>, const R extends RenameMap = {}>(Expo: C, options: WrapOptions<R> & StyleOption<C>): NativeComponent<C, R>;
//# sourceMappingURL=wrap.d.ts.map