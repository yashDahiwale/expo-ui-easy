import { type ComponentProps, type ReactNode } from 'react';
import * as Expo from '@expo/ui/jetpack-compose';
declare const BaseText: import("../index.js").NativeComponent<typeof Expo.Text, {
    readonly numberOfLines: "maxLines";
}>;
type BaseTextProps = ComponentProps<typeof BaseText>;
type TextStyleProp = NonNullable<BaseTextProps['style']>;
/** A Material3 type role: `displayLarge`, `titleMedium`, `bodySmall`, `labelLarge`, ... */
export type TextVariant = NonNullable<TextStyleProp['typography']>;
export type TextProps = BaseTextProps & {
    /**
     * Material3 type role. Shorthand for `style={{ typography: variant }}`: every key in `style`
     * (including `typography`) overrides it.
     */
    variant?: TextVariant;
};
declare function TextImpl({ variant, style, ...rest }: TextProps): ReactNode;
declare namespace TextImpl {
    var displayName: string;
}
/** Expo's `Text`. `numberOfLines` is React Native's name for `maxLines`; `variant` picks a Material3 type role. */
export declare const Text: import("react").MemoExoticComponent<typeof TextImpl>;
export {};
//# sourceMappingURL=text.d.ts.map