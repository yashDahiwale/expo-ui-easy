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
export declare function mapTextInputAliases(input: TextInputAliasInputs): TextInputAliasOutput;
//# sourceMappingURL=text-input.d.ts.map