import { memo, type ComponentProps, type FC, type MemoExoticComponent, type ReactNode } from 'react';
import * as Expo from '@expo/ui/jetpack-compose';
import { mapTextInputAliases } from '../internal/text-input';
import type { NativeProps } from '../internal/types';
import { createVariants } from '../internal/variants';
import { wrap } from '../internal/wrap';

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

type ExpoTextField = typeof Expo.TextField | typeof Expo.OutlinedTextField;
type BaseTextFieldProps<C extends ExpoTextField> = Omit<
  NativeProps<ComponentProps<C>, typeof TEXT_FIELD_RENAME>,
  'onChangeText'
> &
  TextInputAliases;

function createTextField<C extends ExpoTextField>(
  Native: C,
  displayName: string,
): MemoExoticComponent<FC<BaseTextFieldProps<C>>> {
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
  return field as unknown as MemoExoticComponent<FC<BaseTextFieldProps<C>>>;
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
    outlined: createTextField(Expo.OutlinedTextField, 'TextField'),
  },
  staticsFrom: Expo.TextField,
});
export type TextFieldProps = ComponentProps<typeof TextField>;
