/**
 * Compile-time tests (run with `npm run typecheck`). Every `@ts-expect-error` must really
 * be an error, otherwise tsc reports "Unused '@ts-expect-error' directive".
 */
import { Icon, Row, Shape } from '@expo/ui/jetpack-compose';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';
import {
  Button, Checkbox, CircularProgressIndicator, Host, IconButton, LinearProgressIndicator,
  RadioButton, Slider, Switch, Text, LoadingIndicator,
} from '../src';

declare const iconSource: number;

export function validUsage() {
  return (
    <Host matchContents>
      {/* RN names where both worlds share the prop */}
      <Switch value onValueChange={(v: boolean) => void v} disabled testID="t" accessibilityLabel="x" />
      <Checkbox value={false} onValueChange={() => {}} />
      <RadioButton selected onPress={() => {}} disabled />
      {/* Expo names and full Expo props everywhere else */}
      <Switch value colors={{ checkedTrackColor: 'red' }} modifiers={[paddingAll(4)]}>
        <Switch.ThumbContent><Row /></Switch.ThumbContent>
      </Switch>
      <Slider value={0.5} min={0} max={10} steps={9} onValueChange={(v: number) => void v} onValueChangeFinished={() => {}} disabled />
      <Slider>
        <Slider.Thumb><Row /></Slider.Thumb>
      </Slider>
      {/* Buttons: Expo's component names, icons at start / end */}
      <Button onPress={() => {}} colors={{ containerColor: 'red' }} shape={Shape.Pill({})} startIcon={<Icon source={iconSource} size={18} />}>
        Save
      </Button>
      <Button variant="outlined" endIcon={<Icon source={iconSource} />} disabled><Text>Next</Text></Button>
      <Button variant="text" contentPadding={{ start: 4, end: 4 }}>Plain</Button>
      <IconButton variant="filled" onPress={() => {}}><Icon source={iconSource} /></IconButton>
      {/* Text keeps Expo's `style`; RN's numberOfLines is accepted */}
      <Text numberOfLines={2} style={{ fontWeight: '700' }} containerStyle={{ width: '100%' }}>Hello</Text>
      {/* Progress indicators keep Expo's names and props */}
      <CircularProgressIndicator progress={0.4} strokeWidth={6} strokeCap="round" />
      <LinearProgressIndicator style={{ width: '80%' }} />
      <LoadingIndicator />
    </Host>
  );
}

