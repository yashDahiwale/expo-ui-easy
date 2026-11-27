import { type ModifierConfig } from '@expo/ui/jetpack-compose/modifiers';
export interface ModifierInputs {
    testID: string | undefined;
    accessibilityLabel: string | undefined;
    /** Modifiers that must come first (layout). Pass a module-level constant to keep the memo stable. */
    leading?: readonly ModifierConfig[] | undefined;
    /** User-supplied modifiers; applied last so they can refine ours. */
    extra: readonly ModifierConfig[] | undefined;
}
/** Builds the memoized modifier chain for a component, or `undefined` when empty. */
export declare function useComposeModifiers(inputs: ModifierInputs): ModifierConfig[] | undefined;
//# sourceMappingURL=modifiers.d.ts.map