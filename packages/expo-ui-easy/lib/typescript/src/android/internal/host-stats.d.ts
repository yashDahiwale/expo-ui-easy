/**
 * Dev-only bookkeeping of auto-created Hosts: how many are alive and which components made them.
 * Pure module (no React) so it is easy to test; the overlay subscribes to it.
 */
export interface HostStats {
    /** Compose Hosts that components created around themselves because no `Host` was above them. */
    autoHosts: number;
    /** Per component name, most frequent first. */
    byComponent: readonly {
        name: string;
        count: number;
    }[];
}
type Listener = () => void;
/** Records one auto-created Host. Returns the function that removes it again. */
export declare function registerAutoHost(name: string): () => void;
/** Stable object between changes, so it works with `useSyncExternalStore`. */
export declare function getHostStats(): HostStats;
export declare function subscribeHostStats(listener: Listener): () => void;
/** "Switch x120, Text x80, Chip x12" */
export declare function formatTopOffenders(stats: HostStats, limit?: number): string;
export {};
//# sourceMappingURL=host-stats.d.ts.map