import type { RenameMap } from './types.js';
/**
 * Converts the public (RN-named) props into the Expo UI props:
 * `onPress` -> `onClick`, `disabled` -> `enabled` (inverted), plus per-component `rename`.
 * Wrapper-only props are removed and `undefined` values are dropped.
 */
export declare function translateProps(props: Readonly<Record<string, unknown>>, rename?: RenameMap, 
/** The prop that carries the Host's layout style. The other one (if any) belongs to Expo and passes through. */
hostStyleProp?: 'style' | 'containerStyle'): Record<string, unknown>;
//# sourceMappingURL=translate.d.ts.map