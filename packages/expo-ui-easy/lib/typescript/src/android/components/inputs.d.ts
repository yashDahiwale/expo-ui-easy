import { type ComponentProps, type FC, type MemoExoticComponent } from 'react';
import * as Expo from '@expo/ui/jetpack-compose';
import type { NativeProps } from '../internal/types.js';
declare const TEXT_FIELD_RENAME: {
    readonly onChangeText: "onValueChange";
};
/** React Native TextInput names that exist in Expo's TextField under another name or as a slot. */
interface TextInputAliases {
    /** Called with the new text. Expo: `onValueChange`. */
    onChangeText?: (text: string) => void;
    /** Placeholder string, rendered in the `TextField.Placeholder` slot. */
    placeholder?: string;
    /** Hides the text (Expo: `visualTransformation="password"`). */
    secureTextEntry?: boolean;
    /** `true` allows several lines, `false` forces one (Expo: `singleLine`). Unset keeps Expo's default. */
    multiline?: boolean;
    /** `false` makes the field read-only (Expo: `readOnly`). */
    editable?: boolean;
}
type ExpoTextField = typeof Expo.TextField | typeof Expo.OutlinedTextField;
type BaseTextFieldProps<C extends ExpoTextField> = Omit<NativeProps<ComponentProps<C>, typeof TEXT_FIELD_RENAME>, 'onChangeText'> & TextInputAliases;
/**
 * One text field, two Material3 looks: `filled` (default, Expo's `TextField`) or `outlined` (`OutlinedTextField`).
 * The slots (`TextField.Label`, `.LeadingIcon`, `.SupportingText`, ...) are Expo's and work with both.
 */
export declare const TextField: import("../internal/variants.js").VariantComponent<"variant", "filled", {
    readonly filled: MemoExoticComponent<FC<BaseTextFieldProps<typeof Expo.TextField>>>;
    readonly outlined: MemoExoticComponent<FC<BaseTextFieldProps<typeof Expo.OutlinedTextField>>>;
}, import("../internal/statics.js").Statics<typeof Expo.TextField>>;
export type TextFieldProps = ComponentProps<typeof TextField>;
export {};
//# sourceMappingURL=inputs.d.ts.map