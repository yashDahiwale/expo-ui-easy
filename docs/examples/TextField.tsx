import { useState } from 'react';
import { TextField, useNativeState } from 'expo-ui-easy';

export function Example() {
  const name = useNativeState(''); // the field's value is Expo's ObservableState, not a string
  const [typed, setTyped] = useState('');
  return <TextField value={name} onChangeText={setTyped} placeholder={`Name (${typed.length} chars)`} />;
}
