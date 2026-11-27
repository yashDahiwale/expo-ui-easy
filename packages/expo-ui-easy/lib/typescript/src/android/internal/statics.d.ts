import type { FunctionComponent } from 'react';
/** The static sub-components of an Expo component (`Switch.ThumbContent`, `Slider.Thumb`, ...), minus the function basics. */
export type Statics<C> = Omit<C, keyof FunctionComponent<unknown> | 'prototype'>;
/** Carries over static sub-components (`Switch.ThumbContent`, `Slider.Thumb`, ...) from an Expo component. */
export declare function copyStatics(from: object, to: object): void;
//# sourceMappingURL=statics.d.ts.map