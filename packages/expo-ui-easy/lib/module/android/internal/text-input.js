"use strict";

/**
 * Maps React Native TextInput props onto Expo's TextField props. Only props the caller set are
 * produced, so Expo's defaults stay untouched (e.g. an unset `multiline` leaves `singleLine` alone).
 */
export function mapTextInputAliases(input) {
  const out = {};
  if (input.secureTextEntry === true) out.visualTransformation = 'password';
  if (input.multiline !== undefined) out.singleLine = !input.multiline;
  if (input.editable === false) out.readOnly = true;
  return out;
}
//# sourceMappingURL=text-input.js.map