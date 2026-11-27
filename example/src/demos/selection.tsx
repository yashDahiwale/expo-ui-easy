import { useState } from 'react';
import {
  Box, Checkbox, Column, Host, Icon, IconToggleButton, MultiChoiceSegmentedButtonRow, RadioButton, Row,
  SegmentedButton, Shapes, SingleChoiceSegmentedButtonRow, Switch, SyncSwitch, Text, ToggleButton, TriStateCheckbox,
  background, clip, size, useNativeState,
} from 'expo-ui-easy';
import { ICONS } from '../icons';
import { ActionButton, PreviewSection, StateRow } from '../ui';

const SIZES = ['S', 'M', 'L'] as const;
const FORMATS = ['Bold', 'Italic', 'Underline'] as const;
const ICON_TOGGLE_VARIANTS = ['standard', 'filled', 'outlined'] as const;
const onOff = (flags: readonly boolean[]): string => flags.map((v) => (v ? '1' : '0')).join('');

export function SwitchDemo() {
  const [basic, setBasic] = useState(false);
  const [calls, setCalls] = useState(0);
  const [colored, setColored] = useState(true);
  const [thumb, setThumb] = useState(true);
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(true);

  return (
    <>
      <PreviewSection
        title="Value and onValueChange"
        description="Expo's onCheckedChange is exposed as onValueChange. The callback count rises by exactly one per tap."
        code={`<Switch value={on} onValueChange={setOn} />`}>
        <Switch
          value={basic}
          onValueChange={(next) => {
            setBasic(next);
            setCalls((n) => n + 1);
          }}
        />
        <StateRow text={`value=${String(basic)}  onValueChange calls=${calls}`} />
      </PreviewSection>

      <PreviewSection title="Disabled" description="`disabled` is React Native's name for Expo's inverted `enabled`.">
        <Switch value={false} disabled />
        <Switch value disabled />
      </PreviewSection>

      <PreviewSection title="Colors" description="Every Material3 slot: checked and unchecked thumb, track and border, icon, plus the disabled variants.">
        <Switch
          value={colored}
          onValueChange={setColored}
          colors={{
            checkedThumbColor: '#7C3AED',
            checkedTrackColor: '#EDE9FE',
            checkedBorderColor: '#7C3AED',
            uncheckedThumbColor: '#9CA3AF',
            uncheckedTrackColor: '#F3F4F6',
            uncheckedBorderColor: '#D1D5DB',
          }}
        />
      </PreviewSection>

      <PreviewSection title="Thumb content" description="Compose content inside the thumb through Switch.ThumbContent.">
        <Switch value={thumb} onValueChange={setThumb} colors={{ checkedThumbColor: '#7C3AED', checkedTrackColor: '#EDE9FE' }}>
          <Switch.ThumbContent>
            <Box modifiers={[size(Switch.DefaultIconSize, Switch.DefaultIconSize), clip(Shapes.Circle), background(thumb ? '#FFFFFF' : '#E5E7EB')]} />
          </Switch.ThumbContent>
        </Switch>
      </PreviewSection>

      <PreviewSection title="Accessibility and layout" description="accessibilityLabel is read by TalkBack. `style` positions the auto-created Host: this switch sits on the right.">
        <Switch value={basic} onValueChange={setBasic} testID="playground-switch" accessibilityLabel="Airplane mode" style={{ alignSelf: 'flex-end' }} />
      </PreviewSection>

      <PreviewSection title="Settings in one Host" description="One Compose root for all three. Use this shape for settings screens.">
        <Host matchContents>
          <Column verticalArrangement={{ spacedBy: 8 }}>
            <Text>Wi-Fi</Text>
            <Switch value={a} onValueChange={setA} />
            <Text>Bluetooth</Text>
            <Switch value={b} onValueChange={setB} />
            <Text>Location</Text>
            <Switch value={c} onValueChange={setC} />
          </Column>
        </Host>
        <StateRow text={`wifi=${String(a)} bluetooth=${String(b)} location=${String(c)}`} />
      </PreviewSection>
    </>
  );
}

const LABELS = ['Milk', 'Eggs', 'Bread'] as const;

