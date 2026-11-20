# expo-ui-easy (Android / Jetpack Compose)

Expo UI's Jetpack Compose components, usable like normal React Native components.

**Rule: Expo UI is the source of truth.** Component names, prop names, prop types and sub-components
(`Switch.ThumbContent`, `Slider.Thumb`, `AlertDialog.Title`, ...) are exactly Expo's. The only renames are for
props that React Native already has under another name:

| You write (RN name) | Expo UI prop | Where |
| --- | --- | --- |
| `onPress` | `onClick` | buttons, chips, FABs, `RadioButton`, `Surface`, nav items, menu items, ... |
| `disabled` | `enabled` (inverted) | everything that has `enabled` |
| `onValueChange` | `onCheckedChange` | `Switch`, `Checkbox`, `ToggleButton` family, `SegmentedButton`, `Surface` |
| `numberOfLines` | `maxLines` | `Text` |
| `onChangeText` | `onValueChange` | `TextField`, `OutlinedTextField`, `BasicTextField` |
| `placeholder`, `secureTextEntry`, `multiline`, `editable` | `TextField.Placeholder` slot, `visualTransformation='password'`, `singleLine` (inverted), `readOnly` (inverted) | `TextField`, `OutlinedTextField` |
| `style` | layout style of the auto-created `Host` | everything (`containerStyle` on `Text`, whose own `style` is Expo's `TextStyle`) |
| `testID`, `accessibilityLabel` | `testID` / `semantics` modifiers | everything |

Everything else is Expo's: `colors`, `modifiers`, `shape`, `contentPadding`, `min` / `max` / `steps`, `progress`,
`strokeCap`, `amplitude`, ... Because the public types are derived from Expo's own prop types, new Expo props
show up here automatically. An explicit Expo prop always wins over an RN alias (e.g. `singleLine` over `multiline`).

## Components

Everything is imported from one place and keeps Expo's name. Slots are Expo's own statics, e.g.
`AlertDialog.Title`, `ListItem.HeadlineContent`, `TextField.Label`, `FilterChip.Label`.

- **Buttons**: `Button`, `FilledTonalButton`, `OutlinedButton`, `ElevatedButton`, `TextButton`, with extra
  `startIcon` / `endIcon` (see Icons below); icon buttons `IconButton`, `FilledIconButton`,
  `FilledTonalIconButton`, `OutlinedIconButton`; `FloatingActionButton` (+ `Small`, `Large`, `Extended`),
  `SplitButtonLayout`.
- **Selection**: `Switch`, `Checkbox`, `TriStateCheckbox`, `RadioButton`, `ToggleButton`, `IconToggleButton`,
  `FilledIconToggleButton`, `OutlinedIconToggleButton`, `SegmentedButton` + `SingleChoiceSegmentedButtonRow` /
  `MultiChoiceSegmentedButtonRow`, chips (`AssistChip`, `FilterChip`, `InputChip`, `SuggestionChip`), `SyncSwitch`.
- **Sliders**: `Slider`, `RangeSlider`, `VerticalSlider`.
- **Text**: `Text`, `TextField`, `OutlinedTextField`, `BasicTextField`.
- **Progress**: `CircularProgressIndicator`, `LinearProgressIndicator`, `CircularWavyProgressIndicator`,
  `LinearWavyProgressIndicator`, `LoadingIndicator`, `ContainedLoadingIndicator`.
- **Layout and containers**: `Row`, `Column`, `Box`, `FlowRow`, `Spacer`, `Surface`, `Card`, `ElevatedCard`,
  `OutlinedCard`, `ListItem`, `HorizontalDivider`, `VerticalDivider`, `Badge`, `BadgedBox`, `Icon`, `Image`,
  `AnimatedVisibility`.
- **Scrollables**: `LazyColumn`, `LazyRow`, `HorizontalPager`, three carousels, `PullToRefreshBox`. They fill
  their parent by default instead of matching contents (a scrollable needs a bounded size).
- **Overlays**: `AlertDialog`, `BasicAlertDialog`, `ModalBottomSheet`, `DropdownMenu` (+ item components),
  `ExposedDropdownMenuBox`, `Snackbar`, `SnackbarHost`, `TooltipBox`, `DatePickerDialog`,
  `DateRangePickerDialog`, `TimePickerDialog`, `DateTimePicker`, `DateRangePicker`.
- **Bars**: `TopAppBar`, `NavigationBar` / `NavigationBarItem`, `SearchBar`, `DockedSearchBar`,
  `HorizontalFloatingToolbar`.
- **Not wrapped** (re-exported exactly as Expo ships them): hooks and factories (`useNativeState`,
  `useMaterialColors`, `Shape`, `EnterTransition`, ...) and slot parts (`SplitButtonLeadingButton`,
  `SwitchThumbContent`, ...), so their props keep Expo's names (`onClick`, `onCheckedChange`).

## Host

`Host` is Expo's `Host`, plus it tells the components inside that a Compose root already exists. Put one around a
screen or section. A component used outside any `Host` creates its own (`matchContents`), which is convenient but
costs one Compose root per component. In development a warning fires at 25 of them.

## NativeList

A FlatList-style list on ONE Host with Expo's recycling `LazyColumn` (the setup that measured about twice as fast as
a Host per row):

