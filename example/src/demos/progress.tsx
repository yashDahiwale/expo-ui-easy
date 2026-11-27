import { useState } from 'react';
import {
  CircularProgressIndicator, CircularWavyProgressIndicator, LinearProgressIndicator, LinearWavyProgressIndicator,
  LoadingIndicator, Slider, Switch, size,
} from 'expo-ui-easy';
import { PreviewSection, StateRow } from '../ui';

/** Shared controls: drag the slider and flip the switch to drive every indicator on the screen. */
function useProgress() {
  const [progress, setProgress] = useState(0.35);
  const [determinate, setDeterminate] = useState(true);
  const controls = (
    <PreviewSection title="Controls" description="Drag the slider and flip the switch: the indicators below follow. Omitting `progress` gives the endless (indeterminate) animation, as in Expo UI.">
      <Slider value={progress} onValueChange={setProgress} />
      <Switch value={determinate} onValueChange={setDeterminate} />
      <StateRow text={`progress=${progress.toFixed(2)}  ${determinate ? 'determinate' : 'indeterminate'}`} />
    </PreviewSection>
  );
  return { progress, determinate, controls };
}

export function CircularProgressIndicatorDemo() {
  const { progress, determinate, controls } = useProgress();
  return (
    <>
      {controls}
      <PreviewSection
        title="Circular"
        description="Expo props: progress, color, trackColor, strokeWidth, strokeCap, gapSize. There is no size prop: use the size() modifier."
        code={`<CircularProgressIndicator progress={0.4} modifiers={[size(48, 48)]} />`}>
        {determinate ? (
          <CircularProgressIndicator progress={progress} modifiers={[size(48, 48)]} />
        ) : (
          <CircularProgressIndicator modifiers={[size(48, 48)]} />
        )}
        <CircularProgressIndicator progress={progress} color="#2E7D32" trackColor="#C8E6C9" strokeWidth={8} strokeCap="butt" gapSize={6} modifiers={[size(64, 64)]} />
      </PreviewSection>
    </>
  );
}

export function LinearProgressIndicatorDemo() {
  const { progress, determinate, controls } = useProgress();
  return (
    <>
      {controls}
      <PreviewSection title="Linear" description="Fills the width. Expo props: progress, color, trackColor, strokeCap, gapSize, drawStopIndicator." code={`<LinearProgressIndicator progress={0.4} />`}>
        {determinate ? <LinearProgressIndicator progress={progress} /> : <LinearProgressIndicator />}
        <LinearProgressIndicator progress={progress} color="#B71C1C" trackColor="#FFCDD2" strokeCap="butt" gapSize={4} drawStopIndicator={{ color: '#B71C1C', stopSize: 6 }} />
      </PreviewSection>
    </>
  );
}

export function CircularWavyProgressIndicatorDemo() {
  const { progress, controls } = useProgress();
  return (
    <>
      {controls}
      <PreviewSection title="Circular wavy" description="Material3 Expressive. Extra props: amplitude, wavelength, waveSpeed.">
        <CircularWavyProgressIndicator progress={progress} modifiers={[size(64, 64)]} />
        <CircularWavyProgressIndicator progress={progress} amplitude={0.4} wavelength={20} waveSpeed={30} color="#6750A4" modifiers={[size(64, 64)]} />
      </PreviewSection>
    </>
  );
}

export function LinearWavyProgressIndicatorDemo() {
  const { progress, controls } = useProgress();
  return (
    <>
      {controls}
      <PreviewSection title="Linear wavy" description="Extra props: amplitude, wavelength, waveSpeed, stopSize.">
        <LinearWavyProgressIndicator progress={progress} />
        <LinearWavyProgressIndicator progress={progress} amplitude={0.8} wavelength={24} waveSpeed={20} stopSize={6} color="#1565C0" />
      </PreviewSection>
    </>
  );
}

export function LoadingIndicatorDemo() {
  return (
    <>
      <PreviewSection
        title="Default"
        description="An expressive morphing loader."
        code={`<LoadingIndicator />\n<LoadingIndicator color="#E65100" />`}>
        <LoadingIndicator />
        <LoadingIndicator color="#E65100" />
      </PreviewSection>
      <PreviewSection
        title="Contained"
        description={'`variant="contained"` puts the loader in a container and adds `containerColor`.'}
        code={`<LoadingIndicator variant="contained" containerColor="#EDE9FE" color="#6750A4" />`}>
        <LoadingIndicator variant="contained" />
        <LoadingIndicator variant="contained" containerColor="#EDE9FE" color="#6750A4" />
      </PreviewSection>
    </>
  );
}
