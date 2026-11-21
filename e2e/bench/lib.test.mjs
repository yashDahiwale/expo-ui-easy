import assert from 'node:assert/strict';
import { test } from 'node:test';
import { aggregate, checkGates, formatMarkdown, looksLikeReleaseBuild, median, parseGate, parseLog, ratio, ratioFor } from './lib.mjs';

const line = (o) => `I ReactNativeJS: '[stress]', '${JSON.stringify(o)}'`;
const r = (strategy, op, frameMs, extra = {}) => ({ id: 1, op, strategy, kind: 'switch', count: 1000, renderMs: 0, commitMs: frameMs / 2, frameMs, note: '', ...extra });

test('parseLog extracts [stress] JSON from logcat lines and ignores everything else', () => {
  const text = [line(r('rn-flatlist', 'mount', 100)), "I ReactNativeJS: 'something else'", "I ReactNativeJS: '[stress]', '{broken", line(r('native-list', 'mount', 50))].join('\n');
  const parsed = parseLog(text);
  assert.deepEqual(parsed.map((x) => x.strategy), ['rn-flatlist', 'native-list']);
});

test('median handles odd, even and empty input', () => {
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([1, 2, 3, 4]), 2.5);
  assert.equal(median([]), null);
});

test('aggregate takes the median of repeats and groups by kind@count and strategy', () => {
  const groups = aggregate([r('a', 'mount', 100), r('a', 'mount', 300), r('a', 'mount', 200), r('b', 'mount', 50)]);
  const group = groups.get('switch@1000');
  assert.equal(group.get('a').ops.mount.frameMs, 200);
  assert.equal(group.get('a').ops.mount.runs, 3);
  assert.equal(group.get('b').ops.mount.frameMs, 50);
});

test('aggregate ignores skipped runs and summarises bursts as fps', () => {
  const groups = aggregate([r('a', 'skipped', 0), r('a', 'burst 5s', 0, { commitMs: null, frameMs: null, note: '58 fps avg · p95 20ms' }), r('a', 'burst 5s', 0, { commitMs: null, frameMs: null, note: '52 fps avg · p95 25ms' })]);
  assert.equal(groups.get('switch@1000').get('a').burstFps, 55);
});

test('ratio is strategy over baseline (lower is better) and tolerates missing data', () => {
  assert.equal(ratio(50, 100), 0.5);
  assert.equal(ratio(null, 100), null);
  assert.equal(ratio(50, 0), null);
  const group = aggregate([r('base', 'mount', 200), r('fast', 'mount', 100)]).get('switch@1000');
  assert.equal(ratioFor(group, 'fast', 'base', 'mount'), 0.5);
  assert.equal(ratioFor(group, 'fast', 'base', 'flip all'), null);
});

test('formatMarkdown prints every strategy with its ratio', () => {
  const md = formatMarkdown(aggregate([r('base', 'mount', 200), r('fast', 'mount', 100)]), 'base');
  assert.match(md, /### switch@1000/);
  assert.match(md, /\| fast \| 100 \(x0\.50\)/);
  assert.match(md, /\| base \| 200 \(x1\.00\)/);
});

test('gates: parse, pass and fail', () => {
  assert.deepEqual(parseGate('native-list/native-single-host-lazy:mount:1.15'), { strategy: 'native-list', baseline: 'native-single-host-lazy', op: 'mount', max: 1.15 });
  assert.throws(() => parseGate('nonsense'));
  const groups = aggregate([r('native-single-host-lazy', 'mount', 100), r('native-list', 'mount', 110), r('native-single-host-lazy', 'flip all', 100), r('native-list', 'flip all', 150)]);
  assert.deepEqual(checkGates(groups, [parseGate('native-list/native-single-host-lazy:mount:1.15')]), []);
  const violations = checkGates(groups, [parseGate('native-list/native-single-host-lazy:flip all:1.15')]);
  assert.equal(violations.length, 1);
  assert.match(violations[0], /switch@1000: native-list flip all is x1\.50/);
});

test('looksLikeReleaseBuild: React Profiler time is 0 in release builds', () => {
  assert.equal(looksLikeReleaseBuild([r('a', 'mount', 10, { renderMs: 0 })]), true);
  assert.equal(looksLikeReleaseBuild([r('a', 'mount', 10, { renderMs: 12.5 })]), false);
  assert.equal(looksLikeReleaseBuild([]), false);
});
