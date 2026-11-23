import { useRef, useState } from 'react';
import type { ModalBottomSheetRef } from '@expo/ui/jetpack-compose';
import { Button, Column, Host, ModalBottomSheet, Text, paddingAll } from 'expo-ui-easy';

export function Example() {
  const [open, setOpen] = useState(false);
  const sheet = useRef<ModalBottomSheetRef>(null);
  return (
    <Host matchContents>
      <Button onPress={() => setOpen(true)}>Open sheet</Button>
      {open ? (
        <ModalBottomSheet ref={sheet} onDismissRequest={() => setOpen(false)} showDragHandle>
          <Column modifiers={[paddingAll(24)]}>
            <Text>Bottom sheet</Text>
            <Button onPress={() => void sheet.current?.hide().then(() => setOpen(false))}>Close</Button>
          </Column>
        </ModalBottomSheet>
      ) : null}
    </Host>
  );
}
