"use strict";

import { useMemo } from 'react';
import { semantics, testID as testIDModifier } from '@expo/ui/jetpack-compose/modifiers';
/** Builds the memoized modifier chain for a component, or `undefined` when empty. */
export function useComposeModifiers(inputs) {
  const {
    testID,
    accessibilityLabel,
    leading,
    extra
  } = inputs;
  return useMemo(() => {
    const chain = [];
    if (leading) chain.push(...leading);
    if (testID !== undefined) chain.push(testIDModifier(testID));
    if (accessibilityLabel !== undefined) {
      chain.push(semantics({
        contentDescription: accessibilityLabel
      }));
    }
    if (extra) chain.push(...extra);
    return chain.length > 0 ? chain : undefined;
  }, [testID, accessibilityLabel, leading, extra]);
}
//# sourceMappingURL=modifiers.js.map