import { type ReactNode } from 'react';
import { type HostStats } from '../internal/host-stats.js';
/** Live count of auto-created Hosts (dev builds only; always `{ autoHosts: 0 }` in production). */
export declare function useHostStats(): HostStats;
/**
 * Small floating badge showing how many Compose Hosts components created for themselves, and which
 * components. Drop it anywhere (usually at the app root). Renders nothing in production builds.
 */
export declare function HostDebugOverlay(): ReactNode;
//# sourceMappingURL=HostDebugOverlay.d.ts.map