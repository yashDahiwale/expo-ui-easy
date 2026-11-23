// Generates the component documentation from the manifest and the REAL TypeScript types:
//   content/docs/components/<category>/<slug>.mdx   one page per component (+ meta.json for the sidebar)
//   content/docs/components/index.mdx               overview
//   generated/props.json                            props tables, rendered by <PropsTable name="..." />
// Hand-written pages live in content/docs/*; curated examples in examples/<Name>.tsx are embedded when present.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(docsRoot, '..');
const packageRoot = join(repoRoot, 'packages', 'expo-ui-easy');
const manifest = JSON.parse(readFileSync(join(packageRoot, 'manifest', 'components.json'), 'utf8'));
const outDir = join(docsRoot, 'content', 'docs', 'components');

const CATEGORIES = [
  ['host', 'Host', 'The Compose root every Expo UI component lives in.'],
  ['buttons', 'Buttons', 'Filled, tonal, outlined, elevated and text buttons, icon buttons and floating action buttons.'],
  ['selection', 'Selection and toggles', 'Switches, checkboxes, radio buttons, toggle buttons, segmented buttons and chips.'],
  ['sliders', 'Sliders', 'Single, range and vertical sliders.'],
  ['text', 'Text and input', 'Text and the text-field family.'],
  ['progress', 'Progress and loading', 'Circular, linear and wavy progress indicators and loading indicators.'],
  ['pickers', 'Date and time pickers', 'Inline pickers and picker dialogs.'],
  ['layout', 'Layout and containers', 'Row, Column, Box, cards, list items, dividers and badges.'],
  ['media', 'Icons, images and animation', 'Icon, Image and AnimatedVisibility.'],
  ['scrollables', 'Lists and scrollables', 'Lazy lists, pagers, carousels, pull to refresh and the NativeList recipe.'],
  ['overlays', 'Dialogs, sheets and menus', 'Alert dialogs, bottom sheets, dropdown menus, snackbars and tooltips.'],
  ['bars', 'Bars and navigation', 'Top app bars, navigation bars, search bars and floating toolbars.'],
];
const categoryInfo = Object.fromEntries(CATEGORIES.map(([key, title, blurb]) => [key, { title, blurb }]));

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').toLowerCase();
const slug = (c) => kebab(c.name);
const pageUrl = (c) => `/docs/components/${c.category}/${slug(c)}`;

// ---------------------------------------------------------------------------------------------
// 1. Props from the real types
// ---------------------------------------------------------------------------------------------
const components = manifest.components;
mkdirSync(join(docsRoot, 'generated'), { recursive: true });
const probePath = join(docsRoot, 'generated', 'props-probe.ts');
const importPath = relative(dirname(probePath), join(packageRoot, 'src', 'android', 'index')).replaceAll('\\', '/');
writeFileSync(
  probePath,
  `import type { ComponentProps } from 'react';\nimport type * as L from '${importPath}';\n` +
    components.map((c) => `export type P_${c.name} = ComponentProps<typeof L.${c.name}>;`).join('\n') + '\n',
);

const reactTypes = join(repoRoot, 'node_modules', '@types', 'react');
const program = ts.createProgram([probePath], {
  jsx: ts.JsxEmit.ReactJSX,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  target: ts.ScriptTarget.ES2022,
  strict: true,
  exactOptionalPropertyTypes: true,
  skipLibCheck: true,
  noEmit: true,
  types: [],
  baseUrl: repoRoot,
  paths: { react: [reactTypes], 'react/*': [`${reactTypes}/*`] },
});
const checker = program.getTypeChecker();
const probe = program.getSourceFile(probePath);

const clean = (text) => text.replace(/\bL\./g, '').replace(/____ColorValue_Internal/g, 'ColorValue').replace(/\s+/g, ' ').trim();
const truncate = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);
const firstParagraph = (text) => truncate(clean(text.split(/\n\s*\n/)[0] ?? ''), 220);

const UNIVERSAL_RN = { onPress: 'onClick', disabled: 'enabled (inverted)' };
const TEXT_FIELD_RN = { placeholder: 'the TextField.Placeholder slot', secureTextEntry: 'visualTransformation="password"', multiline: 'singleLine (inverted)', editable: 'readOnly (inverted)' };
const LIBRARY_PROPS = new Set(['testID', 'accessibilityLabel', 'hostProps', 'startIcon', 'endIcon']);
const NATIVE_LIST_PROPS = new Set(['data', 'renderItem', 'keyExtractor', 'ListHeaderComponent', 'ListFooterComponent', 'ListEmptyComponent', 'ItemSeparatorComponent', 'onEndReached', 'onEndReachedThreshold', 'refreshing', 'onRefresh', 'refreshIndicator', 'style', 'hostProps', 'testID', 'accessibilityLabel']);

