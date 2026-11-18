import { useState } from "react";
import {
  AssistChip,
  Button,
  Column,
  ExtendedFloatingActionButton,
  FilterChip,
  FloatingActionButton,
  Host,
  Icon,
  IconToggleButton,
  InputChip,
  LargeFloatingActionButton,
  MultiChoiceSegmentedButtonRow,
  OutlinedIconToggleButton,
  FilledIconToggleButton,
  RangeSlider,
  Row,
  SegmentedButton,
  SingleChoiceSegmentedButtonRow,
  SmallFloatingActionButton,
  SplitButtonLayout,
  SplitButtonLeadingButton,
  SplitButtonTrailingButton,
  SuggestionChip,
  Text,
  ToggleButton,
  TriStateCheckbox,
} from "expo-ui-easy";
import { ICONS } from "../icons";
import { Case, Page, Readout } from "../ui";

const SIZES = ["S", "M", "L"] as const;
const FORMATS = ["Bold", "Italic", "Underline"] as const;

export default function SelectionDemo() {
  const [taps, setTaps] = useState(0);
  const tap = () => setTaps((n) => n + 1);
  const [filters, setFilters] = useState<readonly boolean[]>([
    true,
    false,
    false,
  ]);
  const [input, setInput] = useState(true);
  const [bold, setBold] = useState(false);
  const [star, setStar] = useState(true);
  const [fav, setFav] = useState(false);
  const [check, setCheck] = useState(false);
  const [size, setSize] = useState(1);
  const [formats, setFormats] = useState<readonly boolean[]>([
    true,
    false,
    false,
  ]);
  const [tri, setTri] = useState<"on" | "off" | "indeterminate">(
    "indeterminate"
  );
  const [range, setRange] = useState({ start: 0.2, endInclusive: 0.7 });
  const [split, setSplit] = useState(false);
  const [expanded, setExpanded] = useState(true);

  return (
    <Page>
      <Case
        title="Chips"
        note="onPress / disabled are the RN names (Expo: onClick / enabled). Slots: Label, LeadingIcon, TrailingIcon, Avatar, Icon."
      >
        <Host matchContents>
          <Row horizontalArrangement={{ spacedBy: 8 }}>
            <AssistChip onPress={tap}>
              <AssistChip.Label>
                <Text>Assist</Text>
              </AssistChip.Label>
              <AssistChip.LeadingIcon>
                <Icon source={ICONS.star} size={18} />
              </AssistChip.LeadingIcon>
            </AssistChip>
            <SuggestionChip onPress={tap}>
              <SuggestionChip.Label>
                <Text>Suggestion</Text>
              </SuggestionChip.Label>
            </SuggestionChip>
            <AssistChip onPress={tap} disabled>
              <AssistChip.Label>
                <Text>Disabled</Text>
              </AssistChip.Label>
            </AssistChip>
          </Row>
        </Host>
        <Readout text={`taps=${taps}`} />
      </Case>

      <Case
        title="FilterChip (selected) + InputChip"
        note="Tapping toggles selection. State lives in React."
      >
        <Host matchContents>
          <Row horizontalArrangement={{ spacedBy: 8 }}>
            {SIZES.map((label, i) => (
              <FilterChip
                key={label}
                selected={filters[i] ?? false}
                onPress={() =>
                  setFilters((prev) => prev.map((v, j) => (j === i ? !v : v)))
                }
              >
                <FilterChip.Label>
                  <Text>{label}</Text>
                </FilterChip.Label>
              </FilterChip>
            ))}
            <InputChip selected={input} onPress={() => setInput((v) => !v)}>
              <InputChip.Label>
                <Text>Input</Text>
              </InputChip.Label>
            </InputChip>
          </Row>
        </Host>
        <Readout
          text={`filters=${filters
            .map((v) => (v ? "1" : "0"))
            .join("")} input=${String(input)}`}
        />
      </Case>

      <Case
        title="Toggle buttons (checked + onValueChange, RN-style name)"
        note="Expo's onCheckedChange is exposed as onValueChange."
      >
        <Host matchContents>
          <Row
            horizontalArrangement={{ spacedBy: 8 }}
            verticalAlignment="center"
          >
            <ToggleButton checked={bold} onValueChange={setBold}>
              <Text>Bold</Text>
            </ToggleButton>
            <IconToggleButton checked={star} onValueChange={setStar}>
              <Icon source={ICONS.star} size={24} />
            </IconToggleButton>
            <FilledIconToggleButton checked={fav} onValueChange={setFav}>
              <Icon source={ICONS.favorite} size={24} />
            </FilledIconToggleButton>
            <OutlinedIconToggleButton checked={check} onValueChange={setCheck}>
              <Icon source={ICONS.check} size={24} />
            </OutlinedIconToggleButton>
          </Row>
        </Host>
        <Readout
          text={`bold=${String(bold)} star=${String(star)} fav=${String(
            fav
          )} check=${String(check)}`}
        />
      </Case>

      <Case title="Segmented buttons: single choice" note="selected + onPress.">
        <Host matchContents>
          <SingleChoiceSegmentedButtonRow>
            {SIZES.map((label, i) => (
              <SegmentedButton
                key={label}
                selected={size === i}
                onPress={() => setSize(i)}
              >
                <SegmentedButton.Label>
                  <Text>{label}</Text>
                </SegmentedButton.Label>
              </SegmentedButton>
            ))}
          </SingleChoiceSegmentedButtonRow>
        </Host>
        <Readout text={`size=${SIZES[size] ?? "?"}`} />
      </Case>

      <Case
        title="Segmented buttons: multi choice"
        note="checked + onValueChange (Expo: onCheckedChange)."
      >
        <Host matchContents>
          <MultiChoiceSegmentedButtonRow>
            {FORMATS.map((label, i) => (
              <SegmentedButton
                key={label}
                checked={formats[i] ?? false}
                onValueChange={(v) =>
                  setFormats((prev) => prev.map((x, j) => (j === i ? v : x)))
                }
              >
                <SegmentedButton.Label>
                  <Text>{label}</Text>
                </SegmentedButton.Label>
              </SegmentedButton>
            ))}
          </MultiChoiceSegmentedButtonRow>
        </Host>
        <Readout
          text={`formats=${formats.map((v) => (v ? "1" : "0")).join("")}`}
        />
      </Case>

      <Case
        title="TriStateCheckbox"
        note="state: 'on' | 'off' | 'indeterminate'. Tap cycles."
      >
        <TriStateCheckbox
          state={tri}
          onPress={() =>
            setTri((s) =>
              s === "on" ? "off" : s === "off" ? "indeterminate" : "on"
            )
          }
        />
        <Readout text={`state=${tri}`} />
      </Case>

      <Case
        title="RangeSlider"
        requires={["RangeSliderView"]}
        note="Two thumbs. trackRange / startValue / endValue / steps as in Expo; onValueChange receives the range."
      >
        <RangeSlider
          startValue={range.start}
          endValue={range.endInclusive}
          trackRange={{ start: 0, endInclusive: 1 }}
          onValueChange={setRange}
        />
        <Readout
          text={`start=${range.start.toFixed(
            2
          )} end=${range.endInclusive.toFixed(2)}`}
        />
      </Case>

      <Case
        title="Floating action buttons"
        note="FloatingActionButton, Small, Large, Extended (expanded collapses to icon only). onPress is the RN name."
      >
        <Host matchContents>
          <Row
            horizontalArrangement={{ spacedBy: 12 }}
            verticalAlignment="center"
          >
            <SmallFloatingActionButton onPress={tap}>
              <Icon source={ICONS.add} size={20} />
            </SmallFloatingActionButton>
            <FloatingActionButton onPress={tap}>
              <Icon source={ICONS.add} size={24} />
            </FloatingActionButton>
            <LargeFloatingActionButton onPress={tap}>
              <Icon source={ICONS.add} size={36} />
            </LargeFloatingActionButton>
          </Row>
        </Host>
        <Host matchContents>
          <ExtendedFloatingActionButton
            expanded={expanded}
            onPress={() => setExpanded((v) => !v)}
          >
            <ExtendedFloatingActionButton.Icon>
              <Icon source={ICONS.add} size={24} />
            </ExtendedFloatingActionButton.Icon>
            <ExtendedFloatingActionButton.Text>
              <Text>Compose</Text>
            </ExtendedFloatingActionButton.Text>
          </ExtendedFloatingActionButton>
        </Host>
      </Case>

      <Case
        title="SplitButtonLayout"
        requires={[
          "SplitButtonLayoutView",
          "SplitButtonLeadingButtonView",
          "SplitButtonTrailingButtonView",
        ]}
        note="Leading button acts, trailing button toggles (checked). The slot parts SplitButtonLeadingButton / SplitButtonTrailingButton keep Expo's own props (onClick, onCheckedChange)."
      >
        <Host matchContents>
          <Column>
            <SplitButtonLayout>
              <SplitButtonLayout.LeadingButton>
                <SplitButtonLeadingButton onClick={tap}>
                  <Text>Save</Text>
                </SplitButtonLeadingButton>
              </SplitButtonLayout.LeadingButton>
              <SplitButtonLayout.TrailingButton>
                <SplitButtonTrailingButton
                  checked={split}
                  onCheckedChange={setSplit}
                >
                  <Icon source={ICONS.arrowForward} size={20} />
                </SplitButtonTrailingButton>
              </SplitButtonLayout.TrailingButton>
            </SplitButtonLayout>
          </Column>
        </Host>
        <Readout text={`trailing checked=${String(split)}`} />
        <Button onPress={tap}>Counts taps too</Button>
      </Case>
    </Page>
  );
}
