"use strict";

/**
 * Dev-only bookkeeping of auto-created Hosts: how many are alive and which components made them.
 * Pure module (no React) so it is easy to test; the overlay subscribes to it.
 */

const counts = new Map();
const listeners = new Set();
let total = 0;
let snapshot = {
  autoHosts: 0,
  byComponent: []
};
function refresh() {
  snapshot = {
    autoHosts: total,
    byComponent: [...counts].map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count)
  };
  listeners.forEach(listener => listener());
}

/** Records one auto-created Host. Returns the function that removes it again. */
export function registerAutoHost(name) {
  counts.set(name, (counts.get(name) ?? 0) + 1);
  total += 1;
  refresh();
  return () => {
    const next = (counts.get(name) ?? 1) - 1;
    if (next <= 0) counts.delete(name);else counts.set(name, next);
    total -= 1;
    refresh();
  };
}

/** Stable object between changes, so it works with `useSyncExternalStore`. */
export function getHostStats() {
  return snapshot;
}
export function subscribeHostStats(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** "Switch x120, Text x80, Chip x12" */
export function formatTopOffenders(stats, limit = 3) {
  return stats.byComponent.slice(0, limit).map(entry => `${entry.name} x${entry.count}`).join(', ');
}
//# sourceMappingURL=host-stats.js.map