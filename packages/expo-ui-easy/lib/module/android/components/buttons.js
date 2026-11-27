"use strict";

import { memo, useMemo } from 'react';
import * as Expo from '@expo/ui/jetpack-compose';
import { iconContentPadding } from "../internal/button-padding.js";
import { defined } from "../internal/utils.js";
import { createVariants } from "../internal/variants.js";
import { wrap } from "../internal/wrap.js";

/** What the Expo button family adds on top of its Expo props. */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function createButton(Native, displayName, family) {
  const Base = wrap(Native, {
    displayName
  });
  function ButtonWithIcons(props) {
    const {
      startIcon,
      endIcon,
      children,
      contentPadding,
      ...rest
    } = props;
    const hasStart = startIcon != null;
    const hasEnd = endIcon != null;
    const padding = useMemo(() => contentPadding ?? iconContentPadding(family, hasStart, hasEnd), [contentPadding, hasStart, hasEnd]);
    // A plain string label is a convenience: Compose needs a Text element.
    const label = typeof children === 'string' ? /*#__PURE__*/_jsx(Expo.Text, {
      children: children
    }) : children;
    return /*#__PURE__*/_jsx(Base, {
      ...rest,
      ...defined({
        contentPadding: padding
      }),
      children: hasStart || hasEnd ? /*#__PURE__*/_jsxs(Expo.Row, {
        verticalAlignment: "center",
        horizontalArrangement: {
          spacedBy: 8
        },
        children: [startIcon, label, endIcon]
      }) : label
    });
  }
  ButtonWithIcons.displayName = displayName;
  return /*#__PURE__*/memo(ButtonWithIcons);
}

/**
 * One button, five Material3 looks. `variant` picks the Expo component: `filled` (default, `Button`),
 * `tonal` (`FilledTonalButton`), `outlined`, `elevated` or `text`. Every variant takes the same props.
 */
export const Button = createVariants({
  displayName: 'Button',
  prop: 'variant',
  defaultVariant: 'filled',
  variants: {
    filled: createButton(Expo.Button, 'Button', 'standard'),
    tonal: createButton(Expo.FilledTonalButton, 'Button', 'standard'),
    outlined: createButton(Expo.OutlinedButton, 'Button', 'standard'),
    elevated: createButton(Expo.ElevatedButton, 'Button', 'standard'),
    text: createButton(Expo.TextButton, 'Button', 'text')
  }
});
//# sourceMappingURL=buttons.js.map