/** FlatList-compatible default: `item.key`, then `item.id`, then the index. */
export function defaultKeyExtractor(item: unknown, index: number): string {
  if (typeof item === 'object' && item !== null) {
    const candidate = item as { key?: unknown; id?: unknown };
    if (candidate.key !== undefined && candidate.key !== null) return String(candidate.key);
    if (candidate.id !== undefined && candidate.id !== null) return String(candidate.id);
  }
  return String(index);
}

/** `true` when `index` is within `threshold` items of the end of a list with `length` items. */
export function isNearEnd(index: number, length: number, threshold: number): boolean {
  if (length <= 0) return false;
  return index >= length - Math.max(1, Math.ceil(threshold));
}
