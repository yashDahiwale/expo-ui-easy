import { useState } from 'react';
import { Row } from '@expo/ui/jetpack-compose';
import { Host, RadioButton, Text } from 'expo-ui-easy';
import { Case, Page, Readout } from '../ui';

const OPTIONS = ['Small', 'Medium', 'Large'] as const;

export default function RadioButtonDemo() {
  const [selected, setSelected] = useState(1);

  return (
    <Page>
      <Case title="Group in ONE Host: selected + onPress (RN name)" note="Selecting one must deselect the others.">
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
        <Readout text={`selected=${OPTIONS[selected] ?? '?'}`} />
      </Case>

      <Case title="disabled (RN name)" note="Neither may respond.">
        <RadioButton selected={false} disabled />
        <RadioButton selected disabled />
      </Case>

      <Case title="Expo prop: colors (RadioButtonColors)">
        <RadioButton selected colors={{ selectedColor: '#1565C0', unselectedColor: '#90A4AE' }} />
        <RadioButton selected={false} colors={{ selectedColor: '#1565C0', unselectedColor: '#B71C1C' }} />
      </Case>

      <Case title="Standalone (auto Host)" note="Each creates its own Compose root. Fine for a few, wasteful in lists.">
        <RadioButton selected={selected === 0} onPress={() => setSelected(0)} />
        <RadioButton selected={selected === 1} onPress={() => setSelected(1)} />
      </Case>
    </Page>
  );
}
