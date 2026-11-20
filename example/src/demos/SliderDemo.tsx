import { useState } from 'react';
import { Box } from '@expo/ui/jetpack-compose';
import { background, clip, Shapes, size } from '@expo/ui/jetpack-compose/modifiers';
import { Slider } from 'expo-ui-easy';
import { Case, Page, Readout } from '../ui';

const fmt = (n: number): string => n.toFixed(2);

export default function SliderDemo() {
  const [continuous, setContinuous] = useState(0.3);
  const [stepped, setStepped] = useState(5);
  const [finished, setFinished] = useState<number | null>(null);
  const [limited, setLimited] = useState(0.5);
  const [colored, setColored] = useState(0.6);
  const [custom, setCustom] = useState(0.5);

  return (
    <Page>
      <Case title="value + onValueChange" note="Drag. onValueChange fires continuously (Expo's name, which already matches RN).">
        <Slider value={continuous} onValueChange={setContinuous} />
        <Readout text={`value=${fmt(continuous)}`} />
      </Case>

      <Case
        title="min, max, steps, onValueChangeFinished"
        note="Expo's naming: steps = number of positions BETWEEN min and max, so 9 gives integers 0..10. onValueChangeFinished has no value argument, so read it from state.">
        <Slider
          value={stepped}
          min={0}
          max={10}
          steps={9}
          onValueChange={setStepped}
          onValueChangeFinished={() => setFinished(stepped)}
        />
        <Readout text={`value=${stepped}  atFinish=${finished === null ? '-' : String(finished)}`} />
      </Case>

      <Case title="lowerLimit 0.2 / upperLimit 0.8" note="The track spans the full range but the thumb must stop at 0.2 and 0.8.">
        <Slider value={limited} lowerLimit={0.2} upperLimit={0.8} onValueChange={setLimited} />
        <Readout text={`value=${fmt(limited)}`} />
      </Case>

      <Case title="disabled (RN name)" note="Must not respond to drags.">
        <Slider value={0.4} disabled />
      </Case>

      <Case title="Expo prop: colors (SliderColors)">
        <Slider
          value={colored}
          onValueChange={setColored}
          colors={{ thumbColor: '#1565C0', activeTrackColor: '#1565C0', inactiveTrackColor: '#BBDEFB' }}
        />
      </Case>

      <Case title="Expo sub-components: Slider.Thumb" note="A Compose Box as the thumb. Check it draws and still drags.">
        <Slider value={custom} onValueChange={setCustom}>
          <Slider.Thumb>
            <Box modifiers={[size(24, 24), clip(Shapes.Circle), background('#E65100')]} />
          </Slider.Thumb>
        </Slider>
      </Case>

      <Case title="Layout: style (RN)" note="Width through the Host's style. This one is 60% wide.">
        <Slider value={continuous} onValueChange={setContinuous} style={{ width: '60%' }} />
      </Case>
    </Page>
  );
}
