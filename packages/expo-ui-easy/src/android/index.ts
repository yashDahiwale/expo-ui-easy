// Core
export { Host, RNHostView, useIsInsideHost } from './host/host';
export type { HostProps, RNHostViewProps } from './host/host';
export { wrap } from './internal/wrap';
export type { NativeComponent, WrapOptions } from './internal/wrap';
export type { AutoHostProps, CommonProps, NativeProps } from './internal/types';

// Recipes: higher-level pieces built from the components (the fast path for lists)
export { NativeList } from './recipes/NativeList';
export type { NativeListProps } from './recipes/NativeList';

// Dev diagnostics for Host usage (renders nothing in production)
export { HostDebugOverlay, useHostStats } from './host/HostDebugOverlay';
export { getHostStats } from './internal/host-stats';
export type { HostStats } from './internal/host-stats';

// Hand-written components. Families that differ only in look take a `variant` prop (`size` for FABs).
export { Button } from './components/buttons';
export type { ButtonProps } from './components/buttons';
export { TextField } from './components/inputs';
export type { TextFieldProps } from './components/inputs';
export { Text } from './components/text';
export type { TextProps, TextVariant } from './components/text';

// Everything else (Expo names and props; RN names only where both worlds share a prop)
export * from './components/generated';

// Things that are not components (hooks, factories, slot parts) stay exactly as Expo ships them,
// so one import covers everything.
export {
  CompositionLocalProvider,
  DockedSearchBarLeadingIcon,
  DockedSearchBarPlaceholder,
  EnterTransition,
  ExitTransition,
  ExpandedFullScreenSearchBar,
  HorizontalFloatingToolbarFloatingActionButton,
  HostPaletteContext,
  Items,
  Preview,
  SearchBarPlaceholder,
  Shape,
  SplitButtonLeadingButton,
  SplitButtonTrailingButton,
  SwitchThumbContent,
  Trigger,
  getMaterialColors,
  isDynamicColorAvailable,
  useMaterialColors,
  useNativeState,
  useWorkletCallback,
} from '@expo/ui/jetpack-compose';

export * from './modifiers';

// Tells you whether the running app's native module has a given Expo UI view (e.g. in Expo Go).
export { isNativeViewAvailable, missingNativeViews } from './support/native-support';
