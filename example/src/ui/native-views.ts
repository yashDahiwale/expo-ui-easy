import { Platform } from 'react-native';

/** True when Jetpack Compose (and therefore the library) is available. */
export const IS_ANDROID = Platform.OS === 'android';

/**
 * Native Expo UI views from `requires` that the running app lacks (Expo Go ships a fixed native module).
 * The library only exists on Android and throws elsewhere, so it is required lazily and only there.
 */
export function missingViews(requires: readonly string[] | undefined): string[] {
  if (requires === undefined || requires.length === 0 || !IS_ANDROID) return [];
  const lib = require('expo-ui-easy') as typeof import('expo-ui-easy');
  return lib.missingNativeViews(requires);
}