export function CheckboxDemo() {
  const [basic, setBasic] = useState(false);
  const [colored, setColored] = useState(true);
  const [items, setItems] = useState([true, false, true]);
  const toggle = (index: number, value: boolean) => setItems((prev) => prev.map((v, i) => (i === index ? value : v)));

  return (
    <>
      <PreviewSection title="Value and onValueChange" code={`<Checkbox value={checked} onValueChange={setChecked} />`}>
        <Checkbox value={basic} onValueChange={setBasic} />
        <StateRow text={`value=${String(basic)}`} />
      </PreviewSection>
      <PreviewSection title="Disabled">
        <Checkbox value={false} disabled />
        <Checkbox value disabled />
      </PreviewSection>
      <PreviewSection title="Colors" description="checkedColor, uncheckedColor, checkmarkColor and their disabled variants.">
        <Checkbox value={colored} onValueChange={setColored} colors={{ checkedColor: '#2E7D32', uncheckedColor: '#B71C1C', checkmarkColor: '#FFEB3B' }} />
      </PreviewSection>
      <PreviewSection title="Checklist in one Host">
        <Host matchContents>
          <Column verticalArrangement={{ spacedBy: 6 }}>
            {LABELS.map((label, index) => (
              <Row key={label} verticalAlignment="center">
                <Checkbox value={items[index] ?? false} onValueChange={(v) => toggle(index, v)} />
                <Text>{label}</Text>
              </Row>
            ))}
          </Column>
        </Host>
        <StateRow text={`checked=${items.filter(Boolean).length}/${items.length}`} />
      </PreviewSection>
    </>
  );
}

export function TriStateCheckboxDemo() {
  const [tri, setTri] = useState<'on' | 'off' | 'indeterminate'>('indeterminate');
  const [children, setChildren] = useState([true, false]);
  const all = children.every(Boolean);
  const none = children.every((v) => !v);
  return (
    <>
      <PreviewSection title="Cycling through the states" description="state is 'on', 'off' or 'indeterminate'. A tap cycles through them.">
        <TriStateCheckbox state={tri} onPress={() => setTri((s) => (s === 'on' ? 'off' : s === 'off' ? 'indeterminate' : 'on'))} />
        <StateRow text={`state=${tri}`} />
      </PreviewSection>
      <PreviewSection title="Parent of a list" description="The parent is indeterminate while only some children are checked.">
        <Host matchContents>
          <Column verticalArrangement={{ spacedBy: 4 }}>
            <Row verticalAlignment="center">
              <TriStateCheckbox state={all ? 'on' : none ? 'off' : 'indeterminate'} onPress={() => setChildren(children.map(() => !all))} />
              <Text>Select all</Text>
            </Row>
            {children.map((checked, index) => (
              <Row key={index} verticalAlignment="center">
                <Checkbox value={checked} onValueChange={(v) => setChildren((prev) => prev.map((x, i) => (i === index ? v : x)))} />
                <Text>{`Item ${index + 1}`}</Text>
              </Row>
            ))}
          </Column>
        </Host>
      </PreviewSection>
    </>
  );
}

const OPTIONS = ['Small', 'Medium', 'Large'] as const;

export function RadioButtonDemo() {
  const [selected, setSelected] = useState(1);
  return (
    <>
      <PreviewSection title="Group in one Host" description="`selected` and `onPress` (RN name). Selecting one deselects the others." code={`<RadioButton selected={value === 'a'} onPress={() => setValue('a')} />`}>
        <Host matchContents>
          <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 4 }}>
            {OPTIONS.map((label, index) => (
              <Row key={label} verticalAlignment="center">
                <RadioButton selected={selected === index} onPress={() => setSelected(index)} />
                <Text>{label}</Text>
              </Row>
            ))}
          </Row>
        </Host>
        <StateRow text={`selected=${OPTIONS[selected] ?? '?'}`} />
      </PreviewSection>
      <PreviewSection title="Disabled">
        <RadioButton selected={false} disabled />
        <RadioButton selected disabled />
      </PreviewSection>
      <PreviewSection title="Colors">
        <RadioButton selected colors={{ selectedColor: '#1565C0', unselectedColor: '#90A4AE' }} />
        <RadioButton selected={false} colors={{ selectedColor: '#1565C0', unselectedColor: '#B71C1C' }} />
      </PreviewSection>
      <PreviewSection title="Standalone" description="Each creates its own Compose root. Fine for a few, wasteful in lists.">
        <RadioButton selected={selected === 0} onPress={() => setSelected(0)} />
        <RadioButton selected={selected === 1} onPress={() => setSelected(1)} />
      </PreviewSection>
    </>
  );
}

