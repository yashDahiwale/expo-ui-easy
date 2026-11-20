import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);

const OPTIONS: ts.CompilerOptions = {
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  target: ts.ScriptTarget.ES2022,
  skipLibCheck: true,
  strict: true,
  noEmit: true,
  types: [],
};

/** Absolute path of the declaration file a module specifier resolves to, as TypeScript sees it. */
export function resolveTypes(specifier: string): string {
  const containing = join(process.cwd(), 'test', '__probe.ts');
  const resolved = ts.resolveModuleName(specifier, containing, OPTIONS, ts.sys).resolvedModule;
  if (!resolved) throw new Error(`Cannot resolve ${specifier}`);
  return resolved.resolvedFileName;
}

/** Names of the runtime values (not types) exported by a TypeScript entry file. */
export function valueExports(entryFile: string): string[] {
  const program = ts.createProgram([entryFile], OPTIONS);
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(entryFile);
  const moduleSymbol = source ? checker.getSymbolAtLocation(source) : undefined;
  if (!moduleSymbol) throw new Error(`No module symbol for ${entryFile}`);
  return checker
    .getExportsOfModule(moduleSymbol)
    .filter((symbol) => {
      const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
      return (target.flags & ts.SymbolFlags.Value) !== 0;
    })
    .map((symbol) => symbol.name)
    .sort();
}

/** Every native view name Expo UI's Android JS asks for (`requireNativeView('ExpoUI', 'XView')`). */
export function expoNativeViewNames(): Set<string> {
  const packageJson = require.resolve('@expo/ui/package.json');
  const base = join(packageJson, '..', 'build', 'jetpack-compose');
  const names = new Set<string>();
  const visit = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) visit(full);
      else if (entry.endsWith('.js')) {
        for (const match of readFileSync(full, 'utf8').matchAll(/requireNativeView\(\s*['"]ExpoUI['"]\s*,\s*['"](\w+)['"]/g)) {
          if (match[1] !== undefined) names.add(match[1]);
        }
      }
    }
  };
  visit(base);
  return names;
}

export function installedExpoUiVersion(): string {
  return (require('@expo/ui/package.json') as { version: string }).version;
}