```tsx
<NativeList
  data={rows}
  renderItem={({ item }) => <ListItem><ListItem.HeadlineContent><Text>{item.title}</Text></ListItem.HeadlineContent></ListItem>}
  keyExtractor={(item) => String(item.id)}      // default: item.key, then item.id, then the index
  ListHeaderComponent={<Text>Header</Text>}     // Compose elements, not React Native views
  ListEmptyComponent={<Text>Nothing here</Text>}
  ItemSeparatorComponent={<HorizontalDivider />}
  onEndReached={loadMore}                       // fires once per data length
  refreshing={refreshing}
  onRefresh={refresh}                           // enables pull to refresh
/>
```

Differences from FlatList: `onEndReachedThreshold` counts **rows** (default 4), not viewport lengths; `renderItem`
and the header / footer / separator parts must be Compose elements; there is no `horizontal` yet. `onEndReached` is
detected from which rows are mounted, so it needs `recycling` (the default). Expo's `contentPadding`,
`verticalArrangement`, `horizontalAlignment`, `modifiers`, `overscanCount` and `estimatedItemSize` pass through.

## Finding accidental Hosts

Every component used outside a `Host` creates its own. In development, `<HostDebugOverlay />` (put it at the app
root) shows how many exist and which components made them, `useHostStats()` / `getHostStats()` give the same numbers,
and a console warning names the top offenders once there are 25. All of it is a no-op in production.

## Icons in buttons

`startIcon` / `endIcon` take any Compose element. Three sources work:

| Source | Example | Inherits the button's color (incl. disabled) |
| --- | --- | --- |
| Material Symbols via Expo UI's universal `Icon` (recommended) | `<Icon name={AddIcon} size={18} />` with `import AddIcon from '@expo/material-symbols/add.xml'` and `import { Icon } from '@expo/ui'` | yes |
| Expo UI's Compose `Icon` | `<Icon source={require('./x.xml')} size={18} />` from `@expo/ui/jetpack-compose` | yes |
| `@expo/vector-icons` (React Native side) | `<RNHostView matchContents><Ionicons name="add" size={18} color="#fff" /></RNHostView>` | no, pass `color` yourself |

Vector icons are React Native views embedded into Compose, so each costs an extra RN view; prefer Material Symbols in
lists. With an icon present the Material3 icon padding is applied unless you pass your own `contentPadding`.

## Notes and limits

- **Hot loops.** Every wrapped component adds a small per-node cost (a context read, a prop translation). For
  thousands of rows inside one `Host`, import `Row` / `Column` / `Box` straight from `@expo/ui/jetpack-compose`, as
  the stress test does; the props are identical.
- **Verified**: type-checks under strict settings, compile-time tests for the renamed props, unit tests for the prop
  translation. Playground demos exist for everything above except `ExposedDropdownMenuBox`, `TooltipBox`,
  `SearchBar`, `HorizontalFloatingToolbar`, `VerticalSlider`, `SyncSwitch` and `DateRangePicker`; those are wrapped
  but not exercised yet.
- **Not verified on a device**: whether Expo's parents (menus, rows, bars) accept the wrapper components as children
  everywhere. If one misbehaves, import that one component from `@expo/ui/jetpack-compose` and tell me.

## Adding or changing a component

Components are declared in `manifest/components.json` (name, category, renames, host preset, required native views).
`src/android/components/generated.ts` is generated from it:

```bash
# edit manifest/components.json, then
npm run generate
```

Hand-written components (`kind: "custom"`: the buttons, the text fields) stay in `src/android/components`.

## Checks

`npm run typecheck` includes compile-time tests: wrong or Expo-only names (`onClick`, `enabled`, `maxLines`, ...) must
fail to compile, and generated checks confirm the manifest still matches Expo's prop types. `npm test` covers the prop
translation and the **contract tests**: a new, removed or renamed `@expo/ui` export, an unknown native view, or a stale
generated file fails the run.
