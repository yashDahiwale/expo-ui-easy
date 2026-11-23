import { useState } from 'react';
import { Button, Column, Host, Switch, Text } from 'expo-ui-easy';

export function Example() {
  const [on, setOn] = useState(false);
  // One Compose root for everything inside, instead of one per component.
  return (
    <Host matchContents>
      <Column verticalArrangement={{ spacedBy: 8 }}>
        <Text>Settings</Text>
        <Switch value={on} onValueChange={setOn} />
        <Button onPress={() => setOn(false)}>Reset</Button>
      </Column>
    </Host>
  );
}
