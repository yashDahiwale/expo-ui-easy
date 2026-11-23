import { Text } from 'expo-ui-easy';

export function Example() {
  // `style` is Expo's TextStyle; `numberOfLines` is the React Native name for Expo's `maxLines`.
  return (
    <Text numberOfLines={2} style={{ typography: 'bodyLarge', fontWeight: '700' }} color="#1C1B1F">
      Rendered by Jetpack Compose
    </Text>
  );
}
