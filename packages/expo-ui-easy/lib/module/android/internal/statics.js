"use strict";

/** The static sub-components of an Expo component (`Switch.ThumbContent`, `Slider.Thumb`, ...), minus the function basics. */

/** Carries over static sub-components (`Switch.ThumbContent`, `Slider.Thumb`, ...) from an Expo component. */
export function copyStatics(from, to) {
  const source = from;
  const target = to;
  for (const key of Object.keys(source)) {
    if (key !== 'displayName') target[key] = source[key];
  }
}
//# sourceMappingURL=statics.js.map