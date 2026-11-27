import { type ComponentProps, type FC, type JSXElementConstructor, type MemoExoticComponent } from 'react';
import { type Statics } from './statics.js';
type AnyComponent = JSXElementConstructor<any>;
/** One entry per variant: the (already wrapped) component that renders it. */
export type VariantMap = Readonly<Record<string, AnyComponent>>;
/**
 * Props of a variant family as a discriminated union: one member per variant, carrying that variant's own
 * props. The default variant may omit the discriminant; every other variant must name itself.
 */
export type VariantProps<Prop extends string, Default extends string, V extends VariantMap> = {
    [K in keyof V & string]: Omit<ComponentProps<V[K]>, Prop> & (K extends Default ? {
        [P in Prop]?: K;
    } : {
        [P in Prop]: K;
    });
}[keyof V & string];
/** A variant family: a single component whose `Prop` prop selects the native component. */
export type VariantComponent<Prop extends string, Default extends string, V extends VariantMap, S = {}> = MemoExoticComponent<FC<VariantProps<Prop, Default, V>>> & S;
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
export declare function createVariants<const Prop extends string, const Default extends string & keyof V, const V extends VariantMap, From extends object = {}>(options: VariantOptions<Prop, Default, V, From>): VariantComponent<Prop, Default, V, Statics<From>>;
export {};
//# sourceMappingURL=variants.d.ts.map