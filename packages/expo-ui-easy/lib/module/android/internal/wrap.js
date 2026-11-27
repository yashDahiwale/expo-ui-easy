"use strict";

import { memo, useMemo } from 'react';
import { NativeContent } from "../host/host.js";
import { useComposeModifiers } from "./modifiers.js";
import { copyStatics } from "./statics.js";
import { translateProps } from "./translate.js";

/**
 * Components whose Expo props already have their own `style` (Text, DropdownMenu) must say
 * `hostStyleProp: 'containerStyle'`, so Expo's `style` still reaches Expo. Forgetting it is a compile error.
 */

/** A wrapped Expo UI component: same name, same props, same statics (e.g. `Switch.ThumbContent`). */
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Wraps an Expo UI Jetpack Compose component so that it:
 *  - works standalone in a React Native tree (creates a `Host` unless already inside one),
 *  - accepts the RN names for props both worlds share (`onPress`, `disabled`, `testID`, ...),
 *  - keeps EVERY Expo UI prop, with Expo's name and type, and Expo's static sub-components.
 */
export function wrap(Expo, options) {
  const {
    displayName,
    rename,
    hostDefaults,
    leadingModifiers
  } = options;
  const hostStyleProp = options.hostStyleProp ?? 'style';
  const Inner = Expo;
  function Wrapped(props) {
    const testID = props['testID'];
    const accessibilityLabel = props['accessibilityLabel'];
    const hostProps = props['hostProps'];
    const style = props[hostStyleProp];
    const userModifiers = props['modifiers'];
    const modifiers = useComposeModifiers({
      testID,
      accessibilityLabel,
      leading: leadingModifiers,
      extra: userModifiers
    });
    const mergedHostProps = useMemo(() => hostDefaults?.hostProps ? {
      ...hostDefaults.hostProps,
      ...hostProps
    } : hostProps, [hostProps]);
    const hostStyle = useMemo(() => hostDefaults?.style ? [hostDefaults.style, style] : style, [style]);
    const native = translateProps(props, rename, hostStyleProp);
    if (modifiers !== undefined) native['modifiers'] = modifiers;
    return /*#__PURE__*/_jsx(NativeContent, {
      name: displayName,
      style: hostStyle,
      hostProps: mergedHostProps,
      children: /*#__PURE__*/_jsx(Inner, {
        ...native
      })
    });
  }
  Wrapped.displayName = displayName;
  const wrapped = /*#__PURE__*/memo(Wrapped);
  wrapped.displayName = displayName;
  copyStatics(Expo, wrapped);
  return wrapped;
}
//# sourceMappingURL=wrap.js.map