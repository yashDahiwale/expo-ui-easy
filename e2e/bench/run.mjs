#!/usr/bin/env node
// Benchmark runner for the stress test.
//
//   node e2e/bench/run.mjs --log capture.txt                       report from a saved `adb logcat` capture
//   node e2e/bench/run.mjs --adb --flow e2e/flows/bench.yaml       capture logcat while Maestro drives the app
//   node e2e/bench/run.mjs --adb                                   capture logcat until you stop pressing buttons
//
// Options: --baseline <strategy> (default rn-flatlist)  --gate A/B:op:max (repeatable)
//          --json out.json  --md out.md  --timeout <seconds> (default 900)  --idle <seconds> (default 30)
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { aggregate, checkGates, formatMarkdown, looksLikeReleaseBuild, parseGate, parseLog } from './lib.mjs';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};
const values = (name) => args.flatMap((a, i) => (a === `--${name}` && args[i + 1] ? [args[i + 1]] : []));

const baseline = value('baseline', 'rn-flatlist');
const gates = values('gate').map(parseGate);

async function captureLogcat() {
  const timeoutMs = Number(value('timeout', '900')) * 1000;
  const idleMs = Number(value('idle', '30')) * 1000;
  const flow = value('flow');
  const serial = value('serial');
  const adb = (extra) => ['adb', ...(serial ? ['-s', serial] : []), ...extra];

  await new Promise((resolve) => spawn(...splitCmd(adb(['logcat', '-c'])), { stdio: 'ignore' }).on('close', resolve));
  const [cmd, cmdArgs] = splitCmd(adb(['logcat', '-v', 'raw', '-s', 'ReactNativeJS:V']));
  const logcat = spawn(cmd, cmdArgs);
  let text = '';
  let lastStress = Date.now();
  logcat.stdout.on('data', (chunk) => {
    const part = chunk.toString();
    text += part;
    if (part.includes('[stress]')) lastStress = Date.now();
  });

  if (flow) {
    console.error(`running Maestro flow ${flow} ...`);
    await new Promise((resolve) => spawn('maestro', ['test', flow], { stdio: 'inherit' }).on('close', resolve));
    await new Promise((r) => setTimeout(r, 2000)); // let the last log lines flush
  } else {
    console.error('capturing; start tests in the app. Stops after the idle window or the timeout.');
    const started = Date.now();
    await new Promise((resolve) => {
      const timer = setInterval(() => {
        const sawAny = text.includes('[stress]');
        if (Date.now() - started > timeoutMs || (sawAny && Date.now() - lastStress > idleMs)) {
          clearInterval(timer);
          resolve();
        }
      }, 1000);
    });
  }
  logcat.kill();
  return text;
}

function splitCmd(parts) {
  return [parts[0], parts.slice(1)];
}

const text = flag('adb') ? await captureLogcat() : readFileSync(value('log') ?? (console.error('Pass --log <file> or --adb'), process.exit(2)), 'utf8');
const results = parseLog(text);
if (results.length === 0) {
  console.error('No [stress] results found.');
  process.exit(2);
}
const groups = aggregate(results);
const markdown = formatMarkdown(groups, baseline);
const note = looksLikeReleaseBuild(results) ? 'Release build detected (React Profiler time is 0).' : 'Dev build detected: compare against a release build before trusting absolute numbers.';
console.log(`${markdown}\n_${note}_\n`);
if (value('md')) writeFileSync(value('md'), `${markdown}\n_${note}_\n`);
if (value('json')) writeFileSync(value('json'), JSON.stringify({ baseline, results }, null, 2));

const violations = checkGates(groups, gates);
if (violations.length > 0) {
  console.error(`GATE FAILED:\n- ${violations.join('\n- ')}`);
  process.exit(1);
}
