import { useState } from 'react';
import { Box, RangeSlider, Shapes, Slider, VerticalSlider, background, clip, size } from 'expo-ui-easy';
import { PreviewSection, StateRow } from '../ui';

const fmt = (n: number): string => n.toFixed(2);

export function SliderDemo() {
  const [continuous, setContinuous] = useState(0.3);
  const [stepped, setStepped] = useState(5);
  const [finished, setFinished] = useState<number | null>(null);
  const [limited, setLimited] = useState(0.5);
  const [colored, setColored] = useState(0.6);
  const [custom, setCustom] = useState(0.5);

  return (
    <>
      <PreviewSection title="Value and onValueChange" description="onValueChange fires continuously while you drag." code={`<Slider value={value} onValueChange={setValue} />`}>
        <Slider value={continuous} onValueChange={setContinuous} />
        <StateRow text={`value=${fmt(continuous)}`} />
      </PreviewSection>

      <PreviewSection
        title="Steps"
        description="Expo's naming: `steps` is the number of positions between min and max, so 9 gives the integers 0..10. onValueChangeFinished has no argument, so read the value from state.">
        <Slider value={stepped} min={0} max={10} steps={9} onValueChange={setStepped} onValueChangeFinished={() => setFinished(stepped)} />
        <StateRow text={`value=${stepped}  atFinish=${finished === null ? '-' : String(finished)}`} />
      </PreviewSection>

      <PreviewSection title="Limits" description="The track spans the full range but the thumb stops at 0.2 and 0.8.">
        <Slider value={limited} lowerLimit={0.2} upperLimit={0.8} onValueChange={setLimited} />
        <StateRow text={`value=${fmt(limited)}`} />
      </PreviewSection>

      <PreviewSection title="Disabled">
        <Slider value={0.4} disabled />
      </PreviewSection>

      <PreviewSection title="Colors">
        <Slider value={colored} onValueChange={setColored} colors={{ thumbColor: '#1565C0', activeTrackColor: '#1565C0', inactiveTrackColor: '#BBDEFB' }} />
      </PreviewSection>

      <PreviewSection title="Custom thumb" description="A Compose Box through Slider.Thumb.">
        <Slider value={custom} onValueChange={setCustom}>
          <Slider.Thumb>
            <Box modifiers={[size(24, 24), clip(Shapes.Circle), background('#E65100')]} />
          </Slider.Thumb>
        </Slider>
      </PreviewSection>

      <PreviewSection title="Width" description="`style` sizes the auto-created Host. This slider is 60% wide.">
        <Slider value={continuous} onValueChange={setContinuous} style={{ width: '60%' }} />
      </PreviewSection>
    </>
  );
}

export function RangeSliderDemo() {
  const [range, setRange] = useState({ start: 0.2, endInclusive: 0.7 });
  return (
    <PreviewSection
      title="Two thumbs"
      description="trackRange, startValue, endValue and steps as in Expo; onValueChange receives the range."
      requires={['RangeSliderView']}
      code={`<RangeSlider\n  startValue={range.start}\n  endValue={range.endInclusive}\n  trackRange={{ start: 0, endInclusive: 1 }}\n  onValueChange={setRange}\n/>`}>
      <RangeSlider startValue={range.start} endValue={range.endInclusive} trackRange={{ start: 0, endInclusive: 1 }} onValueChange={setRange} />
      <StateRow text={`start=${fmt(range.start)} end=${fmt(range.endInclusive)}`} />
    </PreviewSection>
  );
}

export function VerticalSliderDemo() {
  const [value, setValue] = useState(0.5);
  const host = { matchContents: { horizontal: true } } as const;
  return (
    <PreviewSection
      title="Vertical"
      description="Same props as Slider plus reverseDirection. It needs a height: give the Host one through `style`."
      requires={['VerticalSliderView']}>
      <VerticalSlider value={value} onValueChange={setValue} style={{ height: 160, alignSelf: 'flex-start' }} hostProps={host} />
      <VerticalSlider value={value} onValueChange={setValue} reverseDirection style={{ height: 160, alignSelf: 'flex-start' }} hostProps={host} />
      <StateRow text={`value=${fmt(value)} (the second one is reversed)`} />
    </PreviewSection>
  );
}
