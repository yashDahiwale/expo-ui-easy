import type { ComponentType } from 'react';

export type CategoryKey =
  | 'buttons'
  | 'text'
  | 'selection'
  | 'sliders'
  | 'progress'
  | 'layout'
  | 'media'
  | 'scrollables'
  | 'overlays'
  | 'bars'
  | 'pickers'
  | 'host';

export interface Category {
  key: CategoryKey;
  title: string;
}

/** Order of the sections in the component index. */
export const CATEGORIES: readonly Category[] = [
  { key: 'buttons', title: 'Buttons' },
  { key: 'text', title: 'Text and input' },
  { key: 'selection', title: 'Selection and toggles' },
  { key: 'sliders', title: 'Sliders' },
  { key: 'progress', title: 'Progress and loading' },
  { key: 'layout', title: 'Layout and containers' },
  { key: 'media', title: 'Icons, images and animation' },
  { key: 'scrollables', title: 'Lists and scrollables' },
  { key: 'overlays', title: 'Dialogs, sheets and menus' },
  { key: 'bars', title: 'Bars and navigation' },
  { key: 'pickers', title: 'Date and time pickers' },
  { key: 'host', title: 'Host' },
];

export interface ComponentEntry {
  /** The public export name, exactly as imported from `expo-ui-easy`. */
  name: string;
  /** URL segment: `/component/<slug>`. */
  slug: string;
  category: CategoryKey;
  summary: string;
  /** Native Expo UI view names the demo needs; the index flags the row when the running app lacks them. */
  requires?: readonly string[];
  /** Set when this component is shown through its parent's demo (slot children, rows, items). */
  partOf?: string;
  /** Screens that manage their own scrolling (full-height lists) opt out of the page ScrollView. */
  scroll: boolean;
  /** Path of the demo file, relative to the repository root, for the "View source" link. */
  source: string;
  /**
   * Loaded lazily so the index never imports the Android-only library (it throws at import time
   * on iOS and web).
   */
  load: () => ComponentType;
}

export interface Tool {
  slug: string;
  title: string;
  summary: string;
}

/** Non-component screens. */
export const TOOLS: readonly Tool[] = [
  {
    slug: 'stress',
    title: 'Stress test',
    summary: 'Mount hundreds to 10,000 controls, flip them all, burst-update, and compare Native vs React Native strategies.',
  },
];

interface DemoRef {
  source: string;
  load: () => ComponentType;
}

/** Binds a demo module so entries can name demos by their export, checked at compile time. */
function demos<M extends object>(file: string, loadModule: () => M) {
  return (name: keyof M & string): DemoRef => ({
    source: `example/src/demos/${file}.tsx`,
    load: () => loadModule()[name] as ComponentType,
  });
}

const buttons = demos('buttons', () => require('./demos/buttons') as typeof import('./demos/buttons'));
const text = demos('text', () => require('./demos/text') as typeof import('./demos/text'));
const selection = demos('selection', () => require('./demos/selection') as typeof import('./demos/selection'));
const chips = demos('chips', () => require('./demos/chips') as typeof import('./demos/chips'));
const sliders = demos('sliders', () => require('./demos/sliders') as typeof import('./demos/sliders'));
const progress = demos('progress', () => require('./demos/progress') as typeof import('./demos/progress'));
const layout = demos('layout', () => require('./demos/layout') as typeof import('./demos/layout'));
const media = demos('media', () => require('./demos/media') as typeof import('./demos/media'));
const scrollables = demos('scrollables', () => require('./demos/scrollables') as typeof import('./demos/scrollables'));
const nativeList = demos('native-list', () => require('./demos/native-list') as typeof import('./demos/native-list'));
const overlays = demos('overlays', () => require('./demos/overlays') as typeof import('./demos/overlays'));
const menus = demos('menus', () => require('./demos/menus') as typeof import('./demos/menus'));
const bars = demos('bars', () => require('./demos/bars') as typeof import('./demos/bars'));
const pickers = demos('pickers', () => require('./demos/pickers') as typeof import('./demos/pickers'));
const host = demos('host', () => require('./demos/host') as typeof import('./demos/host'));

export const kebab = (name: string): string =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

