import { useState } from 'react';
import { AssistChip, FilterChip, Host, Icon, InputChip, Row, SuggestionChip, Text } from 'expo-ui-easy';
import { ICONS } from '../icons';
import { PreviewSection, StateRow } from '../ui';

const SIZES = ['S', 'M', 'L'] as const;

export function AssistChipDemo() {
  const [taps, setTaps] = useState(0);
  return (
    <PreviewSection
      title="Assist"
      description="`onPress` and `disabled` are the React Native names (Expo: onClick, enabled). Slots: Label, LeadingIcon, TrailingIcon."
      code={`<AssistChip onPress={onPress}>\n  <AssistChip.Label><Text>Assist</Text></AssistChip.Label>\n</AssistChip>`}>
      <Host matchContents>
        <Row horizontalArrangement={{ spacedBy: 8 }}>
          <AssistChip onPress={() => setTaps((n) => n + 1)}>
            <AssistChip.Label><Text>Assist</Text></AssistChip.Label>
            <AssistChip.LeadingIcon><Icon source={ICONS.star} size={18} /></AssistChip.LeadingIcon>
          </AssistChip>
          <AssistChip onPress={() => setTaps((n) => n + 1)} disabled>
            <AssistChip.Label><Text>Disabled</Text></AssistChip.Label>
          </AssistChip>
        </Row>
      </Host>
      <StateRow text={`taps=${taps}`} />
    </PreviewSection>
  );
}

export function FilterChipDemo() {
  const [filters, setFilters] = useState<readonly boolean[]>([true, false, false]);
  return (
    <PreviewSection title="Selected" description="Tapping toggles `selected`. The state lives in React.">
      <Host matchContents>
        <Row horizontalArrangement={{ spacedBy: 8 }}>
          {SIZES.map((label, i) => (
            <FilterChip key={label} selected={filters[i] ?? false} onPress={() => setFilters((prev) => prev.map((v, j) => (j === i ? !v : v)))}>
              <FilterChip.Label><Text>{label}</Text></FilterChip.Label>
            </FilterChip>
          ))}
        </Row>
      </Host>
      <StateRow text={`filters=${filters.map((v) => (v ? '1' : '0')).join('')}`} />
    </PreviewSection>
  );
}

export function InputChipDemo() {
  const [selected, setSelected] = useState(true);
  return (
    <PreviewSection title="Selected input chip" description="Slots: Label, Avatar, LeadingIcon, TrailingIcon.">
      <Host matchContents>
        <InputChip selected={selected} onPress={() => setSelected((v) => !v)}>
          <InputChip.Label><Text>Input</Text></InputChip.Label>
        </InputChip>
      </Host>
      <StateRow text={`selected=${String(selected)}`} />
    </PreviewSection>
  );
}

export function SuggestionChipDemo() {
  const [taps, setTaps] = useState(0);
  return (
    <PreviewSection title="Suggestion">
      <Host matchContents>
        <SuggestionChip onPress={() => setTaps((n) => n + 1)}>
          <SuggestionChip.Label><Text>Suggestion</Text></SuggestionChip.Label>
        </SuggestionChip>
      </Host>
      <StateRow text={`taps=${taps}`} />
    </PreviewSection>
  );
}
