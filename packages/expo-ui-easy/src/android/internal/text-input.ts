export interface TextInputAliasInputs {
  secureTextEntry: boolean | undefined;
  multiline: boolean | undefined;
  editable: boolean | undefined;
}

export interface TextInputAliasOutput {
  visualTransformation?: 'password';
  singleLine?: boolean;
  readOnly?: true;
}

/**
 * Maps React Native TextInput props onto Expo's TextField props. Only props the caller set are
 * produced, so Expo's defaults stay untouched (e.g. an unset `multiline` leaves `singleLine` alone).
 */
export function mapTextInputAliases(input: TextInputAliasInputs): TextInputAliasOutput {
  const out: TextInputAliasOutput = {};
  if (input.secureTextEntry === true) out.visualTransformation = 'password';
  if (input.multiline !== undefined) out.singleLine = !input.multiline;
  if (input.editable === false) out.readOnly = true;
  return out;
}