function classify(c, prop) {
  if (c.kind === 'host') return { origin: 'expo' };
  if (c.name === 'NativeList') return { origin: NATIVE_LIST_PROPS.has(prop) ? 'library' : 'expo' };
  if (prop in UNIVERSAL_RN) return { origin: 'rn', expoName: UNIVERSAL_RN[prop] };
  if (c.rename?.[prop]) return { origin: 'rn', expoName: c.rename[prop] };
  if ((c.name === 'TextField' || c.name === 'OutlinedTextField') && prop in TEXT_FIELD_RN) return { origin: 'rn', expoName: TEXT_FIELD_RN[prop] };
  if (LIBRARY_PROPS.has(prop)) return { origin: 'library' };
  if (prop === 'containerStyle') return { origin: 'library' };
  if (prop === 'style' && c.hostStyleProp !== 'containerStyle') return { origin: 'library' };
  return { origin: 'expo' };
}

// Descriptions for props whose Expo counterpart is documented under another name.
const ALIAS_DESCRIPTIONS = {
  onPress: 'Called when the user presses it.',
  disabled: 'Disables interaction.',
  onValueChange: 'Called with the new value.',
  onChangeText: 'Called with the new text.',
  numberOfLines: 'Maximum number of lines before the text is truncated.',
  placeholder: 'Placeholder text shown while the field is empty.',
  secureTextEntry: 'Hides the entered text.',
  multiline: 'Allow several lines (true) or force one (false). Unset keeps Expo\'s default.',
  editable: 'false makes the field read-only.',
  style: 'Layout style of the Host created around this component. Ignored inside a Host.',
  containerStyle: 'Layout style of the Host created around this component. Ignored inside a Host.',
};

const ORIGIN_ORDER = { rn: 0, library: 1, expo: 2 };
const propsByComponent = {};
for (const c of components) {
  const alias = probe.statements.find((s) => ts.isTypeAliasDeclaration(s) && s.name.text === `P_${c.name}`);
  const rows = [];
  if (alias) {
    const type = checker.getTypeAtLocation(alias.name);
    for (const prop of checker.getPropertiesOfType(type)) {
      const declaration = prop.valueDeclaration ?? prop.declarations?.[0] ?? alias;
      const propType = checker.getTypeOfSymbolAtLocation(prop, declaration);
      const text = checker.typeToString(propType, alias, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
      const def = prop.getJsDocTags(checker).find((t) => t.name === 'default');
      rows.push({
        name: prop.getName(),
        type: truncate(clean(text), 170),
        optional: (prop.flags & ts.SymbolFlags.Optional) !== 0,
        description: firstParagraph(ts.displayPartsToString(prop.getDocumentationComment(checker))) || (ALIAS_DESCRIPTIONS[prop.getName()] ?? ''),
        ...(def ? { defaultValue: clean(ts.displayPartsToString(def.text)) } : {}),
        ...classify(c, prop.getName()),
      });
    }
  }
  rows.sort((a, b) => Number(a.optional) - Number(b.optional) || ORIGIN_ORDER[a.origin] - ORIGIN_ORDER[b.origin] || a.name.localeCompare(b.name));
  propsByComponent[c.name] = rows;
}
writeFileSync(join(docsRoot, 'generated', 'props.json'), JSON.stringify(propsByComponent));

// ---------------------------------------------------------------------------------------------
// 2. Pages
// ---------------------------------------------------------------------------------------------
const RN_ALIAS_TEXT = {
  onPress: ['onPress', 'onClick', 'the press handler'],
  disabled: ['disabled', 'enabled', 'inverted'],
};

function intro(c) {
  const link = '[Expo UI Jetpack Compose docs](https://docs.expo.dev/versions/latest/sdk/ui/jetpack-compose/)';
  if (c.name === 'NativeList') return 'A FlatList-style list on **one** `Host` with Expo\'s recycling `LazyColumn`. This is a recipe built by expo-ui-easy, not an Expo UI export. See [NativeList](/docs/concepts/native-list) for how it works.';
  if (c.name === 'Host') return 'Expo UI\'s `Host`, plus one thing: it tells the components inside that a Compose root already exists, so they render as bare Compose nodes. See [The Host model](/docs/concepts/host).';
  if (c.name === 'RNHostView') return 'Embeds a React Native view inside a Compose tree. Components used inside it create their own `Host` again.';
  if (c.kind === 'custom' && category(c) === 'buttons') return `Expo UI's \`${c.name}\` with two additions: \`startIcon\` and \`endIcon\`, with Material 3 icon padding applied automatically. A plain string child becomes a Compose \`Text\`. Everything else is Expo's. See the ${link}.`;
  if (c.kind === 'custom') return `Expo UI's \`${c.name}\` with React Native names for the props both share (\`onChangeText\`, \`placeholder\`, \`secureTextEntry\`, \`multiline\`, \`editable\`). \`value\` is Expo's \`useNativeState\`. See the ${link}.`;
  return `Expo UI's \`${c.name}\`, wrapped so it works on its own (it creates a \`Host\` around itself) or inside your own \`Host\`, and accepts the React Native names for the props both worlds share. Expo's props, types and sub-components are unchanged. See the ${link}.`;
}
const category = (c) => c.category;

function hostSection(c) {
  const preset = c.hostPreset ? manifest.presets[c.hostPreset] : null;
  const lines = ['## Host sizing', ''];
  if (c.hostStyleProp === 'containerStyle') lines.push(`\`${c.name}\` has its own \`style\` prop (Expo's), so the layout style of the auto-created \`Host\` is \`containerStyle\`.`, '');
  if (preset) lines.push(`When used without a \`Host\` it uses the **${c.hostPreset}** host preset: ${preset} Override it with \`style\` / \`hostProps\`.`);
  else lines.push('When used without a `Host` it creates one that sizes to its content (`matchContents`). Inside your own `Host` it adds no extra view.');
  return lines.join('\n');
}

function namesSection(c, rows) {
  const renamed = rows.filter((r) => r.origin === 'rn');
  if (renamed.length === 0) return '';
  const body = renamed.map((r) => `| \`${r.name}\` | ${r.expoName ? `\`${r.expoName}\`` : ''} |`).join('\n');
  return `## Names\n\nReact Native names used here, and the Expo UI name they stand for:\n\n| You write | Expo UI |\n| --- | --- |\n${body}\n`;
}

function nativeViewSection(c) {
  if (!c.requiresViews || c.requiresViews.length === 0) return '';
  const since = c.since ? ` Added in \`@expo/ui\` ${c.since}.` : '';
  return `<Callout type="warn" title="Needs a development build">\nThis component needs the native view${c.requiresViews.length > 1 ? 's' : ''} ${c.requiresViews.map((v) => `\`${v}\``).join(', ')}.${since} Expo Go may not include ${c.requiresViews.length > 1 ? 'them' : 'it'}: check with \`isNativeViewAvailable('${c.requiresViews[0]}')\` or use a development build (\`npx expo run:android\`).\n</Callout>\n`;
}

