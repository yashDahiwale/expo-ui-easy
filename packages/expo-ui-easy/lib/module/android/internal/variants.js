"use strict";

import { memo } from 'react';
import { copyStatics } from "./statics.js";

/** One entry per variant: the (already wrapped) component that renders it. */

/**
 * Props of a variant family as a discriminated union: one member per variant, carrying that variant's own
 * props. The default variant may omit the discriminant; every other variant must name itself.
 */

/** A variant family: a single component whose `Prop` prop selects the native component. */
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Builds one public component out of several Expo components that differ only in look (filled / outlined / ...).
 * The discriminating prop is consumed here and never reaches the native component. An unknown value
 * falls back to the default variant so a stale JS value cannot crash the screen.
 */
export function createVariants(options) {
  const {
    displayName,
    prop,
    defaultVariant,
    variants,
    staticsFrom
  } = options;
  const fallback = variants[defaultVariant];
  function Variant(props) {
    const {
      [prop]: variant,
      ...rest
    } = props;
    const Selected = (typeof variant === 'string' ? variants[variant] : undefined) ?? fallback;
    return /*#__PURE__*/_jsx(Selected, {
      ...rest
    });
  }
  Variant.displayName = displayName;
  const component = /*#__PURE__*/memo(Variant);
  component.displayName = displayName;
  if (staticsFrom !== undefined) copyStatics(staticsFrom, component);
  return component;
}
//# sourceMappingURL=variants.js.map