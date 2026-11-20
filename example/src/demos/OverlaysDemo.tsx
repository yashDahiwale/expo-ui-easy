import { useRef, useState } from 'react';
import type { ModalBottomSheetRef, SnackbarHostRef } from '@expo/ui/jetpack-compose';
import {
  AlertDialog, BasicAlertDialog, Button, Column, DatePickerDialog, DateTimePicker, DockedSearchBar, DropdownMenu,
  DropdownMenuItem, FilledTonalButton, Host, Icon, ModalBottomSheet, NavigationBar, NavigationBarItem,
  OutlinedButton, SelectableDropdownMenuItem, SnackbarHost, Text, TextButton, TimePickerDialog, TopAppBar,
} from 'expo-ui-easy';
import { paddingAll } from '@expo/ui/jetpack-compose/modifiers';
import { ICONS } from '../icons';
import { Case, Page, Readout } from '../ui';

const TABS = ['Home', 'Favorites', 'Starred'] as const;
const TAB_ICONS = [ICONS.check, ICONS.favorite, ICONS.star] as const;

export default function OverlaysDemo() {
  const [alert, setAlert] = useState(false);
  const [basic, setBasic] = useState(false);
  const [result, setResult] = useState('-');
  const [sheet, setSheet] = useState(false);
  const sheetRef = useRef<ModalBottomSheetRef>(null);
  const [menu, setMenu] = useState(false);
  const [choice, setChoice] = useState('Medium');
  const snackbar = useRef<SnackbarHostRef>(null);
  const [snackResult, setSnackResult] = useState('-');
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState('');
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [picked, setPicked] = useState('-');

  return (
    <Page>
      <Case title="AlertDialog" note="Slots: Icon, Title, Text, ConfirmButton, DismissButton. onDismissRequest fires on outside tap or back.">
        <Button onPress={() => setAlert(true)}>Open AlertDialog</Button>
        {alert ? (
          <AlertDialog onDismissRequest={() => { setAlert(false); setResult('dismissed'); }}>
            <AlertDialog.Icon><Icon source={ICONS.star} size={24} /></AlertDialog.Icon>
            <AlertDialog.Title><Text>Discard draft?</Text></AlertDialog.Title>
            <AlertDialog.Text><Text>This cannot be undone.</Text></AlertDialog.Text>
            <AlertDialog.ConfirmButton>
              <TextButton onPress={() => { setAlert(false); setResult('confirmed'); }}>Discard</TextButton>
            </AlertDialog.ConfirmButton>
            <AlertDialog.DismissButton>
              <TextButton onPress={() => { setAlert(false); setResult('cancelled'); }}>Cancel</TextButton>
            </AlertDialog.DismissButton>
          </AlertDialog>
        ) : null}
        <Readout text={`result=${result}`} />
      </Case>

      <Case title="BasicAlertDialog (custom content)">
        <FilledTonalButton onPress={() => setBasic(true)}>Open BasicAlertDialog</FilledTonalButton>
        {basic ? (
          <BasicAlertDialog onDismissRequest={() => setBasic(false)}>
            <Column modifiers={[paddingAll(24)]} verticalArrangement={{ spacedBy: 12 }}>
              <Text style={{ typography: 'titleLarge' }}>Custom dialog</Text>
              <Text>Any Compose content goes here.</Text>
              <TextButton onPress={() => setBasic(false)}>Close</TextButton>
            </Column>
          </BasicAlertDialog>
        ) : null}
      </Case>

      <Case title="ModalBottomSheet" note="Drag it down or tap outside to dismiss. The ref exposes hide / expand / partialExpand.">
        <OutlinedButton onPress={() => setSheet(true)}>Open bottom sheet</OutlinedButton>
        {sheet ? (
          <ModalBottomSheet ref={sheetRef} onDismissRequest={() => setSheet(false)} showDragHandle>
            <Column modifiers={[paddingAll(24)]} verticalArrangement={{ spacedBy: 12 }}>
              <Text style={{ typography: 'titleLarge' }}>Bottom sheet</Text>
              <Button onPress={() => void sheetRef.current?.expand()}>expand()</Button>
              <Button onPress={() => void sheetRef.current?.hide().then(() => setSheet(false))}>hide()</Button>
            </Column>
          </ModalBottomSheet>
        ) : null}
      </Case>

      <Case title="DropdownMenu" requires={['SelectableDropdownMenuItemView']} note="Trigger + Items. DropdownMenuItem: onPress; SelectableDropdownMenuItem: selected + onPress.">
        <Host matchContents>
          <DropdownMenu expanded={menu} onDismissRequest={() => setMenu(false)}>
            <DropdownMenu.Trigger>
              <Button onPress={() => setMenu(true)}>{`Size: ${choice}`}</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Items>
              {['Small', 'Medium', 'Large'].map((label) => (
                <SelectableDropdownMenuItem
                  key={label}
                  selected={choice === label}
                  onPress={() => { setChoice(label); setMenu(false); }}>
                  <SelectableDropdownMenuItem.Text><Text>{label}</Text></SelectableDropdownMenuItem.Text>
                </SelectableDropdownMenuItem>
              ))}
              <DropdownMenuItem onPress={() => setMenu(false)}>
                <DropdownMenuItem.Text><Text>Close menu</Text></DropdownMenuItem.Text>
              </DropdownMenuItem>
            </DropdownMenu.Items>
          </DropdownMenu>
        </Host>
        <Readout text={`choice=${choice}`} />
      </Case>

      <Case title="SnackbarHost" note="showSnackbar returns a promise with 'actionPerformed' or 'dismissed'.">
        <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
          <SnackbarHost ref={snackbar} />
        </Host>
        <Button
          onPress={() =>
            void snackbar.current
              ?.showSnackbar({ message: 'Item archived', actionLabel: 'Undo', withDismissAction: true, duration: 'long' })
              .then(setSnackResult)
          }>
          Show snackbar
        </Button>
        <Readout text={`snackbar result=${snackResult}`} />
      </Case>

      <Case title="TopAppBar" requires={['TopAppBarView']} note="Slots: NavigationIcon, Title, Actions.">
        <TopAppBar>
          <TopAppBar.NavigationIcon><Icon source={ICONS.arrowForward} size={24} /></TopAppBar.NavigationIcon>
          <TopAppBar.Title><Text>App bar title</Text></TopAppBar.Title>
          <TopAppBar.Actions><Icon source={ICONS.favorite} size={24} /></TopAppBar.Actions>
        </TopAppBar>
      </Case>

      <Case title="NavigationBar" note="selected + onPress on each item; slots Icon, SelectedIcon, Label.">
        <NavigationBar>
          {TABS.map((label, i) => (
            <NavigationBarItem key={label} selected={tab === i} onPress={() => setTab(i)}>
              <NavigationBarItem.Icon><Icon source={TAB_ICONS[i] ?? ICONS.star} size={24} /></NavigationBarItem.Icon>
              <NavigationBarItem.Label><Text>{label}</Text></NavigationBarItem.Label>
            </NavigationBarItem>
          ))}
        </NavigationBar>
        <Readout text={`tab=${TABS[tab] ?? '?'}`} />
      </Case>

      <Case title="DockedSearchBar" note="onQueryChange fires while typing.">
        <DockedSearchBar onQueryChange={setQuery}>
          <DockedSearchBar.Placeholder><Text>Search</Text></DockedSearchBar.Placeholder>
          <DockedSearchBar.LeadingIcon><Icon source={ICONS.star} size={24} /></DockedSearchBar.LeadingIcon>
        </DockedSearchBar>
        <Readout text={`query="${query}"`} />
      </Case>

      <Case title="Pickers" note="DatePickerDialog / TimePickerDialog open as dialogs; DateTimePicker is inline. Dates arrive as Date objects.">
        <Button onPress={() => setDateOpen(true)}>Pick a date</Button>
        <Button onPress={() => setTimeOpen(true)}>Pick a time</Button>
        {dateOpen ? (
          <DatePickerDialog onDismissRequest={() => setDateOpen(false)} onDateSelected={(d) => { setDateOpen(false); setPicked(`date ${d.toDateString()}`); }} />
        ) : null}
        {timeOpen ? (
          <TimePickerDialog onDismissRequest={() => setTimeOpen(false)} is24Hour onDateSelected={(d) => { setTimeOpen(false); setPicked(`time ${d.toTimeString().slice(0, 5)}`); }} />
        ) : null}
        <DateTimePicker onDateSelected={(d) => setPicked(`inline ${d ? d.toDateString() : 'none'}`)} />
        <Readout text={`picked=${picked}`} />
      </Case>
    </Page>
  );
}
