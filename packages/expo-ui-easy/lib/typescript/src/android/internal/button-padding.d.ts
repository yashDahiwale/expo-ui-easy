export type ButtonFamily = 'standard' | 'text';
export interface ContentPadding {
    start: number;
    top: number;
    end: number;
    bottom: number;
}
/**
 * Material3 shrinks the padding on the side that holds an icon so the icon sits closer to
 * the edge (Button 24 -> 16dp, TextButton 12 -> 12dp with 16dp on the other side).
 * Returns `undefined` when there is no icon, so Expo's own default applies.
 */
export declare function iconContentPadding(family: ButtonFamily, hasStartIcon: boolean, hasEndIcon: boolean): ContentPadding | undefined;
//# sourceMappingURL=button-padding.d.ts.map