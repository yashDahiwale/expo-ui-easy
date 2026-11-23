import type { RenameMap } from './types';

/** Props handled by the wrapper itself; they never reach the Expo component. */
const WRAPPER_KEYS: ReadonlySet<string> = new Set(['testID', 'accessibilityLabel', 'hostProps', 'modifiers']);

/**
 * Converts the public (RN-named) props into the Expo UI props:
 * `onPress` -> `onClick`, `disabled` -> `enabled` (inverted), plus per-component `rename`.
 * Wrapper-only props are removed and `undefined` values are dropped.
 */
export function translateProps(
  props: Readonly<Record<string, unknown>>,
  rename: RenameMap = {},
  /** The prop that carries the Host's layout style. The other one (if any) belongs to Expo and passes through. */
  hostStyleProp: 'style' | 'containerStyle' = 'style',
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(props)) {
    const value = props[key];
    if (value === undefined || WRAPPER_KEYS.has(key) || key === hostStyleProp) continue;
    if (key === 'onPress') out['onClick'] = value;
    else if (key === 'disabled') out['enabled'] = !value;
    else out[rename[key] ?? key] = value;
  }
  return out;
}
