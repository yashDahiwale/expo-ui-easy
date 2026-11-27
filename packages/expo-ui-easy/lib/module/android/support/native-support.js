"use strict";

/**
 * `true` when the running app's native `ExpoUI` module contains the given view. Expo Go ships a fixed
 * native module, so views added in later `@expo/ui` patch releases are missing there until you use a
 * development build. When the check is impossible (e.g. unknown runtime) it answers `true`.
 */
export function isNativeViewAvailable(viewName, moduleName = 'ExpoUI') {
  const expo = globalThis.expo;
  if (typeof expo?.getViewConfig !== 'function') return true;
  try {
    return expo.getViewConfig(moduleName, viewName) != null;
  } catch {
    return false;
  }
}

/** The subset of `views` that the running app cannot render. */
export function missingNativeViews(views) {
  return views.filter(view => !isNativeViewAvailable(view));
}
//# sourceMappingURL=native-support.js.map