interface Options {
  requires?: readonly string[];
  partOf?: string;
  scroll?: boolean;
}

function component(name: string, category: CategoryKey, summary: string, demo: DemoRef, options: Options = {}): ComponentEntry {
  return {
    name,
    slug: kebab(name),
    category,
    summary,
    scroll: options.scroll ?? true,
    source: demo.source,
    load: demo.load,
    ...(options.requires !== undefined ? { requires: options.requires } : null),
    ...(options.partOf !== undefined ? { partOf: options.partOf } : null),
  };
}

/** Every public component of `expo-ui-easy`, one row each. A test keeps this in step with the package manifest. */
export const COMPONENTS: readonly ComponentEntry[] = [
  // --- buttons
  component('Button', 'buttons', 'One button, five variants: filled, tonal, outlined, elevated and text. Optional start and end icons.', buttons('ButtonDemo')),
  component('IconButton', 'buttons', 'An icon-only button: standard, filled, tonal or outlined.', buttons('IconButtonDemo')),
  component('FloatingActionButton', 'buttons', 'A floating action button in four sizes, including the extended one with a label.', buttons('FloatingActionButtonDemo')),
  component('SplitButtonLayout', 'buttons', 'A primary action with an attached trailing toggle, as in a split button.', buttons('SplitButtonLayoutDemo'), {
    requires: ['SplitButtonLayoutView', 'SplitButtonLeadingButtonView', 'SplitButtonTrailingButtonView'],
  }),

  // --- text
  component('Text', 'text', 'Native text with Material3 type roles, Expo text styles, truncation and nested spans.', text('TextDemo')),
  component('TextField', 'text', 'A filled or outlined text field with React Native input names, slots and an imperative ref.', text('TextFieldDemo')),
  component('BasicTextField', 'text', 'The undecorated text field: you supply the look through a decoration box.', text('BasicTextFieldDemo')),

  // --- selection
  component('Switch', 'selection', 'An on/off switch with Material3 colors and thumb content.', selection('SwitchDemo')),
  component('Checkbox', 'selection', 'A checkbox with custom colors.', selection('CheckboxDemo')),
  component('TriStateCheckbox', 'selection', 'A checkbox with an indeterminate state, for parent selections.', selection('TriStateCheckboxDemo')),
  component('RadioButton', 'selection', 'A single-choice radio button.', selection('RadioButtonDemo')),
  component('ToggleButton', 'selection', 'A toggleable text button.', selection('ToggleButtonDemo')),
  component('IconToggleButton', 'selection', 'A toggleable icon button: standard, filled or outlined.', selection('IconToggleButtonDemo')),
  component('SegmentedButton', 'selection', 'Connected buttons for single or multiple choice.', selection('SegmentedButtonDemo')),
  component('SingleChoiceSegmentedButtonRow', 'selection', 'The row that groups segments into a single-choice set.', selection('SegmentedButtonDemo'), { partOf: 'SegmentedButton' }),
  component('MultiChoiceSegmentedButtonRow', 'selection', 'The row that groups segments into a multi-choice set.', selection('SegmentedButtonDemo'), { partOf: 'SegmentedButton' }),
  component('SyncSwitch', 'selection', 'A switch whose state lives natively and toggles without a JS round trip.', selection('SyncSwitchDemo'), { requires: ['SyncSwitchView'] }),
  component('AssistChip', 'selection', 'A chip that starts a smart or automated action.', chips('AssistChipDemo')),
  component('FilterChip', 'selection', 'A selectable chip that filters content.', chips('FilterChipDemo')),
  component('InputChip', 'selection', 'A chip that represents a user-entered value.', chips('InputChipDemo')),
  component('SuggestionChip', 'selection', 'A chip that suggests a next step.', chips('SuggestionChipDemo')),

  // --- sliders
  component('Slider', 'sliders', 'A continuous or stepped slider with limits, colors and custom thumb and track.', sliders('SliderDemo')),
  component('RangeSlider', 'sliders', 'A slider with two thumbs for choosing a range.', sliders('RangeSliderDemo'), { requires: ['RangeSliderView'] }),
  component('VerticalSlider', 'sliders', 'A slider that runs top to bottom.', sliders('VerticalSliderDemo'), { requires: ['VerticalSliderView'] }),

  // --- progress
  component('CircularProgressIndicator', 'progress', 'Determinate and indeterminate circular progress.', progress('CircularProgressIndicatorDemo')),
  component('LinearProgressIndicator', 'progress', 'Determinate and indeterminate linear progress.', progress('LinearProgressIndicatorDemo')),
  component('CircularWavyProgressIndicator', 'progress', 'Material3 Expressive wavy circular progress.', progress('CircularWavyProgressIndicatorDemo')),
  component('LinearWavyProgressIndicator', 'progress', 'Material3 Expressive wavy linear progress.', progress('LinearWavyProgressIndicatorDemo')),
  component('LoadingIndicator', 'progress', 'A morphing-shape loader, plain or inside a container.', progress('LoadingIndicatorDemo')),

  // --- layout
  component('Row', 'layout', 'Lays children out horizontally.', layout('RowDemo')),
  component('Column', 'layout', 'Lays children out vertically.', layout('ColumnDemo')),
  component('Box', 'layout', 'Stacks children and aligns them inside the box.', layout('BoxDemo')),
  component('FlowRow', 'layout', 'A row that wraps onto new lines.', layout('FlowRowDemo')),
  component('Spacer', 'layout', 'Empty space, or flexible space with a weight.', layout('SpacerDemo')),
  component('Surface', 'layout', 'A colored, optionally pressable or selectable container.', layout('SurfaceDemo')),
  component('Card', 'layout', 'A container in three variants: filled, elevated and outlined.', layout('CardDemo')),
  component('ListItem', 'layout', 'A list row with headline, supporting text and leading and trailing content.', layout('ListItemDemo')),
  component('HorizontalDivider', 'layout', 'A thin horizontal line.', layout('HorizontalDividerDemo')),
  component('VerticalDivider', 'layout', 'A thin vertical line.', layout('VerticalDividerDemo')),
  component('Badge', 'layout', 'A small status or count marker.', layout('BadgeDemo')),
  component('BadgedBox', 'layout', 'Anchors a badge to the corner of other content.', layout('BadgedBoxDemo')),

  // --- media
  component('Icon', 'media', 'A vector icon from an XML drawable or a Material Symbol.', media('IconDemo')),
  component('Image', 'media', 'An image from a URI with content scale and alpha.', media('ImageDemo')),
  component('AnimatedVisibility', 'media', 'Animates content in and out with enter and exit transitions.', media('AnimatedVisibilityDemo')),

  // --- scrollables
  component('LazyColumn', 'scrollables', 'A recycling vertical list: only visible rows are composed.', scrollables('LazyColumnDemo')),
  component('LazyRow', 'scrollables', 'A recycling horizontal list.', scrollables('LazyRowDemo')),
  component('HorizontalPager', 'scrollables', 'Swipeable pages.', scrollables('HorizontalPagerDemo')),
  component('HorizontalMultiBrowseCarousel', 'scrollables', 'A carousel that shows several items of varying size.', scrollables('HorizontalMultiBrowseCarouselDemo')),
  component('HorizontalUncontainedCarousel', 'scrollables', 'A carousel of uniform items that scroll freely.', scrollables('HorizontalUncontainedCarouselDemo')),
  component('HorizontalCenteredHeroCarousel', 'scrollables', 'A carousel with a large centered hero item.', scrollables('HorizontalCenteredHeroCarouselDemo')),
  component('PullToRefreshBox', 'scrollables', 'Pull-to-refresh around scrollable content.', scrollables('PullToRefreshBoxDemo')),
  component('NativeList', 'scrollables', 'A FlatList-style list on one Host with a recycling LazyColumn.', nativeList('NativeListDemo'), { scroll: false }),

  // --- overlays
  component('AlertDialog', 'overlays', 'A dialog with title, text and confirm and dismiss actions.', overlays('AlertDialogDemo')),
  component('BasicAlertDialog', 'overlays', 'A dialog that shows any content you give it.', overlays('BasicAlertDialogDemo')),
  component('ModalBottomSheet', 'overlays', 'A bottom sheet with an imperative ref to expand and hide it.', overlays('ModalBottomSheetDemo')),
  component('DropdownMenu', 'overlays', 'A menu anchored to a trigger.', menus('DropdownMenuDemo'), { requires: ['SelectableDropdownMenuItemView'] }),
  component('DropdownMenuItem', 'overlays', 'A pressable row inside a dropdown menu.', menus('DropdownMenuDemo'), { partOf: 'DropdownMenu', requires: ['SelectableDropdownMenuItemView'] }),
  component('SelectableDropdownMenuItem', 'overlays', 'A menu row that shows a selected state.', menus('DropdownMenuDemo'), { partOf: 'DropdownMenu', requires: ['SelectableDropdownMenuItemView'] }),
  component('DropdownMenuPopup', 'overlays', 'A popup menu anchored to its parent, built from groups.', menus('DropdownMenuPopupDemo'), { requires: ['DropdownMenuPopupView', 'DropdownMenuGroupView'] }),
  component('DropdownMenuGroup', 'overlays', 'A rounded group of items inside a menu popup.', menus('DropdownMenuPopupDemo'), { partOf: 'DropdownMenuPopup', requires: ['DropdownMenuPopupView', 'DropdownMenuGroupView'] }),
  component('ExposedDropdownMenuBox', 'overlays', 'A field that anchors a dropdown, as in a select.', menus('ExposedDropdownMenuBoxDemo'), { requires: ['ExposedDropdownMenuBoxView'] }),
  component('ExposedDropdownMenu', 'overlays', 'The menu that opens from an exposed dropdown box.', menus('ExposedDropdownMenuBoxDemo'), { partOf: 'ExposedDropdownMenuBox', requires: ['ExposedDropdownMenuBoxView'] }),
  component('SnackbarHost', 'overlays', 'Shows snackbars on demand and resolves with the user action.', overlays('SnackbarHostDemo')),
  component('Snackbar', 'overlays', 'A custom snackbar body, with your own colors, inside a SnackbarHost.', overlays('SnackbarHostDemo'), { partOf: 'SnackbarHost' }),
  component('TooltipBox', 'overlays', 'Plain and rich tooltips on long press or from code.', overlays('TooltipBoxDemo'), { requires: ['TooltipBoxView', 'PlainTooltipView', 'RichTooltipView'] }),

  // --- bars
  component('TopAppBar', 'bars', 'A top app bar with navigation icon, title and actions.', bars('TopAppBarDemo'), { requires: ['TopAppBarView'] }),
  component('NavigationBar', 'bars', 'A bottom navigation bar.', bars('NavigationBarDemo')),
  component('NavigationBarItem', 'bars', 'A destination inside a navigation bar.', bars('NavigationBarDemo'), { partOf: 'NavigationBar' }),
  component('SearchBar', 'bars', 'A search bar that expands to a full-screen search view.', bars('SearchBarDemo'), { requires: ['SearchBarView'] }),
  component('DockedSearchBar', 'bars', 'A search bar docked in the layout.', bars('DockedSearchBarDemo')),
  component('HorizontalFloatingToolbar', 'bars', 'A floating toolbar with actions and a floating action button.', bars('HorizontalFloatingToolbarDemo'), { requires: ['HorizontalFloatingToolbarView'] }),

  // --- pickers
  component('DateTimePicker', 'pickers', 'An inline date picker.', pickers('DateTimePickerDemo')),
  component('DatePickerDialog', 'pickers', 'A date picker in a dialog.', pickers('DatePickerDialogDemo')),
  component('TimePickerDialog', 'pickers', 'A time picker in a dialog.', pickers('TimePickerDialogDemo')),
  component('DateRangePicker', 'pickers', 'An inline picker for a start and end date.', pickers('DateRangePickerDemo'), { requires: ['DateRangePickerView'] }),
  component('DateRangePickerDialog', 'pickers', 'A date range picker in a dialog.', pickers('DateRangePickerDialogDemo'), { requires: ['DateRangePickerDialogView'] }),

  // --- host
  component('Host', 'host', 'The Compose root. One around a screen shares a single root between every component inside.', host('HostDemo')),
  component('RNHostView', 'host', 'Embeds React Native views inside a Compose tree.', host('RNHostViewDemo')),
];

export const findComponent = (slug: string): ComponentEntry | undefined => COMPONENTS.find((c) => c.slug === slug);
