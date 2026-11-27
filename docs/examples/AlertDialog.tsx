import { useState } from 'react';
import { AlertDialog, Button, Host, Text } from 'expo-ui-easy';

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <Host matchContents>
      <Button onPress={() => setOpen(true)}>Delete</Button>
      {open ? (
        <AlertDialog onDismissRequest={() => setOpen(false)}>
          <AlertDialog.Title><Text>Discard draft?</Text></AlertDialog.Title>
          <AlertDialog.Text><Text>This cannot be undone.</Text></AlertDialog.Text>
          <AlertDialog.ConfirmButton>
            <Button variant="text" onPress={() => setOpen(false)}>Discard</Button>
          </AlertDialog.ConfirmButton>
          <AlertDialog.DismissButton>
            <Button variant="text" onPress={() => setOpen(false)}>Cancel</Button>
          </AlertDialog.DismissButton>
        </AlertDialog>
      ) : null}
    </Host>
  );
}