export function ToggleButtonDemo() {
  const [bold, setBold] = useState(false);
  return (
    <PreviewSection title="Checked and onValueChange" description="Expo's onCheckedChange is exposed as onValueChange." code={`<ToggleButton checked={bold} onValueChange={setBold}><Text>Bold</Text></ToggleButton>`}>
      <Host matchContents>
        <ToggleButton checked={bold} onValueChange={setBold}><Text>Bold</Text></ToggleButton>
      </Host>
      <StateRow text={`bold=${String(bold)}`} />
    </PreviewSection>
  );
}

export function IconToggleButtonDemo() {
  const [checked, setChecked] = useState<readonly boolean[]>([true, false, false]);
  return (
    <PreviewSection
      title="Variants"
      description="`variant` is standard (default), filled or outlined."
      code={`<IconToggleButton checked={fav} onValueChange={setFav}>\n  <Icon source={favorite} size={24} />\n</IconToggleButton>`}>
      <Host matchContents>
        <Row horizontalArrangement={{ spacedBy: 8 }} verticalAlignment="center">
          {ICON_TOGGLE_VARIANTS.map((variant, i) => (
            <IconToggleButton
              key={variant}
              variant={variant}
              checked={checked[i] ?? false}
              onValueChange={(v) => setChecked((prev) => prev.map((x, j) => (j === i ? v : x)))}
              accessibilityLabel={`${variant} icon toggle`}>
              <Icon source={ICONS.star} size={24} />
            </IconToggleButton>
          ))}
        </Row>
      </Host>
      <StateRow text={`checked=${onOff(checked)}`} />
    </PreviewSection>
  );
}

export function SegmentedButtonDemo() {
  const [selected, setSelected] = useState(1);
  const [formats, setFormats] = useState<readonly boolean[]>([true, false, false]);
  return (
    <>
      <PreviewSection title="Single choice" description="SingleChoiceSegmentedButtonRow with `selected` and `onPress` on each segment.">
        <Host matchContents>
          <SingleChoiceSegmentedButtonRow>
            {SIZES.map((label, i) => (
              <SegmentedButton key={label} selected={selected === i} onPress={() => setSelected(i)}>
                <SegmentedButton.Label><Text>{label}</Text></SegmentedButton.Label>
              </SegmentedButton>
            ))}
          </SingleChoiceSegmentedButtonRow>
        </Host>
        <StateRow text={`size=${SIZES[selected] ?? '?'}`} />
      </PreviewSection>
      <PreviewSection title="Multiple choice" description="MultiChoiceSegmentedButtonRow with `checked` and `onValueChange` (Expo: onCheckedChange).">
        <Host matchContents>
          <MultiChoiceSegmentedButtonRow>
            {FORMATS.map((label, i) => (
              <SegmentedButton key={label} checked={formats[i] ?? false} onValueChange={(v) => setFormats((prev) => prev.map((x, j) => (j === i ? v : x)))}>
                <SegmentedButton.Label><Text>{label}</Text></SegmentedButton.Label>
              </SegmentedButton>
            ))}
          </MultiChoiceSegmentedButtonRow>
        </Host>
        <StateRow text={`formats=${onOff(formats)}`} />
      </PreviewSection>
    </>
  );
}

export function SyncSwitchDemo() {
  const isOn = useNativeState(false);
  const [read, setRead] = useState('-');
  return (
    <PreviewSection
      title="Native state"
      description="Its state is a native ObservableState (isOn), toggled on the UI thread without a JS round trip. Read it from JS with isOn.value."
      requires={['SyncSwitchView']}>
      <SyncSwitch isOn={isOn} />
      <ActionButton label="Read isOn.value" tone="neutral" onPress={() => setRead(`isOn=${String(isOn.value)}`)} />
      <StateRow text={read} />
    </PreviewSection>
  );
}
