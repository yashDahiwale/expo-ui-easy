import { memo, useMemo, type ComponentProps, type ReactNode } from 'react';
import * as Expo from '@expo/ui/jetpack-compose';
import { iconContentPadding, type ButtonFamily } from '../internal/button-padding';
import { defined } from '../internal/utils';
import type { NativeProps } from '../internal/types';
import { createVariants } from '../internal/variants';
import { wrap } from '../internal/wrap';

/** What the Expo button family adds on top of its Expo props. */
interface IconSlots {
  /**
   * Compose element shown before the label, e.g.
   * `<Icon source={require('./add.xml')} size={18} />`. Material3 sizes button icons at 18dp.
   * When set (and `contentPadding` is not), the padding follows the Material3 icon spec.
   */
  startIcon?: ReactNode;
  /** Compose element shown after the label. Same rules as `startIcon`. */
  endIcon?: ReactNode;
}

type BaseButtonProps = NativeProps<ComponentProps<typeof Expo.Button>> & IconSlots;

type ExpoButton = typeof Expo.Button;

function createButton(Native: ExpoButton, displayName: string, family: ButtonFamily) {
  const Base = wrap(Native, { displayName });

  function ButtonWithIcons(props: BaseButtonProps): ReactNode {
    const { startIcon, endIcon, children, contentPadding, ...rest } = props;
    const hasStart = startIcon != null;
    const hasEnd = endIcon != null;

    const padding = useMemo(
      () => contentPadding ?? iconContentPadding(family, hasStart, hasEnd),
      [contentPadding, hasStart, hasEnd],
    );
    // A plain string label is a convenience: Compose needs a Text element.
    const label = typeof children === 'string' ? <Expo.Text>{children}</Expo.Text> : children;

    return (
      <Base {...rest} {...defined({ contentPadding: padding })}>
        {hasStart || hasEnd ? (
          <Expo.Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 8 }}>
            {startIcon}
            {label}
            {endIcon}
          </Expo.Row>
        ) : (
          label
        )}
      </Base>
    );
  }

  ButtonWithIcons.displayName = displayName;
  return memo(ButtonWithIcons);
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
    text: createButton(Expo.TextButton, 'Button', 'text'),
  },
});
export type ButtonProps = ComponentProps<typeof Button>;
