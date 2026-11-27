/**
 * `true` when the running app's native `ExpoUI` module contains the given view. Expo Go ships a fixed
 * native module, so views added in later `@expo/ui` patch releases are missing there until you use a
 * development build. When the check is impossible (e.g. unknown runtime) it answers `true`.
 */
export declare function isNativeViewAvailable(viewName: string, moduleName?: string): boolean;
/** The subset of `views` that the running app cannot render. */
export declare function missingNativeViews(views: readonly string[]): string[];
//# sourceMappingURL=native-support.d.ts.map