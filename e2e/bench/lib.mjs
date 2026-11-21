// Pure helpers for the benchmark runner: parse the stress test's `[stress]` log lines, aggregate repeats,
// express strategies as ratios against a baseline, and check regression gates. No I/O here.

export const OPS = ['mount', 'flip all', 'change 1 row', 'unmount'];

/** Pulls the JSON out of every `[stress]` line (logcat wraps it as `'[stress]', '{...}'`). */
export function parseLog(text) {
  const results = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.includes('[stress]')) continue;
    const start = line.indexOf('{');
    const end = line.lastIndexOf('}');
    if (start === -1 || end <= start) continue;
    try {
      const value = JSON.parse(line.slice(start, end + 1));
      if (value && typeof value.op === 'string' && typeof value.strategy === 'string') results.push(value);
    } catch {
      // a truncated or foreign line: ignore it
    }
  }
  return results;
}

export function median(values) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Groups results by `${kind}@${count}` then strategy. Each op keeps the median of its repeats.
 * Burst results are summarised as average fps.
 * @returns {Map<string, Map<string, { ops: Record<string, { commitMs: number|null, frameMs: number|null, runs: number }>, burstFps: number|null }>>}
 */
export function aggregate(results) {
  const groups = new Map();
  const raw = new Map();
  for (const r of results) {
    if (r.op === 'skipped') continue;
    const groupKey = `${r.kind}@${r.count}`;
    const key = `${groupKey}|${r.strategy}`;
    if (!raw.has(key)) raw.set(key, { groupKey, strategy: r.strategy, ops: {}, burst: [] });
    const entry = raw.get(key);
    if (r.op.startsWith('burst')) {
      const match = /^(\d+) fps avg/.exec(r.note ?? '');
      if (match) entry.burst.push(Number(match[1]));
      continue;
    }
    (entry.ops[r.op] ??= { commit: [], frame: [] });
    if (typeof r.commitMs === 'number') entry.ops[r.op].commit.push(r.commitMs);
    if (typeof r.frameMs === 'number') entry.ops[r.op].frame.push(r.frameMs);
  }
  for (const { groupKey, strategy, ops, burst } of raw.values()) {
    if (!groups.has(groupKey)) groups.set(groupKey, new Map());
    const summary = {};
    for (const [op, v] of Object.entries(ops)) {
      summary[op] = { commitMs: median(v.commit), frameMs: median(v.frame), runs: Math.max(v.commit.length, v.frame.length) };
    }
    groups.get(groupKey).set(strategy, { ops: summary, burstFps: median(burst) });
  }
  return groups;
}

/** `value / baseline` (lower is better); `null` when either side is missing or the baseline is 0. */
export function ratio(value, baseline) {
  if (value == null || baseline == null || baseline === 0) return null;
  return value / baseline;
}

/** Strategy / baseline for one op and metric within one group. */
export function ratioFor(group, strategy, baselineStrategy, op, metric = 'frameMs') {
  const a = group.get(strategy)?.ops[op]?.[metric];
  const b = group.get(baselineStrategy)?.ops[op]?.[metric];
  return ratio(a, b);
}

const fmt = (n) => (n == null ? '-' : n.toFixed(n < 10 ? 1 : 0));
const fmtRatio = (n) => (n == null ? '' : ` (x${n.toFixed(2)})`);

/** Markdown report: one table per kind@count, every strategy with frame ms and its ratio to the baseline. */
export function formatMarkdown(groups, baselineStrategy) {
  const lines = [];
  for (const [groupKey, group] of groups) {
    lines.push(`### ${groupKey}  (frame ms, median; ratio vs \`${baselineStrategy}\`, lower is better)`, '');
    lines.push(`| strategy | ${OPS.join(' | ')} | burst fps |`);
    lines.push(`| --- | ${OPS.map(() => '---').join(' | ')} | --- |`);
    for (const [strategy, data] of group) {
      const cells = OPS.map((op) => `${fmt(data.ops[op]?.frameMs)}${fmtRatio(ratioFor(group, strategy, baselineStrategy, op))}`);
      lines.push(`| ${strategy} | ${cells.join(' | ')} | ${data.burstFps ?? '-'} |`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

/**
 * Gate syntax: `strategy/baseline:op:maxRatio`, e.g. `native-list/native-single-host-lazy:mount:1.15`
 * ("the recipe may be at most 15% slower than raw LazyColumn on mount"). Compared on frameMs.
 */
export function parseGate(text) {
  const match = /^([\w-]+)\/([\w-]+):([\w ]+):([\d.]+)$/.exec(text);
  if (!match) throw new Error(`Bad gate "${text}". Expected strategy/baseline:op:maxRatio`);
  return { strategy: match[1], baseline: match[2], op: match[3], max: Number(match[4]) };
}

/** @returns {string[]} one message per violated gate (empty = all good) */
export function checkGates(groups, gates) {
  const violations = [];
  for (const gate of gates) {
    for (const [groupKey, group] of groups) {
      const value = ratioFor(group, gate.strategy, gate.baseline, gate.op);
      if (value == null) continue;
      if (value > gate.max) {
        violations.push(`${groupKey}: ${gate.strategy} ${gate.op} is x${value.toFixed(2)} of ${gate.baseline} (limit x${gate.max})`);
      }
    }
  }
  return violations;
}

/** Release builds strip React's Profiler, so `renderMs` is always 0 there. A hint, not a guarantee. */
export function looksLikeReleaseBuild(results) {
  const withRender = results.filter((r) => typeof r.renderMs === 'number');
  return withRender.length > 0 && withRender.every((r) => r.renderMs === 0);
}