export function invalidUsage() {
  return (
    <>
      {/* @ts-expect-error Expo's native name is replaced by the RN name */}
      <Switch value onCheckedChange={() => {}} />
      {/* @ts-expect-error Expo's `enabled` is replaced by RN's `disabled` */}
      <Switch value enabled />
      {/* @ts-expect-error onClick is replaced by onPress */}
      <Button onClick={() => {}}>x</Button>
      {/* @ts-expect-error value is required (Expo requires it) */}
      <Switch />
      {/* @ts-expect-error onValueChange receives a boolean */}
      <Switch value onValueChange={(v: string) => void v} />
      {/* @ts-expect-error children (the label) is required on buttons */}
      <Button />
      {/* @ts-expect-error unknown Expo prop */}
      <Button colour="red">x</Button>
      {/* @ts-expect-error there is no ActivityIndicator-style `animating` prop on Expo's progress indicator */}
      <CircularProgressIndicator animating />
      {/* @ts-expect-error Expo's maxLines is replaced by RN's numberOfLines */}
      <Text maxLines={2}>x</Text>
      {/* @ts-expect-error Text's `style` is Expo's TextStyle: unknown keys are rejected */}
      <Text style={{ includeFontPadding: false }}>x</Text>
      {/* @ts-expect-error Slider has no minimumValue: Expo calls it min */}
      <Slider minimumValue={0} />
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Second wave: inputs, layout, overlays, bars
// ---------------------------------------------------------------------------------------------
import {
  AlertDialog, Card, Column, DropdownMenu, FilterChip, FloatingActionButton, LazyColumn, ListItem,
  ModalBottomSheet, NavigationBar, NavigationBarItem, SegmentedButton,
  SingleChoiceSegmentedButtonRow, Surface, TextField, ToggleButton, TopAppBar, useNativeState,
} from '../src';

export function Second() {
  const text = useNativeState('');
  return (
    <Host>
      {/* TextField: RN names for the shared TextInput props, Expo's for everything else */}
      <TextField value={text} onChangeText={(t: string) => void t} placeholder="Name" secureTextEntry multiline={false} editable={false} maxLength={10} autoFocus keyboardOptions={{ keyboardType: 'email' }} isError>
        <TextField.Label><Text>Label</Text></TextField.Label>
      </TextField>
      <TextField variant="outlined" value={text} onChangeText={() => {}} singleLine />
      <FilterChip selected onPress={() => {}} disabled><Text>Chip</Text></FilterChip>
      <ToggleButton checked onValueChange={(v: boolean) => void v} disabled><Text>Bold</Text></ToggleButton>
      <SingleChoiceSegmentedButtonRow>
        <SegmentedButton selected onPress={() => {}}><Text>A</Text></SegmentedButton>
      </SingleChoiceSegmentedButtonRow>
      <Surface onPress={() => {}} color="red"><Text>x</Text></Surface>
      <FloatingActionButton onPress={() => {}} containerColor="red"><Icon source={iconSource} /></FloatingActionButton>
      <Card elevation={4}><ListItem><ListItem.HeadlineContent><Text>Title</Text></ListItem.HeadlineContent></ListItem></Card>
      <Column verticalArrangement={{ spacedBy: 4 }} />
      <LazyColumn><LazyColumn.Items data={[1, 2]} keyExtractor={(n: number) => String(n)}>{({ item }: { item: number }) => <Text>{String(item)}</Text>}</LazyColumn.Items></LazyColumn>
      <AlertDialog onDismissRequest={() => {}}>
        <AlertDialog.Title><Text>Title</Text></AlertDialog.Title>
        <AlertDialog.ConfirmButton><Button variant="text" onPress={() => {}}>OK</Button></AlertDialog.ConfirmButton>
      </AlertDialog>
      <ModalBottomSheet onDismissRequest={() => {}}><Text>Sheet</Text></ModalBottomSheet>
      <DropdownMenu expanded onDismissRequest={() => {}}><Text>Menu</Text></DropdownMenu>
      <TopAppBar><TopAppBar.Title><Text>Bar</Text></TopAppBar.Title></TopAppBar>
      <NavigationBar>
        <NavigationBarItem selected onPress={() => {}} disabled><NavigationBarItem.Label><Text>Home</Text></NavigationBarItem.Label></NavigationBarItem>
      </NavigationBar>
    </Host>
  );
}

export function SecondInvalid() {
  return (
    <>
      {/* @ts-expect-error TextField's onValueChange is exposed as onChangeText */}
      <TextField onValueChange={() => {}} />
      {/* @ts-expect-error onClick is exposed as onPress on chips */}
      <FilterChip selected onClick={() => {}}><Text>x</Text></FilterChip>
      {/* @ts-expect-error onCheckedChange is exposed as onValueChange on toggle buttons */}
      <ToggleButton checked onCheckedChange={() => {}}><Text>x</Text></ToggleButton>
      {/* @ts-expect-error onDismissRequest is required by the bottom sheet (Expo requires it) */}
      <ModalBottomSheet><Text>x</Text></ModalBottomSheet>
      {/* @ts-expect-error placeholder is a string, not a Compose element */}
      <TextField placeholder={<Text>x</Text>} />
      {/* @ts-expect-error NavigationBarItem requires `selected` */}
      <NavigationBarItem />
    </>
  );
}

// Expo's own `style` (DropdownMenu) is kept; the Host's layout style is `containerStyle`.
export function DropdownStyle() {
  return (
    <DropdownMenu expanded onDismissRequest={() => {}} style={{ width: 100 }} containerStyle={{ alignSelf: 'flex-start' }}>
      <Text>x</Text>
    </DropdownMenu>
  );
}

// ---------------------------------------------------------------------------------------------
// NativeList + diagnostics
// ---------------------------------------------------------------------------------------------
import { HorizontalDivider, HostDebugOverlay, NativeList, useHostStats } from '../src';

interface Row { id: number; title: string }
declare const rows: readonly Row[];

export function ListUsage() {
  const stats = useHostStats();
  return (
    <>
      <NativeList
        data={rows}
        renderItem={({ item }) => <ListItem><ListItem.HeadlineContent><Text>{item.title}</Text></ListItem.HeadlineContent></ListItem>}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={<Text>Header</Text>}
        ListEmptyComponent={<Text>Empty</Text>}
        ItemSeparatorComponent={<HorizontalDivider />}
        onEndReached={() => {}}
        onEndReachedThreshold={6}
        refreshing={false}
        onRefresh={() => {}}
        contentPadding={{ top: 8, bottom: 8 }}
        verticalArrangement={{ spacedBy: 4 }}
        style={{ flex: 1 }}
        testID="list"
      />
      <HostDebugOverlay />
      <Text>{String(stats.autoHosts)}</Text>
    </>
  );
}

export function ListInvalid() {
  return (
    <>
      {/* @ts-expect-error renderItem must return a React element, not a string */}
      <NativeList data={rows} renderItem={({ item }) => item.title} />
      {/* @ts-expect-error keyExtractor must return a string */}
      <NativeList data={rows} renderItem={() => <Text>x</Text>} keyExtractor={(item) => item.id} />
      {/* @ts-expect-error data is required */}
      <NativeList renderItem={() => <Text>x</Text>} />
      {/* @ts-expect-error item type is inferred from data */}
      <NativeList data={rows} renderItem={({ item }) => <Text>{item.missing}</Text>} />
    </>
  );
}

// ---------------------------------------------------------------------------------------------
// Variant families: one component, a `variant` (or `size`) prop picks the native component
// ---------------------------------------------------------------------------------------------
import * as Lib from '../src';
import type { ButtonProps, TextFieldProps, TextVariant } from '../src';

export function Variants() {
  const text = useNativeState('');
  const variant: ButtonProps['variant'] = 'tonal';
  return (
    <Host>
      <Button>default is filled</Button>
      <Button variant="filled" onPress={() => {}}>x</Button>
      <Button variant="tonal">x</Button>
      <Button variant="elevated" startIcon={<Icon source={iconSource} />}>x</Button>
      <Button variant={variant}>a variant can be a variable</Button>
      <IconButton variant="tonal"><Icon source={iconSource} /></IconButton>
      <Lib.IconToggleButton variant="outlined" checked onValueChange={(v: boolean) => void v}><Icon source={iconSource} /></Lib.IconToggleButton>
      <Lib.Card variant="outlined" border={{ width: 2 }}><Text>x</Text></Lib.Card>
      <Lib.Card variant="elevated" elevation={4}><Text>x</Text></Lib.Card>
      <Lib.LoadingIndicator />
      <Lib.LoadingIndicator variant="contained" containerColor="red" />
      <TextField variant="outlined" value={text} placeholder="x" />
      {/* FloatingActionButton is sized with `size`; only the extended one takes `expanded` and the label slot */}
      <Lib.FloatingActionButton onPress={() => {}}><Lib.FloatingActionButton.Icon><Icon source={iconSource} /></Lib.FloatingActionButton.Icon></Lib.FloatingActionButton>
      <Lib.FloatingActionButton size="small" containerColor="red"><Icon source={iconSource} /></Lib.FloatingActionButton>
      <Lib.FloatingActionButton size="extended" expanded={false}>
        <Lib.FloatingActionButton.Icon><Icon source={iconSource} /></Lib.FloatingActionButton.Icon>
        <Lib.FloatingActionButton.Text><Text>Compose</Text></Lib.FloatingActionButton.Text>
      </Lib.FloatingActionButton>
      {/* Text gets a Material3 type role; explicit style still wins */}
      <Text variant="titleLarge">x</Text>
      <Text variant="bodySmall" style={{ typography: 'labelSmall', fontWeight: '700' }}>x</Text>
    </Host>
  );
}

export function VariantsInvalid() {
  const text = useNativeState('');
  return (
    <>
      {/* @ts-expect-error unknown button variant */}
      <Button variant="floating">x</Button>
      {/* @ts-expect-error the old per-variant prop style is gone */}
      <Button outlined>x</Button>
      {/* @ts-expect-error unknown text field variant */}
      <TextField variant="underlined" value={text} />
      {/* @ts-expect-error ElevatedCard has no border */}
      <Lib.Card variant="elevated" border={{ width: 1 }}><Text>x</Text></Lib.Card>
      {/* @ts-expect-error containerColor only exists on the contained loading indicator */}
      <Lib.LoadingIndicator containerColor="red" />
      {/* @ts-expect-error `expanded` only exists on extended floating action buttons */}
      <Lib.FloatingActionButton size="small" expanded><Icon source={iconSource} /></Lib.FloatingActionButton>
      {/* @ts-expect-error FAB variants are chosen with `size`, not `variant` */}
      <Lib.FloatingActionButton variant="large"><Icon source={iconSource} /></Lib.FloatingActionButton>
      {/* @ts-expect-error not a Material3 type role */}
      <Text variant="huge">x</Text>
    </>
  );
}

// The per-variant exports were removed in favour of the variant props.
export const removed = [
  // @ts-expect-error use <Button variant="outlined">
  Lib.OutlinedButton,
  // @ts-expect-error use <Button variant="text">
  Lib.TextButton,
  // @ts-expect-error use <TextField variant="outlined">
  Lib.OutlinedTextField,
  // @ts-expect-error use <IconButton variant="filled">
  Lib.FilledIconButton,
  // @ts-expect-error use <FloatingActionButton size="extended">
  Lib.ExtendedFloatingActionButton,
  // @ts-expect-error use <Card variant="elevated">
  Lib.ElevatedCard,
  // @ts-expect-error use <LoadingIndicator variant="contained">
  Lib.ContainedLoadingIndicator,
];
export type ExportedTypes = [TextFieldProps, TextVariant];
