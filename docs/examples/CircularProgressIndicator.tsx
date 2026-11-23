import { CircularProgressIndicator, size } from 'expo-ui-easy';

export function Example() {
  // No size prop in Expo UI: use the size() modifier. Omit `progress` for the endless spinner.
  return <CircularProgressIndicator progress={0.6} modifiers={[size(48, 48)]} />;
}
