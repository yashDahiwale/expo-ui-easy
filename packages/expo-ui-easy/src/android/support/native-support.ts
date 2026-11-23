interface ExpoGlobalLike {
  getViewConfig?: (moduleName: string, viewName?: string) => unknown;
}

/**
 * `true` when the running app's native `ExpoUI` module contains the given view. Expo Go ships a fixed
 * native module, so views added in later `@expo/ui` patch releases are missing there until you use a
 * development build. When the check is impossible (e.g. unknown runtime) it answers `true`.
 */
export function isNativeViewAvailable(viewName: string, moduleName = 'ExpoUI'): boolean {
  const expo = (globalThis as { expo?: ExpoGlobalLike }).expo;
  if (typeof expo?.getViewConfig !== 'function') return true;
  try {
    return expo.getViewConfig(moduleName, viewName) != null;
  } catch {
    return false;
  }
}

/** The subset of `views` that the running app cannot render. */
export function missingNativeViews(views: readonly string[]): string[] {
  return views.filter((view) => !isNativeViewAvailable(view));
}
