"use strict";

import { memo, useMemo } from 'react';
import * as Expo from '@expo/ui/jetpack-compose';
import { wrap } from "../internal/wrap.js";
import { jsx as _jsx } from "react/jsx-runtime";
const BaseText = wrap(Expo.Text, {
  displayName: 'Text',
  rename: {
    numberOfLines: 'maxLines'
  },
  hostStyleProp: 'containerStyle'
});

/** A Material3 type role: `displayLarge`, `titleMedium`, `bodySmall`, `labelLarge`, ... */

function TextImpl({
  variant,
  style,
  ...rest
}) {
  const merged = useMemo(() => variant === undefined ? style : {
    typography: variant,
    ...style
  }, [variant, style]);
  return /*#__PURE__*/_jsx(BaseText, {
    ...rest,
    ...(merged === undefined ? null : {
      style: merged
    })
  });
}
TextImpl.displayName = 'Text';

/** Expo's `Text`. `numberOfLines` is React Native's name for `maxLines`; `variant` picks a Material3 type role. */
export const Text = /*#__PURE__*/memo(TextImpl);
//# sourceMappingURL=text.js.map