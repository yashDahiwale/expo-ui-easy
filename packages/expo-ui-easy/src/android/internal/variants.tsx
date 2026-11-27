import { memo, type ComponentProps, type FC, type JSXElementConstructor, type MemoExoticComponent, type ReactNode } from 'react';
import { copyStatics, type Statics } from './statics';

type AnyComponent = JSXElementConstructor<any>;

/** One entry per variant: the (already wrapped) component that renders it. */
export type VariantMap = Readonly<Record<string, AnyComponent>>;

/**
 * Props of a variant family as a discriminated union: one member per variant, carrying that variant's own
 * props. The default variant may omit the discriminant; every other variant must name itself.
 */
export type VariantProps<Prop extends string, Default extends string, V extends VariantMap> = {
  [K in keyof V & string]: Omit<ComponentProps<V[K]>, Prop> &
    (K extends Default ? { [P in Prop]?: K } : { [P in Prop]: K });
}[keyof V & string];

/** A variant family: a single component whose `Prop` prop selects the native component. */
export type VariantComponent<
  Prop extends string,
  Default extends string,
  V extends VariantMap,
  S = {},
> = MemoExoticComponent<FC<VariantProps<Prop, Default, V>>> & S;

export interface VariantOptions<Prop extends string, Default extends string, V extends VariantMap, From> {
  displayName: string;
  /** Name of the discriminating prop, e.g. `variant` or `size`. */
  prop: Prop;
  defaultVariant: Default;
  variants: V;
  /** Expo component whose static sub-components (`.Icon`, `.Label`, ...) the family exposes. */
  staticsFrom?: From;
}

/**
 * Builds one public component out of several Expo components that differ only in look (filled / outlined / ...).
 * The discriminating prop is consumed here and never reaches the native component. An unknown value
 * falls back to the default variant so a stale JS value cannot crash the screen.
 */
export function createVariants<
  const Prop extends string,
  const Default extends string & keyof V,
  const V extends VariantMap,
  From extends object = {},
>(options: VariantOptions<Prop, Default, V, From>): VariantComponent<Prop, Default, V, Statics<From>> {
  const { displayName, prop, defaultVariant, variants, staticsFrom } = options;
  const fallback = variants[defaultVariant] as FC<Record<string, unknown>>;

  function Variant(props: Record<string, unknown>): ReactNode {
    const { [prop]: variant, ...rest } = props;
    const Selected = ((typeof variant === 'string' ? variants[variant] : undefined) ?? fallback) as FC<
      Record<string, unknown>
    >;
    return <Selected {...rest} />;
  }
  Variant.displayName = displayName;

  const component = memo(Variant);
  component.displayName = displayName;
  if (staticsFrom !== undefined) copyStatics(staticsFrom, component);
  return component as unknown as VariantComponent<Prop, Default, V, Statics<From>>;
}
