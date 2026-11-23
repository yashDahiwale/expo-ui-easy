import { useState } from 'react';
import { Checkbox } from 'expo-ui-easy';

export function Example() {
  const [checked, setChecked] = useState(true);
  return <Checkbox value={checked} onValueChange={setChecked} colors={{ checkedColor: '#2E7D32' }} />;
}
