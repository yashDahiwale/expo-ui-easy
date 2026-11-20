import { useState } from 'react';
import { size } from '@expo/ui/jetpack-compose/modifiers';
import {
  CircularProgressIndicator, CircularWavyProgressIndicator, ContainedLoadingIndicator,
  LinearProgressIndicator, LinearWavyProgressIndicator, LoadingIndicator, Slider, Switch,
} from 'expo-ui-easy';
import { Case, Page, Readout } from '../ui';

export default function ProgressDemo() {
  const [progress, setProgress] = useState(0.35);
  const [determinate, setDeterminate] = useState(true);

  return (
    <Page>
      <Case title="Controls" note="Drag the slider and flip the switch: every indicator below follows. Omitting `progress` gives the endless (indeterminate) animation, as in Expo UI.">
        <Slider value={progress} onValueChange={setProgress} />
        <Switch value={determinate} onValueChange={setDeterminate} />
        <Readout text={`progress=${progress.toFixed(2)}  ${determinate ? 'determinate' : 'indeterminate'}`} />
      </Case>

      <Case title="CircularProgressIndicator" note="Expo props: progress, color, trackColor, strokeWidth, strokeCap, gapSize, modifiers. There is no size prop: use the size() modifier.">
        {determinate ? (
          <CircularProgressIndicator progress={progress} modifiers={[size(48, 48)]} />
        ) : (
          <CircularProgressIndicator modifiers={[size(48, 48)]} />
        )}
        <CircularProgressIndicator progress={progress} color="#2E7D32" trackColor="#C8E6C9" strokeWidth={8} strokeCap="butt" gapSize={6} modifiers={[size(64, 64)]} />
      </Case>

      <Case title="LinearProgressIndicator" note="Fills the width. Expo props: progress, color, trackColor, strokeCap, gapSize, drawStopIndicator.">
        {determinate ? <LinearProgressIndicator progress={progress} /> : <LinearProgressIndicator />}
        <LinearProgressIndicator progress={progress} color="#B71C1C" trackColor="#FFCDD2" strokeCap="butt" gapSize={4} drawStopIndicator={{ color: '#B71C1C', stopSize: 6 }} />
      </Case>

      <Case title="CircularWavyProgressIndicator" note="Material3 Expressive. Extra props: amplitude, wavelength, waveSpeed.">
        <CircularWavyProgressIndicator progress={progress} modifiers={[size(64, 64)]} />
        <CircularWavyProgressIndicator progress={progress} amplitude={0.4} wavelength={20} waveSpeed={30} color="#6750A4" modifiers={[size(64, 64)]} />
      </Case>

      <Case title="LinearWavyProgressIndicator" note="Extra props: amplitude, wavelength, waveSpeed, stopSize.">
        <LinearWavyProgressIndicator progress={progress} />
        <LinearWavyProgressIndicator progress={progress} amplitude={0.8} wavelength={24} waveSpeed={20} stopSize={6} color="#1565C0" />
      </Case>

      <Case title="LoadingIndicator / ContainedLoadingIndicator" note="Expressive morphing loader. The contained version adds containerColor.">
        <LoadingIndicator />
        <LoadingIndicator color="#E65100" />
        <ContainedLoadingIndicator containerColor="#EDE9FE" color="#6750A4" />
      </Case>
    </Page>
  );
}
