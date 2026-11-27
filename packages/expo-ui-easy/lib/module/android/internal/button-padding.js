"use strict";

/**
 * Material3 shrinks the padding on the side that holds an icon so the icon sits closer to
 * the edge (Button 24 -> 16dp, TextButton 12 -> 12dp with 16dp on the other side).
 * Returns `undefined` when there is no icon, so Expo's own default applies.
 */
export function iconContentPadding(family, hasStartIcon, hasEndIcon) {
  if (!hasStartIcon && !hasEndIcon) return undefined;
  const iconSide = family === 'standard' ? 16 : 12;
  const otherSide = family === 'standard' ? 24 : 16;
  return {
    start: hasStartIcon ? iconSide : otherSide,
    end: hasEndIcon ? iconSide : otherSide,
    top: 8,
    bottom: 8
  };
}
//# sourceMappingURL=button-padding.js.map