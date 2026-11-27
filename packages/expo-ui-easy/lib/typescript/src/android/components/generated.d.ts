import * as Expo from '@expo/ui/jetpack-compose';
import type { ComponentProps } from 'react';
import { type NativeComponent } from '../internal/wrap.js';
export declare const Switch: NativeComponent<typeof Expo.Switch, {
    readonly onValueChange: "onCheckedChange";
}>;
export type SwitchProps = ComponentProps<typeof Switch>;
export declare const Checkbox: NativeComponent<typeof Expo.Checkbox, {
    readonly onValueChange: "onCheckedChange";
}>;
export type CheckboxProps = ComponentProps<typeof Checkbox>;
export declare const RadioButton: NativeComponent<typeof Expo.RadioButton, {}>;
export type RadioButtonProps = ComponentProps<typeof RadioButton>;
export declare const TriStateCheckbox: NativeComponent<typeof Expo.TriStateCheckbox, {}>;
export type TriStateCheckboxProps = ComponentProps<typeof TriStateCheckbox>;
export declare const ToggleButton: NativeComponent<{
    (props: Expo.ToggleButtonProps): import("react").JSX.Element;
    displayName: string;
} & {
    DefaultIconSpacing: number;
    DefaultIconSize: number;
}, {
    readonly onValueChange: "onCheckedChange";
}>;
export type ToggleButtonProps = ComponentProps<typeof ToggleButton>;
export declare const SegmentedButton: NativeComponent<typeof Expo.SegmentedButton, {
    readonly onValueChange: "onCheckedChange";
}>;
export type SegmentedButtonProps = ComponentProps<typeof SegmentedButton>;
export declare const SingleChoiceSegmentedButtonRow: NativeComponent<typeof Expo.SingleChoiceSegmentedButtonRow, {}>;
export type SingleChoiceSegmentedButtonRowProps = ComponentProps<typeof SingleChoiceSegmentedButtonRow>;
export declare const MultiChoiceSegmentedButtonRow: NativeComponent<typeof Expo.MultiChoiceSegmentedButtonRow, {}>;
export type MultiChoiceSegmentedButtonRowProps = ComponentProps<typeof MultiChoiceSegmentedButtonRow>;
export declare const SyncSwitch: NativeComponent<typeof Expo.SyncSwitch, {}>;
export type SyncSwitchProps = ComponentProps<typeof SyncSwitch>;
export declare const AssistChip: NativeComponent<typeof Expo.AssistChip, {}>;
export type AssistChipProps = ComponentProps<typeof AssistChip>;
export declare const FilterChip: NativeComponent<typeof Expo.FilterChip, {}>;
export type FilterChipProps = ComponentProps<typeof FilterChip>;
export declare const InputChip: NativeComponent<typeof Expo.InputChip, {}>;
export type InputChipProps = ComponentProps<typeof InputChip>;
export declare const SuggestionChip: NativeComponent<typeof Expo.SuggestionChip, {}>;
export type SuggestionChipProps = ComponentProps<typeof SuggestionChip>;
export declare const IconToggleButton: import("../internal/variants.js").VariantComponent<"variant", "standard", {
    readonly standard: NativeComponent<{
        (props: Expo.ToggleButtonProps): import("react").JSX.Element;
        displayName: string;
    }, {
        readonly onValueChange: "onCheckedChange";
    }>;
    readonly filled: NativeComponent<{
        (props: Expo.ToggleButtonProps): import("react").JSX.Element;
        displayName: string;
    }, {
        readonly onValueChange: "onCheckedChange";
    }>;
    readonly outlined: NativeComponent<{
        (props: Expo.ToggleButtonProps): import("react").JSX.Element;
        displayName: string;
    }, {
        readonly onValueChange: "onCheckedChange";
    }>;
}, import("../internal/statics.js").Statics<{}>>;
export type IconToggleButtonProps = ComponentProps<typeof IconToggleButton>;
export declare const Slider: NativeComponent<typeof Expo.Slider, {}>;
export type SliderProps = ComponentProps<typeof Slider>;
export declare const RangeSlider: NativeComponent<typeof Expo.RangeSlider, {}>;
export type RangeSliderProps = ComponentProps<typeof RangeSlider>;
export declare const VerticalSlider: NativeComponent<typeof Expo.VerticalSlider, {}>;
export type VerticalSliderProps = ComponentProps<typeof VerticalSlider>;
export declare const BasicTextField: NativeComponent<typeof Expo.BasicTextField, {
    readonly onChangeText: "onValueChange";
}>;
export type BasicTextFieldProps = ComponentProps<typeof BasicTextField>;
export declare const SplitButtonLayout: NativeComponent<typeof Expo.SplitButtonLayout, {}>;
export type SplitButtonLayoutProps = ComponentProps<typeof SplitButtonLayout>;
export declare const IconButton: import("../internal/variants.js").VariantComponent<"variant", "standard", {
    readonly standard: NativeComponent<{
        (props: Expo.IconButtonProps): import("react").JSX.Element;
        displayName: string;
    }, {}>;
    readonly filled: NativeComponent<{
        (props: Expo.IconButtonProps): import("react").JSX.Element;
        displayName: string;
    }, {}>;
    readonly tonal: NativeComponent<{
        (props: Expo.IconButtonProps): import("react").JSX.Element;
        displayName: string;
    }, {}>;
    readonly outlined: NativeComponent<{
        (props: Expo.IconButtonProps): import("react").JSX.Element;
        displayName: string;
    }, {}>;
}, import("../internal/statics.js").Statics<{}>>;
export type IconButtonProps = ComponentProps<typeof IconButton>;
export declare const FloatingActionButton: import("../internal/variants.js").VariantComponent<"size", "medium", {
    readonly small: NativeComponent<typeof Expo.SmallFloatingActionButton, {}>;
    readonly medium: NativeComponent<typeof Expo.FloatingActionButton, {}>;
    readonly large: NativeComponent<typeof Expo.LargeFloatingActionButton, {}>;
    readonly extended: NativeComponent<typeof Expo.ExtendedFloatingActionButton, {}>;
}, import("../internal/statics.js").Statics<typeof Expo.ExtendedFloatingActionButton>>;
export type FloatingActionButtonProps = ComponentProps<typeof FloatingActionButton>;
export declare const CircularProgressIndicator: NativeComponent<import("react").ComponentType<Expo.CircularProgressIndicatorProps>, {}>;
export type CircularProgressIndicatorProps = ComponentProps<typeof CircularProgressIndicator>;
export declare const CircularWavyProgressIndicator: NativeComponent<import("react").ComponentType<Expo.CircularWavyProgressIndicatorProps>, {}>;
export type CircularWavyProgressIndicatorProps = ComponentProps<typeof CircularWavyProgressIndicator>;
export declare const LinearProgressIndicator: NativeComponent<import("react").ComponentType<Expo.LinearProgressIndicatorProps>, {}>;
export type LinearProgressIndicatorProps = ComponentProps<typeof LinearProgressIndicator>;
export declare const LinearWavyProgressIndicator: NativeComponent<import("react").ComponentType<Expo.LinearWavyProgressIndicatorProps>, {}>;
export type LinearWavyProgressIndicatorProps = ComponentProps<typeof LinearWavyProgressIndicator>;
export declare const LoadingIndicator: import("../internal/variants.js").VariantComponent<"variant", "default", {
    readonly default: NativeComponent<import("react").ComponentType<Expo.LoadingIndicatorCommonConfig>, {}>;
    readonly contained: NativeComponent<import("react").ComponentType<Expo.ContainedLoadingIndicatorProps>, {}>;
}, import("../internal/statics.js").Statics<{}>>;
export type LoadingIndicatorProps = ComponentProps<typeof LoadingIndicator>;
export declare const DateTimePicker: NativeComponent<typeof Expo.DateTimePicker, {}>;
export type DateTimePickerProps = ComponentProps<typeof DateTimePicker>;
export declare const DateRangePicker: NativeComponent<typeof Expo.DateRangePicker, {}>;
export type DateRangePickerProps = ComponentProps<typeof DateRangePicker>;
export declare const DatePickerDialog: NativeComponent<typeof Expo.DatePickerDialog, {}>;
export type DatePickerDialogProps = ComponentProps<typeof DatePickerDialog>;
export declare const DateRangePickerDialog: NativeComponent<typeof Expo.DateRangePickerDialog, {}>;
export type DateRangePickerDialogProps = ComponentProps<typeof DateRangePickerDialog>;
export declare const TimePickerDialog: NativeComponent<typeof Expo.TimePickerDialog, {}>;
export type TimePickerDialogProps = ComponentProps<typeof TimePickerDialog>;
export declare const Row: NativeComponent<typeof Expo.Row, {}>;
export type RowProps = ComponentProps<typeof Row>;
export declare const Column: NativeComponent<typeof Expo.Column, {}>;
export type ColumnProps = ComponentProps<typeof Column>;
export declare const Box: NativeComponent<typeof Expo.Box, {}>;
export type BoxProps = ComponentProps<typeof Box>;
export declare const FlowRow: NativeComponent<typeof Expo.FlowRow, {}>;
export type FlowRowProps = ComponentProps<typeof FlowRow>;
export declare const Spacer: NativeComponent<typeof Expo.Spacer, {}>;
export type SpacerProps = ComponentProps<typeof Spacer>;
export declare const Surface: NativeComponent<typeof Expo.Surface, {
    readonly onValueChange: "onCheckedChange";
}>;
export type SurfaceProps = ComponentProps<typeof Surface>;
export declare const ListItem: NativeComponent<typeof Expo.ListItem, {}>;
export type ListItemProps = ComponentProps<typeof ListItem>;
export declare const VerticalDivider: NativeComponent<import("react").ComponentType<Expo.DividerCommonConfig>, {}>;
export type VerticalDividerProps = ComponentProps<typeof VerticalDivider>;
export declare const Badge: NativeComponent<typeof Expo.Badge, {}>;
export type BadgeProps = ComponentProps<typeof Badge>;
export declare const BadgedBox: NativeComponent<typeof Expo.BadgedBox, {}>;
export type BadgedBoxProps = ComponentProps<typeof BadgedBox>;
export declare const HorizontalDivider: NativeComponent<import("react").ComponentType<Expo.DividerCommonConfig>, {}>;
export type HorizontalDividerProps = ComponentProps<typeof HorizontalDivider>;
export declare const Card: import("../internal/variants.js").VariantComponent<"variant", "filled", {
    readonly filled: NativeComponent<import("react").ComponentType<Expo.CardProps>, {}>;
    readonly elevated: NativeComponent<import("react").ComponentType<Expo.ElevatedCardProps>, {}>;
    readonly outlined: NativeComponent<import("react").ComponentType<Expo.OutlinedCardProps>, {}>;
}, import("../internal/statics.js").Statics<{}>>;
export type CardProps = ComponentProps<typeof Card>;
export declare const Icon: NativeComponent<typeof Expo.Icon, {}>;
export type IconProps = ComponentProps<typeof Icon>;
export declare const Image: NativeComponent<typeof Expo.Image, {}>;
export type ImageProps = ComponentProps<typeof Image>;
export declare const AnimatedVisibility: NativeComponent<typeof Expo.AnimatedVisibility, {}>;
export type AnimatedVisibilityProps = ComponentProps<typeof AnimatedVisibility>;
export declare const LazyColumn: NativeComponent<typeof Expo.LazyColumn, {}>;
export type LazyColumnProps = ComponentProps<typeof LazyColumn>;
export declare const LazyRow: NativeComponent<typeof Expo.LazyRow, {}>;
export type LazyRowProps = ComponentProps<typeof LazyRow>;
export declare const HorizontalPager: NativeComponent<typeof Expo.HorizontalPager, {}>;
export type HorizontalPagerProps = ComponentProps<typeof HorizontalPager>;
export declare const HorizontalCenteredHeroCarousel: NativeComponent<import("react").ComponentType<Expo.HorizontalCenteredHeroCarouselProps>, {}>;
export type HorizontalCenteredHeroCarouselProps = ComponentProps<typeof HorizontalCenteredHeroCarousel>;
export declare const HorizontalMultiBrowseCarousel: NativeComponent<import("react").ComponentType<Expo.HorizontalMultiBrowseCarouselProps>, {}>;
export type HorizontalMultiBrowseCarouselProps = ComponentProps<typeof HorizontalMultiBrowseCarousel>;
export declare const HorizontalUncontainedCarousel: NativeComponent<import("react").ComponentType<Expo.HorizontalUncontainedCarouselProps>, {}>;
export type HorizontalUncontainedCarouselProps = ComponentProps<typeof HorizontalUncontainedCarousel>;
export declare const PullToRefreshBox: NativeComponent<typeof Expo.PullToRefreshBox, {}>;
export type PullToRefreshBoxProps = ComponentProps<typeof PullToRefreshBox>;
export declare const AlertDialog: NativeComponent<typeof Expo.AlertDialog, {}>;
export type AlertDialogProps = ComponentProps<typeof AlertDialog>;
export declare const BasicAlertDialog: NativeComponent<typeof Expo.BasicAlertDialog, {}>;
export type BasicAlertDialogProps = ComponentProps<typeof BasicAlertDialog>;
export declare const ModalBottomSheet: NativeComponent<typeof Expo.ModalBottomSheet>;
export type ModalBottomSheetProps = ComponentProps<typeof ModalBottomSheet>;
export declare const DropdownMenu: NativeComponent<typeof Expo.DropdownMenu, {}>;
export type DropdownMenuProps = ComponentProps<typeof DropdownMenu>;
export declare const DropdownMenuPopup: NativeComponent<typeof Expo.DropdownMenuPopup, {}>;
export type DropdownMenuPopupProps = ComponentProps<typeof DropdownMenuPopup>;
export declare const DropdownMenuGroup: NativeComponent<typeof Expo.DropdownMenuGroup, {}>;
export type DropdownMenuGroupProps = ComponentProps<typeof DropdownMenuGroup>;
export declare const DropdownMenuItem: NativeComponent<typeof Expo.DropdownMenuItem, {}>;
export type DropdownMenuItemProps = ComponentProps<typeof DropdownMenuItem>;
export declare const SelectableDropdownMenuItem: NativeComponent<typeof Expo.SelectableDropdownMenuItem, {}>;
export type SelectableDropdownMenuItemProps = ComponentProps<typeof SelectableDropdownMenuItem>;
export declare const ExposedDropdownMenuBox: NativeComponent<typeof Expo.ExposedDropdownMenuBox, {}>;
export type ExposedDropdownMenuBoxProps = ComponentProps<typeof ExposedDropdownMenuBox>;
export declare const ExposedDropdownMenu: NativeComponent<typeof Expo.ExposedDropdownMenu, {}>;
export type ExposedDropdownMenuProps = ComponentProps<typeof ExposedDropdownMenu>;
export declare const Snackbar: NativeComponent<typeof Expo.Snackbar, {}>;
export type SnackbarProps = ComponentProps<typeof Snackbar>;
export declare const SnackbarHost: NativeComponent<typeof Expo.SnackbarHost, {}>;
export type SnackbarHostProps = ComponentProps<typeof SnackbarHost>;
export declare const TooltipBox: NativeComponent<typeof Expo.TooltipBox, {}>;
export type TooltipBoxProps = ComponentProps<typeof TooltipBox>;
export declare const TopAppBar: NativeComponent<typeof Expo.TopAppBar, {}>;
export type TopAppBarProps = ComponentProps<typeof TopAppBar>;
export declare const NavigationBar: NativeComponent<typeof Expo.NavigationBar, {}>;
export type NavigationBarProps = ComponentProps<typeof NavigationBar>;
export declare const SearchBar: NativeComponent<typeof Expo.SearchBar, {}>;
export type SearchBarProps = ComponentProps<typeof SearchBar>;
export declare const DockedSearchBar: NativeComponent<typeof Expo.DockedSearchBar, {}>;
export type DockedSearchBarProps = ComponentProps<typeof DockedSearchBar>;
export declare const HorizontalFloatingToolbar: NativeComponent<typeof Expo.HorizontalFloatingToolbar, {}>;
export type HorizontalFloatingToolbarProps = ComponentProps<typeof HorizontalFloatingToolbar>;
export declare const NavigationBarItem: NativeComponent<typeof Expo.NavigationBarItem, {}>;
export type NavigationBarItemProps = ComponentProps<typeof NavigationBarItem>;
//# sourceMappingURL=generated.d.ts.map