import { memo, useMemo, type ComponentProps, type ReactNode } from 'react';
import * as Expo from '@expo/ui/jetpack-compose';
import { wrap } from '../internal/wrap';

const BaseText = wrap(Expo.Text, {
  displayName: 'Text',
  rename: { numberOfLines: 'maxLines' },
  hostStyleProp: 'containerStyle',
});

type BaseTextProps = ComponentProps<typeof BaseText>;
type TextStyleProp = NonNullable<BaseTextProps['style']>;

/** A Material3 type role: `displayLarge`, `titleMedium`, `bodySmall`, `labelLarge`, ... */
export type TextVariant = NonNullable<TextStyleProp['typography']>;

export type TextProps = BaseTextProps & {
  /**
   * Material3 type role. Shorthand for `style={{ typography: variant }}`: every key in `style`
   * (including `typography`) overrides it.
   */
  variant?: TextVariant;
};

function TextImpl({ variant, style, ...rest }: TextProps): ReactNode {
  const merged = useMemo(
    () => (variant === undefined ? style : ({ typography: variant, ...style } as TextStyleProp)),
    [variant, style],
  );
  return <BaseText {...rest} {...(merged === undefined ? null : { style: merged })} />;
}
TextImpl.displayName = 'Text';

/** Expo's `Text`. `numberOfLines` is React Native's name for `maxLines`; `variant` picks a Material3 type role. */
export const Text = memo(TextImpl);
