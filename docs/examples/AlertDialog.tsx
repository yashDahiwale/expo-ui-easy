import { useState } from 'react';
import { AlertDialog, Button, Host, Text, TextButton } from 'expo-ui-easy';

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
            <TextButton onPress={() => setOpen(false)}>Discard</TextButton>
          </AlertDialog.ConfirmButton>
          <AlertDialog.DismissButton>
            <TextButton onPress={() => setOpen(false)}>Cancel</TextButton>
          </AlertDialog.DismissButton>
        </AlertDialog>
      ) : null}
    </Host>
  );
}
