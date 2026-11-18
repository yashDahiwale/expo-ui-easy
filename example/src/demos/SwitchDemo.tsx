import { useState } from "react";
import { Box, Column } from "@expo/ui/jetpack-compose";
import {
  background,
  clip,
  Shapes,
  size,
} from "@expo/ui/jetpack-compose/modifiers";
import { Host, Switch, Text } from "expo-ui-easy";
import { Case, Page, Readout } from "../ui";

export default function SwitchDemo() {
  const [basic, setBasic] = useState(false);
  const [calls, setCalls] = useState(0);
  const [colored, setColored] = useState(true);
  const [thumb, setThumb] = useState(true);
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [c, setC] = useState(true);

  return (
    <Page>
      <Case
        title="value + onValueChange (RN names)"
        note="Tap it. The readout must follow, and the callback count must go up by exactly 1 per tap. Expo's onCheckedChange is exposed as onValueChange."
      >
        <Switch
          value={basic}
          onValueChange={(next) => {
            setBasic(next);
            setCalls((n) => n + 1);
          }}
        />
        <Readout
          text={`value=${String(basic)}  onValueChange calls=${calls}`}
        />
      </Case>

      <Case
        title="disabled (RN name)"
        note="Neither switch may respond. Expo's `enabled` is exposed as `disabled`."
      >
        <Switch value={false} disabled />
        <Switch value disabled />
      </Case>

      <Case
        title="Expo prop: colors (SwitchColors)"
        note="All Material3 slots are available: checked/unchecked thumb, track and border, icon, plus the disabled variants."
      >
        <Switch
          value={colored}
          onValueChange={setColored}
          colors={{
            checkedThumbColor: "#7C3AED",
            checkedTrackColor: "#EDE9FE",
            checkedBorderColor: "#7C3AED",
            uncheckedThumbColor: "#9CA3AF",
            uncheckedTrackColor: "#F3F4F6",
            uncheckedBorderColor: "#D1D5DB",
          }}
        />
      </Case>

      <Case
        title="Expo sub-component: Switch.ThumbContent"
        note="Compose content inside the thumb, exactly like Expo UI."
      >
        <Switch
          value={thumb}
          onValueChange={setThumb}
          colors={{
            checkedThumbColor: "#7C3AED",
            checkedTrackColor: "#EDE9FE",
          }}
        >
          <Switch.ThumbContent>
            <Box
              modifiers={[
                size(Switch.DefaultIconSize, Switch.DefaultIconSize),
                clip(Shapes.Circle),
                background(thumb ? "#FFFFFF" : "#E5E7EB"),
              ]}
            />
          </Switch.ThumbContent>
        </Switch>
      </Case>

      <Case
        title="testID + accessibilityLabel"
        note="With TalkBack on it should read 'Airplane mode'."
      >
        <Switch
          value={basic}
          onValueChange={setBasic}
          testID="playground-switch"
          accessibilityLabel="Airplane mode"
        />
      </Case>

      <Case
        title="Layout: style (RN)"
        note="style applies to the auto-created Host. This one is pushed to the right."
      >
        <Switch
          value={basic}
          onValueChange={setBasic}
          style={{ alignSelf: "flex-end" }}
        />
      </Case>

      <Case
        title="Three switches in ONE Host"
        note="One Compose root for all of them. Use this shape for settings screens and lists."
      >
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
        <Readout
          text={`wifi=${String(a)} bluetooth=${String(b)} location=${String(
            c
          )}`}
        />
      </Case>
    </Page>
  );
}
