"use strict";

/**
 * Returns a copy of `obj` without keys whose value is `undefined`.
 *
 * Needed because `@expo/ui` props are declared as `prop?: T`, and with
 * `exactOptionalPropertyTypes` an explicit `undefined` is not assignable to them.
 * Spreading `defined({...})` into JSX keeps the call sites strict and clean.
 */
export function defined(obj) {
  const out = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value !== undefined) out[key] = value;
  }
  return out;
}

/** `null` and `undefined` both become `undefined` (RN allows `null` for some color props). */
export function nullish(value) {
  return value ?? undefined;
}
export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}
//# sourceMappingURL=utils.js.map