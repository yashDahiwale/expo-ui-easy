import {
  Profiler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ProfilerOnRenderCallback,
  type ReactNode,
} from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { ActionButton, Chip } from '../ui';
import { FrameRecorder, formatSummary, round1, sleep, useLiveFps } from './metrics';
import { StressList } from './StressList';
import {
  COUNTS,
  CONTROL_KINDS,
  KIND_LABELS,
  STRATEGIES,
  STRATEGY_BY_ID,
  rnSupports,
  type BenchMeta,
  type BenchResult,
  type ControlKind,
  type StrategyId,
} from './types';

interface Pending {
  op: string;
  meta: BenchMeta;
  t0: number;
  committedAt: number | null;
  resolve: (result: BenchResult) => void;
}

const SUITE_COUNTS: readonly number[] = [500, 1000, 2000, 5000];
/** Non-virtualized strategies are skipped above this size in automated runs. */
const MAX_AUTO_ALL_ROWS = 2000;

function FpsBadge(): ReactNode {
  const { fps, worstMs } = useLiveFps();
  const color = fps >= 55 ? '#2E7D32' : fps >= 30 ? '#E65100' : '#B71C1C';
  return (
    <Text style={{ color, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
      {`${fps} fps · ${worstMs}ms`}
    </Text>
  );
}

export function StressScreen(): ReactNode {
  const t = useTheme();
  const insets = useSafeAreaInsets();

  const [strategy, setStrategy] = useState<StrategyId>('rn-flatlist');
  const [kind, setKind] = useState<ControlKind>('switch');
  const [count, setCount] = useState<number>(1000);
  const [mounted, setMounted] = useState(false);
  const [flip, setFlip] = useState(0);
  const [one, setOne] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [results, setResults] = useState<readonly BenchResult[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const pending = useRef<Pending | null>(null);
  const renderAcc = useRef(0);
  const cancel = useRef(false);
  const mountedRef = useRef(false);
  const idCounter = useRef(0);

  useEffect(() => {
    mountedRef.current = mounted;
  }, [mounted]);

  const ids = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);
  const meta = useMemo<BenchMeta>(() => ({ strategy, kind, count }), [strategy, kind, count]);
  const info = STRATEGY_BY_ID[strategy];
  const unsupported = !info.native && !rnSupports(kind);

  // JS render time. The React Profiler only reports in dev builds.
  const onRender: ProfilerOnRenderCallback = (_id, _phase, actualDuration) => {
    renderAcc.current += actualDuration;
  };

  const record = useCallback((partial: Omit<BenchResult, 'id'>): BenchResult => {
    idCounter.current += 1;
    const full: BenchResult = { ...partial, id: idCounter.current };
    console.log('[stress]', JSON.stringify(full));
    setResults((prev) => [full, ...prev].slice(0, 60));
    return full;
  }, []);

  /**
   * Runs `mutate` (state changes), then resolves with timings once React has committed
   * and two animation frames have passed.
   */
  const measure = useCallback(
    (op: string, m: BenchMeta, mutate: () => void): Promise<BenchResult> =>
      new Promise((resolve) => {
        renderAcc.current = 0;
        pending.current = { op, meta: m, t0: performance.now(), committedAt: null, resolve };
        mutate();
        setVersion((v) => v + 1);
      }),
    [],
  );

  useLayoutEffect(() => {
    const p = pending.current;
    if (p === null || p.committedAt !== null) return;
    const committedAt = performance.now();
    p.committedAt = committedAt;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const framedAt = performance.now();
        pending.current = null;
        p.resolve(
          record({
            op: p.op,
            ...p.meta,
            renderMs: round1(renderAcc.current),
            commitMs: round1(committedAt - p.t0),
            frameMs: round1(framedAt - p.t0),
            note: '',
          }),
        );
      }),
    );
  }, [version, record]);

  const confirmHeavy = (id: StrategyId, rows: number): Promise<boolean> => {
    if (!(STRATEGY_BY_ID[id].rendersAll && rows >= MAX_AUTO_ALL_ROWS)) return Promise.resolve(true);
    return new Promise((resolve) => {
      Alert.alert(
        'Heavy test',
        `Mounting ${rows} rows with no virtualization may freeze or crash a low-end device. Continue?`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Run', onPress: () => resolve(true) },
        ],
        { cancelable: true, onDismiss: () => resolve(false) },
      );
    });
  };

  const run = async (label: string, job: () => Promise<void>): Promise<void> => {
    if (busy !== null || pending.current !== null) return;
    cancel.current = false;
    setBusy(label);
    try {
      await job();
    } finally {
      setBusy(null);
    }
  };

  const ensureUnmounted = async (m: BenchMeta): Promise<void> => {
    if (!mountedRef.current) return;
    await measure('unmount', m, () => setMounted(false));
    await sleep(200);
  };

  const cycle = async (m: BenchMeta): Promise<void> => {
    await measure('mount', m, () => {
      setStrategy(m.strategy);
      setKind(m.kind);
      setCount(m.count);
      setMounted(true);
    });
    if (cancel.current) return;
    await measure('flip all', m, () => setFlip((f) => f + 1));
    if (cancel.current) return;
    await measure('change 1 row', m, () => setOne((o) => o + 1));
    if (cancel.current) return;
    await measure('unmount', m, () => setMounted(false));
    await sleep(300);
  };

  const onMount = (): Promise<void> =>
    run('mount', async () => {
      if (unsupported || !(await confirmHeavy(strategy, count))) return;
      await ensureUnmounted(meta);
      await measure('mount', meta, () => setMounted(true));
    });

  const onFlip = (): Promise<void> =>
    run('flip', async () => {
      await measure('flip all', meta, () => setFlip((f) => f + 1));
    });

  const onOne = (): Promise<void> =>
    run('change 1', async () => {
      await measure('change 1 row', meta, () => setOne((o) => o + 1));
    });

  const onUnmount = (): Promise<void> =>
    run('unmount', async () => {
      await measure('unmount', meta, () => setMounted(false));
    });

  const onBurst = (): Promise<void> =>
    run('burst', async () => {
      const durationMs = 5000;
      const recorder = new FrameRecorder();
      renderAcc.current = 0;
      let updates = 0;
      const startedAt = performance.now();
      recorder.start();
      await new Promise<void>((resolve) => {
        const loop = (): void => {
          if (cancel.current || performance.now() - startedAt >= durationMs) {
            resolve();
            return;
          }
          updates += 1;
          setFlip((f) => f + 1);
          requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      });
      const summary = recorder.stop();
      const perSecond = updates / Math.max(0.001, summary.durationMs / 1000);
      record({
        op: 'burst 5s',
        ...meta,
        renderMs: null,
        commitMs: null,
        frameMs: null,
        note:
          `${formatSummary(summary)} · ${updates} flips (${perSecond.toFixed(0)}/s) · ` +
          `JS render avg ${round1(renderAcc.current / Math.max(1, updates))}ms`,
      });
    });

  const onSuite = (): Promise<void> =>
    run('suite', async () => {
      if (unsupported) return;
      await ensureUnmounted(meta);
      for (const n of SUITE_COUNTS) {
        if (cancel.current) break;
        if (info.rendersAll && n > MAX_AUTO_ALL_ROWS) continue;
        await cycle({ strategy, kind, count: n });
      }
    });

  const onMatrix = (): Promise<void> =>
    run('compare', async () => {
      await ensureUnmounted(meta);
      for (const s of STRATEGIES) {
        if (cancel.current) break;
        const m: BenchMeta = { strategy: s.id, kind, count };
        if (!s.native && !rnSupports(kind)) continue;
        if (s.rendersAll && count > MAX_AUTO_ALL_ROWS) {
          record({ op: 'skipped', ...m, renderMs: null, commitMs: null, frameMs: null, note: 'non-virtualized, too heavy for an automated run' });
          continue;
        }
        await cycle(m);
      }
    });

  const last = results[0];
  const disabled = busy !== null;

  return (
    <View style={styles.root}>
      <View style={styles.listArea}>
        <Profiler id="stress-list" onRender={onRender}>
          {mounted ? (
            <StressList strategy={strategy} kind={kind} ids={ids} flip={flip} one={one} />
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {unsupported
                  ? 'React Native core has no Slider, so this RN baseline is not available.'
                  : `Nothing mounted. Press “Mount ${count}”.`}
              </Text>
            </View>
          )}
        </Profiler>
      </View>

      <View style={[styles.dock, { backgroundColor: t.bg, borderColor: t.border, paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.summaryRow}>
        <Text style={[styles.summary, styles.summaryText, { color: t.subtle }]} numberOfLines={2}>
          {busy !== null
            ? `Running: ${busy}…`
            : last === undefined
              ? 'No results yet.'
              : `${last.op} · ${last.count} rows · ${last.note !== '' ? last.note : `commit ${last.commitMs}ms · frame ${last.frameMs}ms`}`}
        </Text>
        <FpsBadge />
        </View>

        <View style={styles.buttons}>
          <ActionButton label={`Mount ${count}`} onPress={onMount} disabled={disabled || unsupported} />
          <ActionButton label="Flip all" onPress={onFlip} disabled={disabled || !mounted} />
          <ActionButton label="Change 1" onPress={onOne} disabled={disabled || !mounted} />
          <ActionButton label="Burst 5s" onPress={onBurst} disabled={disabled || !mounted} />
          <ActionButton label="Unmount" tone="neutral" onPress={onUnmount} disabled={disabled || !mounted} />
          <ActionButton
            label={busy !== null ? 'Cancel' : panelOpen ? 'Hide ▾' : 'Setup ▴'}
            tone={busy !== null ? 'danger' : 'neutral'}
            onPress={() => {
              if (busy !== null) cancel.current = true;
              else setPanelOpen((open) => !open);
            }}
          />
        </View>

        {panelOpen ? (
          <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent}>
            <Text style={[styles.heading, { color: t.subtle }]}>STRATEGY</Text>
            <View style={styles.chips}>
              {STRATEGIES.map((s) => (
                <Chip key={s.id} label={s.label} selected={s.id === strategy} disabled={disabled} onPress={() => setStrategy(s.id)} />
              ))}
            </View>
            <Text style={[styles.hint, { color: t.subtle }]}>{info.description}</Text>

            <Text style={[styles.heading, { color: t.subtle }]}>CONTROL</Text>
            <View style={styles.chips}>
              {CONTROL_KINDS.map((k) => (
                <Chip key={k} label={KIND_LABELS[k]} selected={k === kind} disabled={disabled} onPress={() => setKind(k)} />
              ))}
            </View>
            {!info.native && kind === 'mixed' ? (
              <Text style={[styles.hint, { color: t.subtle }]}>RN baseline leaves every slider row empty (no slider in RN core).</Text>
            ) : null}
            {!info.native && (kind === 'checkbox' || kind === 'radio' || kind === 'mixed') ? (
              <Text style={[styles.hint, { color: t.subtle }]}>RN checkbox / radio are Pressable+View approximations (RN core has none).</Text>
            ) : null}

            <Text style={[styles.heading, { color: t.subtle }]}>ROWS</Text>
            <View style={styles.chips}>
              {COUNTS.map((n) => (
                <Chip key={n} label={String(n)} selected={n === count} disabled={disabled} onPress={() => setCount(n)} />
              ))}
            </View>
            {info.rendersAll && count >= MAX_AUTO_ALL_ROWS ? (
              <Text style={[styles.hint, { color: t.danger }]}>This strategy mounts every row at once; expect a long freeze.</Text>
            ) : null}

            <Text style={[styles.heading, { color: t.subtle }]}>AUTOMATED</Text>
            <View style={styles.chips}>
              <ActionButton label="Suite: 500 → 5000" onPress={onSuite} disabled={disabled || unsupported} />
              <ActionButton label={`Compare all strategies @ ${count}`} onPress={onMatrix} disabled={disabled} />
            </View>
            <Text style={[styles.hint, { color: t.subtle }]}>
              Each cycle = mount, flip all rows, change one row, unmount. Non-virtualized strategies are skipped above {MAX_AUTO_ALL_ROWS} rows.
            </Text>

            <View style={styles.resultsHeader}>
              <Text style={[styles.heading, { color: t.subtle }]}>RESULTS (newest first)</Text>
              <ActionButton label="Clear" tone="neutral" onPress={() => setResults([])} disabled={disabled} />
            </View>
            {results.map((r) => (
              <View key={r.id} style={[styles.result, { borderColor: t.border }]}>
                <Text style={[styles.resultTitle, { color: t.text }]}>
                  {`${r.op} · ${STRATEGY_BY_ID[r.strategy].short} · ${KIND_LABELS[r.kind]} · ${r.count}`}
                </Text>
                <Text style={[styles.resultBody, { color: t.subtle }]}>
                  {r.note !== ''
                    ? r.note
                    : `render ${r.renderMs}ms · commit ${r.commitMs}ms · frame ${r.frameMs}ms`}
                </Text>
              </View>
            ))}
            <Text style={[styles.hint, { color: t.subtle }]}>
              render = React Profiler time (dev builds only, 0 in release). commit = start → React commit. frame = start → 2nd frame after commit.
              These are JS-thread numbers: Compose composes natively afterwards, so also watch the FPS badge while scrolling, and use Android Studio's profiler or `adb shell dumpsys gfxinfo` for native cost. Compare in a release build on a low-end device.
            </Text>
          </ScrollView>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  listArea: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyText: { color: '#625B71', textAlign: 'center' },
  dock: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12, paddingTop: 8, gap: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryText: { flex: 1 },
  summary: { fontSize: 12, fontFamily: 'monospace' },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  panel: { maxHeight: 360 },
  panelContent: { gap: 8, paddingBottom: 12 },
  heading: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 6 },
  hint: { fontSize: 12, lineHeight: 17 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  resultsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  result: { borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 6 },
  resultTitle: { fontSize: 12, fontWeight: '600' },
  resultBody: { fontSize: 12, fontFamily: 'monospace' },
});
