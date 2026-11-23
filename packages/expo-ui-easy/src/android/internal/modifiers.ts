import { useMemo } from 'react';
import {
  semantics,
  testID as testIDModifier,
  type ModifierConfig,
} from '@expo/ui/jetpack-compose/modifiers';

export interface ModifierInputs {
  testID: string | undefined;
  accessibilityLabel: string | undefined;
  /** Modifiers that must come first (layout). Pass a module-level constant to keep the memo stable. */
  leading?: readonly ModifierConfig[] | undefined;
  /** User-supplied modifiers; applied last so they can refine ours. */
  extra: readonly ModifierConfig[] | undefined;
}

/** Builds the memoized modifier chain for a component, or `undefined` when empty. */
export function useComposeModifiers(inputs: ModifierInputs): ModifierConfig[] | undefined {
  const { testID, accessibilityLabel, leading, extra } = inputs;
  return useMemo(() => {
    const chain: ModifierConfig[] = [];
    if (leading) chain.push(...leading);
    if (testID !== undefined) chain.push(testIDModifier(testID));
    if (accessibilityLabel !== undefined) {
      chain.push(semantics({ contentDescription: accessibilityLabel }));
    }
    if (extra) chain.push(...extra);
    return chain.length > 0 ? chain : undefined;
  }, [testID, accessibilityLabel, leading, extra]);
}
