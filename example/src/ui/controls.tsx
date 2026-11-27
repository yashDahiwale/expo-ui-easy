import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { radius, space, TOUCH, useTheme } from '../theme';

/** Small RN control used by demos to drive the component under test (never a library component). */
export function ActionButton(props: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'primary' | 'danger' | 'neutral';
  style?: StyleProp<ViewStyle>;
}): ReactNode {
  const t = useTheme();
  const { label, onPress, disabled = false, tone = 'primary', style } = props;
  const bg = tone === 'primary' ? t.accent : tone === 'danger' ? t.danger : t.well;
  const fg = tone === 'neutral' ? t.text : t.onAccent;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: t.border }}
      style={({ pressed }) => [styles.action, { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.85 : 1 }, style]}>
      <Text style={{ color: fg, fontWeight: '600', fontSize: 14 }}>{label}</Text>
    </Pressable>
  );
}

/** Selectable pill (filters, strategy pickers). */
export function Chip(props: {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}): ReactNode {
  const t = useTheme();
  const { label, selected = false, disabled = false, onPress, style, textStyle } = props;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.chip,
        { borderColor: selected ? t.accent : t.border, backgroundColor: selected ? t.accentContainer : 'transparent' },
        disabled && styles.disabled,
        style,
      ]}>
      <Text style={[{ color: selected ? t.onAccentContainer : t.text, fontSize: 13, fontWeight: selected ? '700' : '500' }, textStyle]}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Collapsible, monospaced snippet. */
export function PreviewCode({ code }: { code: string }): ReactNode {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={open ? 'Hide code' : 'Show code'}
        onPress={() => setOpen((v) => !v)}
        hitSlop={8}
        style={styles.codeToggle}>
        <Text style={{ color: t.accent, fontSize: 13, fontWeight: '600' }}>{open ? 'Hide code' : 'Show code'}</Text>
      </Pressable>
      {open ? (
        <View style={[styles.code, { backgroundColor: t.well, borderColor: t.border }]}>
          <Text selectable style={[styles.codeText, { color: t.text }]}>{code}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: { minHeight: 40, borderRadius: radius.md, paddingHorizontal: space.lg, paddingVertical: space.sm, alignItems: 'center', justifyContent: 'center' },
  chip: { minHeight: 36, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: space.md, paddingVertical: space.xs + 2, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.4 },
  codeToggle: { minHeight: TOUCH - 8, justifyContent: 'center', alignSelf: 'flex-start' },
  code: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md, padding: space.md },
  codeText: { fontFamily: 'monospace', fontSize: 12, lineHeight: 18 },
});
