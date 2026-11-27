import { useState } from 'react';
import { Button, DatePickerDialog, DateRangePicker, DateRangePickerDialog, DateTimePicker, TimePickerDialog } from 'expo-ui-easy';
import { PreviewSection, StateRow } from '../ui';

const day = (d: Date | null | undefined): string => (d ? d.toDateString() : '?');

export function DateTimePickerDemo() {
  const [picked, setPicked] = useState('-');
  return (
    <PreviewSection title="Inline picker" description="Dates arrive as Date objects.">
      <DateTimePicker onDateSelected={(d) => setPicked(d ? d.toDateString() : 'none')} />
      <StateRow text={`picked=${picked}`} />
    </PreviewSection>
  );
}

export function DatePickerDialogDemo() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState('-');
  return (
    <PreviewSection
      title="Date dialog"
      code={`{open ? <DatePickerDialog onDismissRequest={close} onDateSelected={(date) => ...} /> : null}`}>
      <Button onPress={() => setOpen(true)}>Pick a date</Button>
      {open ? (
        <DatePickerDialog
          onDismissRequest={() => setOpen(false)}
          onDateSelected={(d) => { setOpen(false); setPicked(d.toDateString()); }}
        />
      ) : null}
      <StateRow text={`picked=${picked}`} />
    </PreviewSection>
  );
}

export function TimePickerDialogDemo() {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState('-');
  return (
    <PreviewSection title="Time dialog" description="`is24Hour` switches between 12 and 24 hour clocks.">
      <Button onPress={() => setOpen(true)}>Pick a time</Button>
      {open ? (
        <TimePickerDialog
          onDismissRequest={() => setOpen(false)}
          is24Hour
          onDateSelected={(d) => { setOpen(false); setPicked(d.toTimeString().slice(0, 5)); }}
        />
      ) : null}
      <StateRow text={`picked=${picked}`} />
    </PreviewSection>
  );
}

export function DateRangePickerDemo() {
  const [range, setRange] = useState('-');
  return (
    <PreviewSection title="Inline range picker" description="onDateRangeSelected receives { start, end } dates." requires={['DateRangePickerView']}>
      <DateRangePicker onDateRangeSelected={(r) => setRange(`${day(r.start)} to ${day(r.end)}`)} />
      <StateRow text={`range=${range}`} />
    </PreviewSection>
  );
}

export function DateRangePickerDialogDemo() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState('-');
  return (
    <PreviewSection title="Date range dialog" requires={['DateRangePickerDialogView']}>
      <Button onPress={() => setOpen(true)}>Pick a date range</Button>
      {open ? (
        <DateRangePickerDialog
          onDismissRequest={() => setOpen(false)}
          onDateRangeSelected={(r) => { setOpen(false); setRange(`${day(r.start)} to ${day(r.end)}`); }}
        />
      ) : null}
      <StateRow text={`range=${range}`} />
    </PreviewSection>
  );
}
