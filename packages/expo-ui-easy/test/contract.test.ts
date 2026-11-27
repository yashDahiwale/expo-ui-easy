import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { expoNativeViewNames, installedExpoUiVersion, resolveTypes, valueExports } from './helpers/exports';

interface Entry {
  name: string;
  category: string;
  kind: 'wrapped' | 'variants' | 'custom' | 'host';
  file?: string;
  /** Several Expo components published as ONE of ours, chosen by the `prop` prop (`variant`, `size`). */
  variants?: { prop: string; default: string; map: Record<string, string>; staticsFrom?: string };
  requiresViews?: string[];
  hostPreset?: string;
  /** `library`: ours, not an Expo UI export (recipes like NativeList). Default `expo`. */
  origin?: 'expo' | 'library';
}
interface Manifest {
  expoUiVersion: string;
  presets: Record<string, string>;
  components: Entry[];
  passthrough: string[];
  ignored: Record<string, string>;
  extras: string[];
}

const root = process.cwd();
const manifest = JSON.parse(readFileSync(join(root, 'manifest/components.json'), 'utf8')) as Manifest;

// Expo exports that one of our components absorbs as a variant (OutlinedButton -> <Button variant="outlined">).
const variantNatives = (c: Entry): string[] => Object.values(c.variants?.map ?? {});
const absorbed = manifest.components.flatMap(variantNatives).filter((n) => !manifest.components.some((c) => c.name === n));

const byKind = (kind: Entry['kind']) => manifest.components.filter((c) => c.kind === kind).map((c) => c.name);
const expoExports = valueExports(resolveTypes('@expo/ui/jetpack-compose'));
const expoModifiers = valueExports(resolveTypes('@expo/ui/jetpack-compose/modifiers'));
const ourExports = valueExports(join(root, 'src/android/index.ts'));

describe('manifest', () => {
  it('has unique names, valid kinds and known presets', () => {
    const names = manifest.components.map((c) => c.name);
    expect(names.length).toBe(new Set(names).size);
    for (const c of manifest.components) {
      expect(['wrapped', 'variants', 'custom', 'host']).toContain(c.kind);
      if (c.hostPreset !== undefined) expect(Object.keys(manifest.presets)).toContain(c.hostPreset);
    }
  });

  it('was written for the same @expo/ui major.minor that is installed', () => {
    const [major, minor] = installedExpoUiVersion().split('.');
    const [wantMajor, wantMinor] = manifest.expoUiVersion.split('.');
    expect(`${major}.${minor}`).toBe(`${wantMajor}.${wantMinor}`);
  });

  it('points custom and host entries at files that exist', () => {
    for (const c of manifest.components.filter((x) => x.kind === 'custom' || x.kind === 'host')) {
      expect(c.file, `${c.name} needs a file`).toBeDefined();
      expect(existsSync(join(root, c.file ?? '')), `${c.file} missing`).toBe(true);
    }
  });
});

describe('variant families', () => {
  const families = manifest.components.filter((c) => c.variants !== undefined);

  it('describe a map that contains their default and their own Expo component', () => {
    expect(families.length).toBeGreaterThan(0);
    for (const c of families) {
      const v = c.variants!;
      expect(Object.keys(v.map), `${c.name}: default "${v.default}" is not a variant`).toContain(v.default);
      expect(Object.values(v.map), `${c.name} should map one variant to its own Expo component`).toContain(c.name);
      expect(v.prop).toMatch(/^[a-z]+$/);
    }
  });

  it('only absorb Expo components that really exist, each by exactly one family', () => {
    const natives = families.flatMap(variantNatives);
    expect(natives.length).toBe(new Set(natives).size);
    for (const native of [...natives, ...families.flatMap((c) => (c.variants?.staticsFrom ? [c.variants.staticsFrom] : []))]) {
      expect(expoExports, `${native} is not exported by @expo/ui`).toContain(native);
    }
  });

  it('never also publish an absorbed Expo component under its own name', () => {
    for (const name of absorbed) expect(ourExports, `${name} should only be reachable through its variant family`).not.toContain(name);
  });
});

describe('contract with @expo/ui', () => {
  const accounted = new Set([
    ...manifest.components.map((c) => c.name),
    ...absorbed,
    ...manifest.passthrough,
    ...Object.keys(manifest.ignored),
  ]);

  it('knows every export of @expo/ui/jetpack-compose (a new one means: add it to the manifest)', () => {
    const unknown = expoExports.filter((name) => !accounted.has(name));
    expect(unknown, `New Expo UI exports not in manifest/components.json: ${unknown.join(', ')}`).toEqual([]);
  });

  it('only lists things Expo still exports (a missing one was removed or renamed upstream)', () => {
    const ours = new Set(manifest.components.filter((c) => c.origin === 'library').map((c) => c.name));
    const missing = [...accounted].filter((name) => !ours.has(name) && !expoExports.includes(name));
    expect(missing, `In the manifest but no longer exported by Expo UI: ${missing.join(', ')}`).toEqual([]);
  });

  it('only requires native views that exist in this @expo/ui version', () => {
    const views = expoNativeViewNames();
    for (const c of manifest.components) {
      for (const view of c.requiresViews ?? []) {
        expect(views.has(view), `${c.name} requires ${view}, which @expo/ui does not register`).toBe(true);
      }
    }
  });
});

describe('contract with our public API', () => {
  it('exports exactly the manifest (plus extras and Expo modifiers)', () => {
    const expected = new Set([
      ...byKind('wrapped'),
      ...byKind('variants'),
      ...byKind('custom'),
      ...byKind('host'),
      ...manifest.passthrough,
      ...manifest.extras,
      ...expoModifiers,
    ]);
    const ours = new Set(ourExports);
    expect([...expected].filter((n) => !ours.has(n)), 'declared but not exported').toEqual([]);
    expect([...ours].filter((n) => !expected.has(n)), 'exported but not in the manifest').toEqual([]);
  });

  it('keeps the generated files in sync with the manifest', () => {
    expect(() =>
      execFileSync('node', ['scripts/generate-components.mjs', '--check'], { cwd: root, stdio: 'pipe' }),
    ).not.toThrow();
  });
});

describe('example app coverage', () => {
  const registry = readFileSync(join(root, '../../example/src/registry.ts'), 'utf8');
  const kebab = (name: string) =>
    name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').toLowerCase();
  const registered = new Set([...registry.matchAll(/component\('(\w+)'/g)].map((m) => m[1]));
  const ours = manifest.components.filter((c) => c.origin !== 'library' || c.name === 'NativeList').map((c) => c.name);

  it('has a direct route for every public component', () => {
    const missing = ours.filter((name) => !registered.has(name));
    expect(missing, `Add these to example/src/registry.ts: ${missing.join(', ')}`).toEqual([]);
  });

  it('lists nothing that is not public', () => {
    const extra = [...registered].filter((name) => !ours.includes(name as string));
    expect(extra, `In the example registry but not in the manifest: ${extra.join(', ')}`).toEqual([]);
  });

  it('keeps slugs unique', () => {
    const slugs = [...registered].map((n) => kebab(n as string));
    expect(slugs.length).toBe(new Set(slugs).size);
  });
});
