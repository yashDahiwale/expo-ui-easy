import type { ComponentType } from 'react';

export interface DemoEntry {
  key: string;
  title: string;
  subtitle: string;
  /**
   * Loaded lazily so the home screen never imports the Android-only library
   * (it would throw on iOS/web at import time).
   */
  load: () => ComponentType;
}

export const DEMOS: readonly DemoEntry[] = [
  {
    key: 'buttons',
    title: 'Buttons',
    subtitle: 'Button, FilledTonalButton, OutlinedButton, ElevatedButton, TextButton, start/end icons, icon buttons',
    load: () => (require('./demos/ButtonsDemo') as typeof import('./demos/ButtonsDemo')).default,
  },
  {
    key: 'switch',
    title: 'Switch',
    subtitle: 'value, onValueChange, disabled, colors, Switch.ThumbContent',
    load: () => (require('./demos/SwitchDemo') as typeof import('./demos/SwitchDemo')).default,
  },
  {
    key: 'checkbox',
    title: 'Checkbox',
    subtitle: 'value, onValueChange, disabled, colors',
    load: () => (require('./demos/CheckboxDemo') as typeof import('./demos/CheckboxDemo')).default,
  },
  {
    key: 'radio',
    title: 'RadioButton',
    subtitle: 'selected, onPress, disabled, colors',
    load: () => (require('./demos/RadioButtonDemo') as typeof import('./demos/RadioButtonDemo')).default,
  },
  {
    key: 'slider',
    title: 'Slider',
    subtitle: 'min, max, steps, limits, onValueChangeFinished, Slider.Thumb / Slider.Track',
    load: () => (require('./demos/SliderDemo') as typeof import('./demos/SliderDemo')).default,
  },
  {
    key: 'text',
    title: 'Text',
    subtitle: 'Expo TextStyle, numberOfLines, overflow, typography, nested spans',
    load: () => (require('./demos/TextDemo') as typeof import('./demos/TextDemo')).default,
  },
  {
    key: 'textfields',
    title: 'Text fields',
    subtitle: 'TextField, OutlinedTextField: onChangeText, placeholder, secureTextEntry, slots, ref',
    load: () => (require('./demos/TextFieldsDemo') as typeof import('./demos/TextFieldsDemo')).default,
  },
  {
    key: 'selection',
    title: 'Chips, toggles, segments, FABs',
    subtitle: 'Chips, ToggleButtons, SegmentedButtons, TriStateCheckbox, RangeSlider, FABs, SplitButton',
    load: () => (require('./demos/SelectionDemo') as typeof import('./demos/SelectionDemo')).default,
  },
  {
    key: 'containers',
    title: 'Layout & containers',
    subtitle: 'Cards, ListItem, Surface, Row/Column/Box, Lazy lists, Pager, Carousels, Image, PullToRefresh',
    load: () => (require('./demos/ContainersDemo') as typeof import('./demos/ContainersDemo')).default,
  },
  {
    key: 'overlays',
    title: 'Dialogs, sheets, menus & bars',
    subtitle: 'AlertDialog, BottomSheet, DropdownMenu, Snackbar, TopAppBar, NavigationBar, search, pickers',
    load: () => (require('./demos/OverlaysDemo') as typeof import('./demos/OverlaysDemo')).default,
  },
  {
    key: 'more',
    title: 'More components',
    subtitle: 'SearchBar, ExposedDropdownMenuBox, TooltipBox, FloatingToolbar, VerticalSlider, SyncSwitch, DateRangePicker',
    load: () => (require('./demos/MoreDemo') as typeof import('./demos/MoreDemo')).default,
  },
  {
    key: 'progress',
    title: 'Progress & loading indicators',
    subtitle: 'Circular / Linear (+ Wavy) progress indicators, LoadingIndicator',
    load: () => (require('./demos/ProgressDemo') as typeof import('./demos/ProgressDemo')).default,
  },
];