function description(c, rows) {
  const info = categoryInfo[c.category];
  const rn = rows.filter((r) => r.origin === 'rn').map((r) => r.name);
  const extra = rn.length > 0 ? ` React Native names: ${rn.slice(0, 3).join(', ')}.` : '';
  const text = c.name === 'NativeList'
    ? 'NativeList: a FlatList-style list on one Compose Host with a recycling LazyColumn for React Native and Expo.'
    : `${c.name}: ${info.title.toLowerCase()} component for React Native and Expo, rendered by Jetpack Compose. Expo UI's props, strictly typed.${extra}`;
  return truncate(text, 200);
}

rmSync(outDir, { recursive: true, force: true });
for (const [key] of CATEGORIES) {
  const group = components.filter((c) => c.category === key);
  if (group.length === 0) continue;
  mkdirSync(join(outDir, key), { recursive: true });
  for (const c of group) {
    const rows = propsByComponent[c.name] ?? [];
    const examplePath = join(docsRoot, 'examples', `${c.name}.tsx`);
    const example = existsSync(examplePath)
      ? `## Example\n\n\`\`\`tsx title="${c.name}.tsx"\n${readFileSync(examplePath, 'utf8').trimEnd()}\n\`\`\`\n`
      : '';
    const sections = [
      `---\ntitle: ${c.name}\ndescription: ${JSON.stringify(description(c, rows))}\n---\n`,
      intro(c) + '\n',
      nativeViewSection(c),
      `## Import\n\n\`\`\`tsx\nimport { ${c.name} } from 'expo-ui-easy';\n\`\`\`\n`,
      example,
      `## Props\n\n<PropsTable name="${c.name}" />\n`,
      namesSection(c, rows),
      c.kind === 'host' ? '' : hostSection(c) + '\n',
    ].filter(Boolean);
    writeFileSync(join(outDir, key, `${slug(c)}.mdx`), sections.join('\n'));
  }
  writeFileSync(join(outDir, key, 'meta.json'), JSON.stringify({ title: categoryInfo[key].title, pages: group.map(slug) }, null, 2) + '\n');
}

const indexSections = CATEGORIES.map(([key, title, blurb]) => {
  const group = components.filter((c) => c.category === key);
  if (group.length === 0) return '';
  return `## ${title}\n\n${blurb}\n\n${group.map((c) => `- [\`${c.name}\`](${pageUrl(c)})`).join('\n')}\n`;
}).join('\n');
writeFileSync(
  join(outDir, 'index.mdx'),
  `---\ntitle: Components\ndescription: ${JSON.stringify(`All ${components.length} expo-ui-easy components for React Native, grouped by category, with generated props tables.`)}\n---\n\nEvery component keeps its Expo UI name. Each page shows the props generated from the real TypeScript types, which props use a React Native name, and how the component sizes its \`Host\`.\n\n${indexSections}\n## Re-exported unchanged\n\nThese come straight from Expo UI, so their props keep Expo's names: ${manifest.passthrough.map((n) => `\`${n}\``).join(', ')}. Expo's modifiers (\`background\`, \`paddingAll\`, \`fillMaxWidth\`, ...) are re-exported too.\n`,
);
writeFileSync(join(outDir, 'meta.json'), JSON.stringify({ title: 'Components', pages: ['index', ...CATEGORIES.filter(([k]) => components.some((c) => c.category === k)).map(([k]) => k)] }, null, 2) + '\n');

console.log(`docs: ${components.length} component pages, ${Object.values(propsByComponent).reduce((n, r) => n + r.length, 0)} props`);
