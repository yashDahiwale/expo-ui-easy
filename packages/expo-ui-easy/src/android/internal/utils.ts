/**
 * Returns a copy of `obj` without keys whose value is `undefined`.
 *
 * Needed because `@expo/ui` props are declared as `prop?: T`, and with
 * `exactOptionalPropertyTypes` an explicit `undefined` is not assignable to them.
 * Spreading `defined({...})` into JSX keeps the call sites strict and clean.
 */
export function defined<T extends Record<string, unknown>>(
  obj: T,
): { [K in keyof T]?: Exclude<T[K], undefined> } {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value !== undefined) out[key] = value;
  }
  return out as { [K in keyof T]?: Exclude<T[K], undefined> };
}

/** `null` and `undefined` both become `undefined` (RN allows `null` for some color props). */
export function nullish<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}

export function isEmptyObject(obj: object): boolean {
  return Object.keys(obj).length === 0;
}
