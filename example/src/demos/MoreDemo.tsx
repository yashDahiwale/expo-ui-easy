import { useRef, useState } from 'react';
import type { TooltipBoxRef } from '@expo/ui/jetpack-compose';
import {
  BasicTextField, Box, DropdownMenuGroup, DropdownMenuPopup, background, fillMaxWidth, paddingAll,
  Button, DateRangePicker, DateRangePickerDialog, DropdownMenuItem, ExposedDropdownMenu, ExposedDropdownMenuBox,
  HorizontalFloatingToolbar, Host, Icon, IconButton, OutlinedTextField, Row, SearchBar, SyncSwitch, Text,
  TextButton, TooltipBox, VerticalSlider, useNativeState,
} from 'expo-ui-easy';
import { ICONS } from '../icons';
import { ActionButton, Case, Page, Readout } from '../ui';

const FRUITS = ['Apple', 'Banana', 'Cherry'] as const;

export default function MoreDemo() {
  const [searched, setSearched] = useState('-');
  const [boxOpen, setBoxOpen] = useState(false);
  const [fruit, setFruit] = useState<string>(FRUITS[0]);
  const fruitText = useNativeState<string>(FRUITS[0]);
  const plainTip = useRef<TooltipBoxRef>(null);
  const [fabTaps, setFabTaps] = useState(0);
  const [vertical, setVertical] = useState(0.5);
  const syncOn = useNativeState(false);
  const [rangeOpen, setRangeOpen] = useState(false);
  const [range, setRange] = useState('-');
  const basicText = useNativeState('');
  const [popup, setPopup] = useState(false);

  return (
    <Page>
      <Case title="SearchBar" requires={['SearchBarView']} note="Collapsed bar with a placeholder; submit a search on the keyboard. ExpandedFullScreenSearchBar holds the content shown while expanded.">
        <SearchBar onSearch={setSearched}>
          <SearchBar.Placeholder><Text>Search fruits</Text></SearchBar.Placeholder>
          <SearchBar.ExpandedFullScreenSearchBar>
            <Text>Suggestions would go here</Text>
          </SearchBar.ExpandedFullScreenSearchBar>
        </SearchBar>
        <Readout text={`onSearch="${searched}"`} />
      </Case>

      <Case title="ExposedDropdownMenuBox" requires={['ExposedDropdownMenuBoxView']} note="A read-only field anchors a menu. expanded / onExpandedChange are controlled by React. If the menu does not anchor correctly, tell me: the slot layout is unverified.">
        <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
          <ExposedDropdownMenuBox expanded={boxOpen} onExpandedChange={setBoxOpen}>
            <OutlinedTextField value={fruitText} editable={false} />
            <ExposedDropdownMenu expanded={boxOpen} onDismissRequest={() => setBoxOpen(false)}>
              {FRUITS.map((name) => (
                <DropdownMenuItem key={name} onPress={() => { setFruit(name); fruitText.value = name; setBoxOpen(false); }}>
                  <DropdownMenuItem.Text><Text>{name}</Text></DropdownMenuItem.Text>
                </DropdownMenuItem>
              ))}
            </ExposedDropdownMenu>
          </ExposedDropdownMenuBox>
        </Host>
        <Readout text={`fruit=${fruit}`} />
      </Case>

      <Case title="TooltipBox: PlainTooltip + RichTooltip" requires={['TooltipBoxView', 'PlainTooltipView', 'RichTooltipView']} note="Long-press the icon for the plain tooltip. The ref's show() / dismiss() work from JS. Slot order (tooltip first, anchor second) is unverified.">
        <Host matchContents>
          <Row horizontalArrangement={{ spacedBy: 16 }}>
            <TooltipBox ref={plainTip}>
              <TooltipBox.PlainTooltip><Text>Add to favorites</Text></TooltipBox.PlainTooltip>
              <IconButton><Icon source={ICONS.favorite} size={24} /></IconButton>
            </TooltipBox>
            <TooltipBox hasAction isPersistent>
              <TooltipBox.RichTooltip>
                <TooltipBox.RichTooltip.Title><Text>Rich tooltip</Text></TooltipBox.RichTooltip.Title>
                <TooltipBox.RichTooltip.Text><Text>Longer explanation with an action.</Text></TooltipBox.RichTooltip.Text>
                <TooltipBox.RichTooltip.Action><TextButton>Got it</TextButton></TooltipBox.RichTooltip.Action>
              </TooltipBox.RichTooltip>
              <IconButton><Icon source={ICONS.star} size={24} /></IconButton>
            </TooltipBox>
          </Row>
        </Host>
        <ActionButton label="plainTip.show()" tone="neutral" onPress={() => void plainTip.current?.show()} />
        <ActionButton label="plainTip.dismiss()" tone="neutral" onPress={() => void plainTip.current?.dismiss()} />
      </Case>

      <Case title="HorizontalFloatingToolbar" requires={['HorizontalFloatingToolbarView']} note="variant 'standard' | 'vibrant' with a trailing FloatingActionButton (onPress).">
        <Host matchContents>
          <HorizontalFloatingToolbar variant="vibrant">
            <IconButton><Icon source={ICONS.star} size={24} /></IconButton>
            <IconButton><Icon source={ICONS.favorite} size={24} /></IconButton>
            <HorizontalFloatingToolbar.FloatingActionButton onPress={() => setFabTaps((n) => n + 1)}>
              <Icon source={ICONS.add} size={24} />
            </HorizontalFloatingToolbar.FloatingActionButton>
          </HorizontalFloatingToolbar>
        </Host>
        <Readout text={`fab taps=${fabTaps}`} />
      </Case>

      <Case title="VerticalSlider" requires={['VerticalSliderView']} note="Same props as Slider plus reverseDirection. It needs a height: give the Host one through style.">
        <VerticalSlider value={vertical} onValueChange={setVertical} style={{ height: 160, alignSelf: 'flex-start' }} hostProps={{ matchContents: { horizontal: true } }} />
        <VerticalSlider value={vertical} onValueChange={setVertical} reverseDirection style={{ height: 160, alignSelf: 'flex-start' }} hostProps={{ matchContents: { horizontal: true } }} />
        <Readout text={`value=${vertical.toFixed(2)} (second one is reversed)`} />
      </Case>

      <Case title="SyncSwitch" requires={['SyncSwitchView']} note="Its state is a native ObservableState (isOn), toggled on the UI thread without a JS round trip. Reading it from JS: isOn.value.">
        <SyncSwitch isOn={syncOn} />
        <ActionButton label="Read isOn.value" tone="neutral" onPress={() => setRange(`isOn=${String(syncOn.value)}`)} />
        <Readout text={range} />
      </Case>

      <Case title="DateRangePicker + dialog" requires={['DateRangePickerView', 'DateRangePickerDialogView']} note="onDateRangeSelected receives { start, end } dates.">
        <Button onPress={() => setRangeOpen(true)}>Pick a date range</Button>
        {rangeOpen ? (
          <DateRangePickerDialog
            onDismissRequest={() => setRangeOpen(false)}
            onDateRangeSelected={(r) => { setRangeOpen(false); setRange(`${r.start?.toDateString() ?? '?'} to ${r.end?.toDateString() ?? '?'}`); }}
          />
        ) : null}
        <DateRangePicker onDateRangeSelected={(r) => setRange(`inline ${r.start?.toDateString() ?? '?'} to ${r.end?.toDateString() ?? '?'}`)} />
        <Readout text={range} />
      </Case>

      <Case title="BasicTextField (decoration slots)" note="The undecorated field: you supply the look through DecorationBox, with InnerTextField where the text goes. Slot layout is unverified.">
        <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
          <BasicTextField value={basicText}>
            <BasicTextField.DecorationBox>
              <Box modifiers={[fillMaxWidth(), background('#F3F4F6'), paddingAll(12)]}>
                <BasicTextField.InnerTextField />
              </Box>
            </BasicTextField.DecorationBox>
          </BasicTextField>
        </Host>
      </Case>

      <Case title="DropdownMenuPopup + DropdownMenuGroup" requires={['DropdownMenuPopupView', 'DropdownMenuGroupView']} note="A popup anchored to its parent, holding two groups (shapes {index, count} rounds the group corners). Anchor placement is unverified.">
        <Host matchContents>
          <Box>
            <Button onPress={() => setPopup(true)}>Open popup menu</Button>
            <DropdownMenuPopup expanded={popup} onDismissRequest={() => setPopup(false)} anchorPosition="below">
              <DropdownMenuGroup shapes={{ index: 0, count: 2 }}>
                <DropdownMenuItem onPress={() => setPopup(false)}>
                  <DropdownMenuItem.Text><Text>First group</Text></DropdownMenuItem.Text>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup shapes={{ index: 1, count: 2 }}>
                <DropdownMenuItem onPress={() => setPopup(false)}>
                  <DropdownMenuItem.Text><Text>Second group</Text></DropdownMenuItem.Text>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuPopup>
          </Box>
        </Host>
      </Case>
    </Page>
  );
}
