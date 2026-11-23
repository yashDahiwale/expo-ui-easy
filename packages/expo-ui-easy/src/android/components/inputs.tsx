import { memo, type ComponentProps, type FC, type MemoExoticComponent, type ReactNode } from 'react';
import * as Expo from '@expo/ui/jetpack-compose';
import { mapTextInputAliases } from '../internal/text-input';
import type { NativeProps } from '../internal/types';
import { copyStatics, wrap, type Statics } from '../internal/wrap';

// --- Text fields ------------------------------------------------------------------------
type ExpoTextField = typeof Expo.TextField | typeof Expo.OutlinedTextField;
const TEXT_FIELD_RENAME = { onChangeText: 'onValueChange' } as const;

/** React Native TextInput names that exist in Expo's TextField under another name or as a slot. */
interface TextInputAliases {
  /** Called with the new text. Expo: `onValueChange`. */
  onChangeText?: (text: string) => void;
  /** Placeholder string, rendered in the `TextField.Placeholder` slot. */
  placeholder?: string;
  /** Hides the text (Expo: `visualTransformation="password"`). */
  secureTextEntry?: boolean;
  /** `true` allows several lines, `false` forces one (Expo: `singleLine`). Unset keeps Expo's default. */
  multiline?: boolean;
  /** `false` makes the field read-only (Expo: `readOnly`). */
  editable?: boolean;
}

export type TextFieldProps<C extends ExpoTextField = typeof Expo.TextField> = Omit<
  NativeProps<ComponentProps<C>, typeof TEXT_FIELD_RENAME>,
  'onChangeText'
> &
  TextInputAliases;

type TextFieldComponent<C extends ExpoTextField> = MemoExoticComponent<FC<TextFieldProps<C>>> & Statics<C>;

function createTextField<C extends ExpoTextField>(Native: C, displayName: string): TextFieldComponent<C> {
  const Base = wrap(Native as unknown as typeof Expo.TextField, { displayName, rename: TEXT_FIELD_RENAME });
  const BaseLoose = Base as unknown as FC<Record<string, unknown>>;
  const Placeholder = (Native as unknown as { Placeholder: FC<{ children: ReactNode }> }).Placeholder;

  function Field(props: Record<string, unknown>): ReactNode {
    const { placeholder, secureTextEntry, multiline, editable, children, ...rest } = props as {
      placeholder?: string;
      secureTextEntry?: boolean;
      multiline?: boolean;
      editable?: boolean;
      children?: ReactNode;
    } & Record<string, unknown>;
    // Aliases first so that an explicit Expo prop (singleLine, readOnly, ...) always wins.
    const aliased = mapTextInputAliases({ secureTextEntry, multiline, editable });
    return (
      <BaseLoose {...aliased} {...rest}>
        {placeholder !== undefined ? (
          <Placeholder>
            <Expo.Text>{placeholder}</Expo.Text>
          </Placeholder>
        ) : null}
        {children}
      </BaseLoose>
    );
  }
  Field.displayName = displayName;
  const field = memo(Field);
  field.displayName = displayName;
  copyStatics(Native, field);
  return field as unknown as TextFieldComponent<C>;
}

export const TextField = createTextField(Expo.TextField, 'TextField');
export const OutlinedTextField = createTextField(Expo.OutlinedTextField, 'OutlinedTextField');
export type OutlinedTextFieldProps = TextFieldProps<typeof Expo.OutlinedTextField>;
