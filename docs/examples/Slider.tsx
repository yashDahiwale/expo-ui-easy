import { useState } from 'react';
import { Slider } from 'expo-ui-easy';

export function Example() {
  const [volume, setVolume] = useState(0.4);
  // min / max / steps are Expo's names. steps = positions BETWEEN min and max (9 gives 0..10).
  return <Slider value={volume} min={0} max={1} onValueChange={setVolume} />;
}
