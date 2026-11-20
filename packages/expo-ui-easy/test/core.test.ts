import { describe, expect, it } from 'vitest';
import { translateProps } from '../src/android/internal/translate';
import { iconContentPadding } from '../src/android/internal/button-padding';
import { defined } from '../src/android/internal/utils';

describe('defined', () => {
  it('drops undefined but keeps null, 0, false and empty strings', () => {
    expect(defined({ a: undefined, b: null, c: 0, d: false, e: '' })).toEqual({ b: null, c: 0, d: false, e: '' });
  });
});

describe('translateProps', () => {
  it('renames onPress and inverts disabled', () => {
    const fn = () => {};
    expect(translateProps({ onPress: fn, disabled: true })).toEqual({ onClick: fn, enabled: false });
    expect(translateProps({ disabled: false })).toEqual({ enabled: true });
  });
  it('applies per-component renames', () => {
    const fn = () => {};
    expect(translateProps({ onValueChange: fn, value: true }, { onValueChange: 'onCheckedChange' })).toEqual({
      onCheckedChange: fn,
      value: true,
    });
    expect(translateProps({ numberOfLines: 2 }, { numberOfLines: 'maxLines' })).toEqual({ maxLines: 2 });
  });
  it('leaves Expo props untouched (onValueChange stays when it is not renamed, e.g. Slider)', () => {
    const colors = { thumbColor: 'red' };
    expect(translateProps({ colors, min: 0, onValueChange: 1 })).toEqual({ colors, min: 0, onValueChange: 1 });
  });
  it('removes wrapper-only props and undefined values', () => {
    expect(
      translateProps({ testID: 'a', accessibilityLabel: 'b', hostProps: {}, style: {}, modifiers: [], x: undefined, y: 1 }),
    ).toEqual({ y: 1 });
  });
  it('passes Expo\'s own `style` through when the Host style lives in `containerStyle` (Text, DropdownMenu)', () => {
    const style = { fontSize: 12 };
    expect(translateProps({ style, containerStyle: { width: 1 }, y: 1 }, {}, 'containerStyle')).toEqual({ style, y: 1 });
  });
  it('keeps children', () => {
    expect(translateProps({ children: 'x' })).toEqual({ children: 'x' });
  });
});

describe('iconContentPadding', () => {
  it('is undefined without icons so Expo defaults apply', () => {
    expect(iconContentPadding('standard', false, false)).toBeUndefined();
    expect(iconContentPadding('text', false, false)).toBeUndefined();
  });
  it('shrinks the padding on the icon side (Button)', () => {
    expect(iconContentPadding('standard', true, false)).toEqual({ start: 16, end: 24, top: 8, bottom: 8 });
    expect(iconContentPadding('standard', false, true)).toEqual({ start: 24, end: 16, top: 8, bottom: 8 });
    expect(iconContentPadding('standard', true, true)).toEqual({ start: 16, end: 16, top: 8, bottom: 8 });
  });
  it('uses the text-button values for TextButton', () => {
    expect(iconContentPadding('text', true, false)).toEqual({ start: 12, end: 16, top: 8, bottom: 8 });
  });
});

import { mapTextInputAliases } from '../src/android/internal/text-input';

describe('mapTextInputAliases', () => {
  it('produces nothing when no RN alias is set, so Expo defaults stay', () => {
    expect(mapTextInputAliases({ secureTextEntry: undefined, multiline: undefined, editable: undefined })).toEqual({});
    expect(mapTextInputAliases({ secureTextEntry: false, multiline: undefined, editable: true })).toEqual({});
  });
  it('maps secureTextEntry, multiline and editable', () => {
    expect(mapTextInputAliases({ secureTextEntry: true, multiline: undefined, editable: undefined })).toEqual({ visualTransformation: 'password' });
    expect(mapTextInputAliases({ secureTextEntry: undefined, multiline: true, editable: undefined })).toEqual({ singleLine: false });
    expect(mapTextInputAliases({ secureTextEntry: undefined, multiline: false, editable: undefined })).toEqual({ singleLine: true });
    expect(mapTextInputAliases({ secureTextEntry: undefined, multiline: undefined, editable: false })).toEqual({ readOnly: true });
  });
});

import { isNativeViewAvailable, missingNativeViews } from '../src/android/support/native-support';

describe('isNativeViewAvailable', () => {
  const g = globalThis as { expo?: unknown };
  it('assumes available when the runtime cannot answer', () => {
    delete g.expo;
    expect(isNativeViewAvailable('RangeSliderView')).toBe(true);
  });
  it('reports a view as missing when getViewConfig returns null or throws', () => {
    g.expo = { getViewConfig: (_m: string, v?: string) => (v === 'SwitchView' ? { validAttributes: {} } : null) };
    expect(isNativeViewAvailable('SwitchView')).toBe(true);
    expect(isNativeViewAvailable('RangeSliderView')).toBe(false);
    expect(missingNativeViews(['SwitchView', 'RangeSliderView', 'TopAppBarView'])).toEqual(['RangeSliderView', 'TopAppBarView']);
    g.expo = { getViewConfig: () => { throw new Error('x'); } };
    expect(isNativeViewAvailable('SwitchView')).toBe(false);
    delete g.expo;
  });
});

import { defaultKeyExtractor, isNearEnd } from '../src/android/recipes/list-utils';
import { formatTopOffenders, getHostStats, registerAutoHost, subscribeHostStats } from '../src/android/internal/host-stats';

describe('list utils', () => {
  it('defaultKeyExtractor follows FlatList: key, then id, then index', () => {
    expect(defaultKeyExtractor({ key: 'k', id: 'i' }, 3)).toBe('k');
    expect(defaultKeyExtractor({ id: 7 }, 3)).toBe('7');
    expect(defaultKeyExtractor({ name: 'x' }, 3)).toBe('3');
    expect(defaultKeyExtractor('plain', 5)).toBe('5');
    expect(defaultKeyExtractor(null, 0)).toBe('0');
  });
  it('isNearEnd counts rows from the end', () => {
    expect(isNearEnd(95, 100, 4)).toBe(false);
    expect(isNearEnd(96, 100, 4)).toBe(true);
    expect(isNearEnd(99, 100, 0.5)).toBe(true); // a fractional / tiny threshold still means "the last row"
    expect(isNearEnd(98, 100, 0.5)).toBe(false);
    expect(isNearEnd(0, 0, 4)).toBe(false);
  });
});

describe('host stats', () => {
  it('counts auto Hosts per component, notifies subscribers and cleans up', () => {
    const seen: number[] = [];
    const unsubscribe = subscribeHostStats(() => seen.push(getHostStats().autoHosts));
    const a1 = registerAutoHost('Switch');
    const a2 = registerAutoHost('Switch');
    const b = registerAutoHost('Text');
    expect(getHostStats().autoHosts).toBe(3);
    expect(getHostStats().byComponent).toEqual([{ name: 'Switch', count: 2 }, { name: 'Text', count: 1 }]);
    expect(formatTopOffenders(getHostStats(), 1)).toBe('Switch x2');
    a1(); a2(); b();
    expect(getHostStats()).toEqual({ autoHosts: 0, byComponent: [] });
    expect(seen.length).toBe(6);
    unsubscribe();
  });
  it('returns the same snapshot object while nothing changes (needed by useSyncExternalStore)', () => {
    expect(getHostStats()).toBe(getHostStats());
  });
});
