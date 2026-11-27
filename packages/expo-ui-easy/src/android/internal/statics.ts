import type { FunctionComponent } from 'react';

/** The static sub-components of an Expo component (`Switch.ThumbContent`, `Slider.Thumb`, ...), minus the function basics. */
export type Statics<C> = Omit<C, keyof FunctionComponent<unknown> | 'prototype'>;

/** Carries over static sub-components (`Switch.ThumbContent`, `Slider.Thumb`, ...) from an Expo component. */
export function copyStatics(from: object, to: object): void {
  const source = from as Record<string, unknown>;
  const target = to as Record<string, unknown>;
  for (const key of Object.keys(source)) {
    if (key !== 'displayName') target[key] = source[key];
  }
}
