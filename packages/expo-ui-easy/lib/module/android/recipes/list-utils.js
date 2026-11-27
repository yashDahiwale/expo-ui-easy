"use strict";

/** FlatList-compatible default: `item.key`, then `item.id`, then the index. */
export function defaultKeyExtractor(item, index) {
  if (typeof item === 'object' && item !== null) {
    const candidate = item;
    if (candidate.key !== undefined && candidate.key !== null) return String(candidate.key);
    if (candidate.id !== undefined && candidate.id !== null) return String(candidate.id);
  }
  return String(index);
}

/** `true` when `index` is within `threshold` items of the end of a list with `length` items. */
export function isNearEnd(index, length, threshold) {
  if (length <= 0) return false;
  return index >= length - Math.max(1, Math.ceil(threshold));
}
//# sourceMappingURL=list-utils.js.map