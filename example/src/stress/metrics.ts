import { useEffect, useState } from 'react';

export interface FrameSummary {
  frames: number;
  durationMs: number;
  avgFps: number;
  p95Ms: number;
  worstMs: number;
  /** Frames longer than 2 vsyncs (33ms). */
  jank: number;
}

/** Records JS-thread frame gaps through requestAnimationFrame. */
export class FrameRecorder {
  private gaps: number[] = [];
  private startedAt = 0;
  private last = 0;
  private handle: number | null = null;

  start(): void {
    this.gaps = [];
    this.startedAt = performance.now();
    this.last = this.startedAt;
    const tick = (): void => {
      const now = performance.now();
      this.gaps.push(now - this.last);
      this.last = now;
      this.handle = requestAnimationFrame(tick);
    };
    this.handle = requestAnimationFrame(tick);
  }

  stop(): FrameSummary {
    if (this.handle !== null) cancelAnimationFrame(this.handle);
    this.handle = null;
    return summarizeGaps(this.gaps, performance.now() - this.startedAt);
  }
}

export function summarizeGaps(gaps: readonly number[], durationMs: number): FrameSummary {
  if (gaps.length === 0) {
    return { frames: 0, durationMs, avgFps: 0, p95Ms: 0, worstMs: 0, jank: 0 };
  }
  const sorted = [...gaps].sort((a, b) => a - b);
  const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))] ?? 0;
  return {
    frames: gaps.length,
    durationMs,
    avgFps: durationMs > 0 ? (gaps.length / durationMs) * 1000 : 0,
    p95Ms: p95,
    worstMs: sorted[sorted.length - 1] ?? 0,
    jank: gaps.filter((g) => g > 33).length,
  };
}

export function formatSummary(summary: FrameSummary): string {
  return (
    `${summary.avgFps.toFixed(0)} fps avg · p95 ${summary.p95Ms.toFixed(0)}ms · ` +
    `worst ${summary.worstMs.toFixed(0)}ms · ${summary.jank} janky`
  );
}

export interface LiveFps {
  fps: number;
  worstMs: number;
}

/** Live JS-thread FPS, refreshed twice a second. Only the component calling it re-renders. */
export function useLiveFps(): LiveFps {
  const [live, setLive] = useState<LiveFps>({ fps: 0, worstMs: 0 });
  useEffect(() => {
    let handle = 0;
    let last = performance.now();
    let windowStart = last;
    let frames = 0;
    let worst = 0;
    const tick = (): void => {
      const now = performance.now();
      frames += 1;
      worst = Math.max(worst, now - last);
      last = now;
      if (now - windowStart >= 500) {
        setLive({ fps: Math.round((frames * 1000) / (now - windowStart)), worstMs: Math.round(worst) });
        windowStart = now;
        frames = 0;
        worst = 0;
      }
      handle = requestAnimationFrame(tick);
    };
    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, []);
  return live;
}

export const round1 = (n: number): number => Math.round(n * 10) / 10;
export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
