import { useState } from 'react';
import { FilterChip, Host, Text } from 'expo-ui-easy';

export function Example() {
  const [selected, setSelected] = useState(false);
  return (
    <Host matchContents>
      <FilterChip selected={selected} onPress={() => setSelected((v) => !v)}>
        <FilterChip.Label><Text>Vegetarian</Text></FilterChip.Label>
      </FilterChip>
    </Host>
  );
}
