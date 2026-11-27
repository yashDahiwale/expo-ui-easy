import { type ComponentProps, type ReactNode } from 'react';
import * as Expo from '@expo/ui/jetpack-compose';
import type { NativeProps } from '../internal/types.js';
/** What the Expo button family adds on top of its Expo props. */
interface IconSlots {
    /**
     * Compose element shown before the label, e.g.
     * `<Icon source={require('./add.xml')} size={18} />`. Material3 sizes button icons at 18dp.
     * When set (and `contentPadding` is not), the padding follows the Material3 icon spec.
     */
    startIcon?: ReactNode;
    /** Compose element shown after the label. Same rules as `startIcon`. */
    endIcon?: ReactNode;
}
type BaseButtonProps = NativeProps<ComponentProps<typeof Expo.Button>> & IconSlots;
/**
 * One button, five Material3 looks. `variant` picks the Expo component: `filled` (default, `Button`),
 * `tonal` (`FilledTonalButton`), `outlined`, `elevated` or `text`. Every variant takes the same props.
 */
export declare const Button: import("../internal/variants.js").VariantComponent<"variant", "filled", {
    readonly filled: import("react").MemoExoticComponent<{
        (props: BaseButtonProps): ReactNode;
        displayName: string;
    }>;
    readonly tonal: import("react").MemoExoticComponent<{
        (props: BaseButtonProps): ReactNode;
        displayName: string;
    }>;
    readonly outlined: import("react").MemoExoticComponent<{
        (props: BaseButtonProps): ReactNode;
        displayName: string;
    }>;
    readonly elevated: import("react").MemoExoticComponent<{
        (props: BaseButtonProps): ReactNode;
        displayName: string;
    }>;
    readonly text: import("react").MemoExoticComponent<{
        (props: BaseButtonProps): ReactNode;
        displayName: string;
    }>;
}, import("../internal/statics.js").Statics<{}>>;
export type ButtonProps = ComponentProps<typeof Button>;
export {};
//# sourceMappingURL=buttons.d.ts.map