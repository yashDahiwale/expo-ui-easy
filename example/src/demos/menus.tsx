import { useState } from 'react';
import {
  Box, Button, DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPopup, ExposedDropdownMenu,
  ExposedDropdownMenuBox, Host, SelectableDropdownMenuItem, Text, TextField, useNativeState,
} from 'expo-ui-easy';
import { PreviewSection, StateRow } from '../ui';

const SIZES = ['Small', 'Medium', 'Large'] as const;
const FRUITS = ['Apple', 'Banana', 'Cherry'] as const;
const MENU_VIEWS = ['SelectableDropdownMenuItemView'] as const;

export function DropdownMenuDemo() {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<string>('Medium');
  return (
    <PreviewSection
      title="Trigger and items"
      description="DropdownMenu.Trigger anchors the menu; DropdownMenu.Items holds the rows. DropdownMenuItem takes onPress; SelectableDropdownMenuItem adds `selected`."
      requires={MENU_VIEWS}
      code={`<DropdownMenu expanded={open} onDismissRequest={close}>\n  <DropdownMenu.Trigger><Button onPress={openMenu}>Menu</Button></DropdownMenu.Trigger>\n  <DropdownMenu.Items>\n    <DropdownMenuItem onPress={pick}>\n      <DropdownMenuItem.Text><Text>Item</Text></DropdownMenuItem.Text>\n    </DropdownMenuItem>\n  </DropdownMenu.Items>\n</DropdownMenu>`}>
      <Host matchContents>
        <DropdownMenu expanded={open} onDismissRequest={() => setOpen(false)}>
          <DropdownMenu.Trigger>
            <Button onPress={() => setOpen(true)}>{`Size: ${choice}`}</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Items>
            {SIZES.map((label) => (
              <SelectableDropdownMenuItem key={label} selected={choice === label} onPress={() => { setChoice(label); setOpen(false); }}>
                <SelectableDropdownMenuItem.Text><Text>{label}</Text></SelectableDropdownMenuItem.Text>
              </SelectableDropdownMenuItem>
            ))}
            <DropdownMenuItem onPress={() => setOpen(false)}>
              <DropdownMenuItem.Text><Text>Close menu</Text></DropdownMenuItem.Text>
            </DropdownMenuItem>
          </DropdownMenu.Items>
        </DropdownMenu>
      </Host>
      <StateRow text={`choice=${choice}`} />
    </PreviewSection>
  );
}

export function DropdownMenuPopupDemo() {
  const [open, setOpen] = useState(false);
  return (
    <PreviewSection
      title="Popup with groups"
      description="A popup anchored to its parent, holding two groups. shapes {index, count} rounds the group corners."
      requires={['DropdownMenuPopupView', 'DropdownMenuGroupView']}>
      <Host matchContents>
        <Box>
          <Button onPress={() => setOpen(true)}>Open popup menu</Button>
          <DropdownMenuPopup expanded={open} onDismissRequest={() => setOpen(false)} anchorPosition="below">
            <DropdownMenuGroup shapes={{ index: 0, count: 2 }}>
              <DropdownMenuItem onPress={() => setOpen(false)}>
                <DropdownMenuItem.Text><Text>First group</Text></DropdownMenuItem.Text>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup shapes={{ index: 1, count: 2 }}>
              <DropdownMenuItem onPress={() => setOpen(false)}>
                <DropdownMenuItem.Text><Text>Second group</Text></DropdownMenuItem.Text>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuPopup>
        </Box>
      </Host>
    </PreviewSection>
  );
}

export function ExposedDropdownMenuBoxDemo() {
  const [open, setOpen] = useState(false);
  const [fruit, setFruit] = useState<string>(FRUITS[0]);
  const fruitText = useNativeState<string>(FRUITS[0]);
  return (
    <PreviewSection
      title="Select field"
      description="A read-only field anchors a menu. expanded and onExpandedChange are controlled by React."
      requires={['ExposedDropdownMenuBoxView']}>
      <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
        <ExposedDropdownMenuBox expanded={open} onExpandedChange={setOpen}>
          <TextField variant="outlined" value={fruitText} editable={false} />
          <ExposedDropdownMenu expanded={open} onDismissRequest={() => setOpen(false)}>
            {FRUITS.map((name) => (
              <DropdownMenuItem key={name} onPress={() => { setFruit(name); fruitText.value = name; setOpen(false); }}>
                <DropdownMenuItem.Text><Text>{name}</Text></DropdownMenuItem.Text>
              </DropdownMenuItem>
            ))}
          </ExposedDropdownMenu>
        </ExposedDropdownMenuBox>
      </Host>
      <StateRow text={`fruit=${fruit}`} />
    </PreviewSection>
  );
}
