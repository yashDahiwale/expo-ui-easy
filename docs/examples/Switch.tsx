import { useState } from 'react';
import { Switch } from 'expo-ui-easy';

export function Example() {
  const [on, setOn] = useState(false);
  return <Switch value={on} onValueChange={setOn} colors={{ checkedTrackColor: '#6750A4' }} />;
}
