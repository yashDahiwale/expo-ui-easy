"use strict";

import { memo } from 'react';
import * as Expo from '@expo/ui/jetpack-compose';
import { mapTextInputAliases } from "../internal/text-input.js";
import { createVariants } from "../internal/variants.js";
import { wrap } from "../internal/wrap.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const TEXT_FIELD_RENAME = {
  onChangeText: 'onValueChange'
};

/** React Native TextInput names that exist in Expo's TextField under another name or as a slot. */

function createTextField(Native, displayName) {
  const Base = wrap(Native, {
    displayName,
    rename: TEXT_FIELD_RENAME
  });
  const BaseLoose = Base;
  const Placeholder = Native.Placeholder;
  function Field(props) {
    const {
      placeholder,
      secureTextEntry,
      multiline,
      editable,
      children,
      ...rest
    } = props;
    // Aliases first so that an explicit Expo prop (singleLine, readOnly, ...) always wins.
    const aliased = mapTextInputAliases({
      secureTextEntry,
      multiline,
      editable
    });
    return /*#__PURE__*/_jsxs(BaseLoose, {
      ...aliased,
      ...rest,
      children: [placeholder !== undefined ? /*#__PURE__*/_jsx(Placeholder, {
        children: /*#__PURE__*/_jsx(Expo.Text, {
          children: placeholder
        })
      }) : null, children]
    });
  }
  Field.displayName = displayName;
  const field = /*#__PURE__*/memo(Field);
  field.displayName = displayName;
  return field;
}

/**
 * One text field, two Material3 looks: `filled` (default, Expo's `TextField`) or `outlined` (`OutlinedTextField`).
 * The slots (`TextField.Label`, `.LeadingIcon`, `.SupportingText`, ...) are Expo's and work with both.
 */
export const TextField = createVariants({
  displayName: 'TextField',
  prop: 'variant',
  defaultVariant: 'filled',
  variants: {
    filled: createTextField(Expo.TextField, 'TextField'),
    outlined: createTextField(Expo.OutlinedTextField, 'TextField')
  },
  staticsFrom: Expo.TextField
});
//# sourceMappingURL=inputs.js.map