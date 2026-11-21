// Checks what `npm publish` would ship: every entry point in package.json exists in the tarball, the platform
// entries are there, and nothing that should stay private (tests, manifest, scripts) leaks in.
// Run after `npm run build`.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const packed = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd: root, encoding: 'utf8' }))[0];
const files = new Set(packed.files.map((f) => f.path));
const problems = [];

const targets = new Set([pkg.main, pkg.types]);
for (const entry of Object.values(pkg.exports ?? {})) {
  if (typeof entry === 'string') targets.add(entry);
  else for (const [condition, path] of Object.entries(entry)) if (condition !== 'source') targets.add(path);
}
for (const target of targets) {
  const path = target.replace(/^\.\//, '');
  if (!files.has(path)) problems.push(`package.json points at ${path}, which is not in the tarball`);
}
for (const required of ['README.md', 'LICENSE', 'lib/module/index.android.js', 'lib/module/index.ios.js', 'lib/typescript/src/index.android.d.ts']) {
  if (!files.has(required)) problems.push(`missing from tarball: ${required}`);
}
for (const path of files) {
  if (/^(test|manifest|scripts)\//.test(path) || path.endsWith('.test.ts') || path.includes('__tests__')) problems.push(`should not be published: ${path}`);
}
const kb = packed.size / 1024;
if (kb > 600) problems.push(`package is ${kb.toFixed(0)} kB (limit 600 kB): did something large get included?`);

if (problems.length > 0) {
  console.error(`verify-package FAILED:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`verify-package OK: ${files.size} files, ${kb.toFixed(1)} kB packed`);
