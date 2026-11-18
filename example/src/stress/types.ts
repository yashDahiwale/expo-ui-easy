export const CONTROL_KINDS = ['switch', 'checkbox', 'radio', 'slider', 'button', 'text', 'spinner', 'chip', 'mixed'] as const;
export type ControlKind = (typeof CONTROL_KINDS)[number];
export type ConcreteKind = Exclude<ControlKind, 'mixed'>;

export const KIND_LABELS: Readonly<Record<ControlKind, string>> = {
  switch: 'Switch', checkbox: 'Checkbox', radio: 'Radio', slider: 'Slider',
  button: 'Button', text: 'Text', spinner: 'CircularProgress', chip: 'FilterChip', mixed: 'Mixed (8 kinds)',
};

export type StrategyId =
  | 'rn-flatlist'
  | 'rn-scrollview'
  | 'native-auto-flatlist'
  | 'native-row-host-flatlist'
  | 'native-single-host-column'
  | 'native-single-host-lazy';

export interface StrategyInfo {
  id: StrategyId;
  label: string;
  short: string;
  native: boolean;
  /** Everything is mounted at once (no windowing / recycling). */
  rendersAll: boolean;
  description: string;
}

export const STRATEGIES: readonly StrategyInfo[] = [
  { id: 'rn-flatlist', label: 'RN core · FlatList', short: 'RN list', native: false, rendersAll: false,
    description: 'Baseline: React Native components in a virtualized FlatList.' },
  { id: 'rn-scrollview', label: 'RN core · ScrollView (all)', short: 'RN all', native: false, rendersAll: true,
    description: 'Baseline: React Native components, every row mounted at once.' },
  { id: 'native-auto-flatlist', label: 'Native · FlatList · Host per control', short: 'N auto', native: true, rendersAll: false,
    description: 'Worst case: each control is used standalone and creates its own Compose Host.' },
  { id: 'native-row-host-flatlist', label: 'Native · FlatList · Host per row', short: 'N row-host', native: true, rendersAll: false,
    description: 'One Compose Host per FlatList row, containing label + control.' },
  { id: 'native-single-host-column', label: 'Native · ONE Host · Column (all)', short: 'N 1-host', native: true, rendersAll: true,
    description: 'One Host with a scrolling Compose Column; every row is composed at once.' },
  { id: 'native-single-host-lazy', label: 'Native · ONE Host · LazyColumn', short: 'N lazy', native: true, rendersAll: false,
    description: 'One Host with a recycling LazyColumn: only rows near the viewport are composed.' },
];

export const STRATEGY_BY_ID: Readonly<Record<StrategyId, StrategyInfo>> = Object.fromEntries(
  STRATEGIES.map((s) => [s.id, s]),
) as Record<StrategyId, StrategyInfo>;

export const COUNTS = [100, 500, 1000, 2000, 5000, 10000] as const;

const MIXED_ORDER: readonly ConcreteKind[] = ['switch', 'checkbox', 'radio', 'slider', 'button', 'text', 'spinner', 'chip'];

export function concreteKind(kind: ControlKind, index: number): ConcreteKind {
  if (kind !== 'mixed') return kind;
  return MIXED_ORDER[index % MIXED_ORDER.length] ?? 'switch';
}

/** RN core has no slider; RN rows for slider (or mixed) rows are left empty. */
export function rnSupports(kind: ControlKind): boolean {
  return kind !== 'slider';
}

/** The value every control shows. `flip` toggles all rows; `one` toggles only row 0. */
export function isOn(index: number, flip: number, one: number): boolean {
  return ((index + flip + (index === 0 ? one : 0)) & 1) === 0;
}

export interface BenchMeta {
  strategy: StrategyId;
  kind: ControlKind;
  count: number;
}

export interface BenchResult extends BenchMeta {
  id: number;
  op: string;
  /** React Profiler actualDuration summed over the operation. 0 in release builds (Profiler is stripped). */
  renderMs: number | null;
  /** Operation start to React commit (JS thread busy time + scheduling). */
  commitMs: number | null;
  /** Operation start to the second animation frame after commit (JS-visible frame). */
  frameMs: number | null;
  note: string;
}
