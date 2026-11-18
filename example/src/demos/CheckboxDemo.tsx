import { useState } from "react";
import { Column } from "@expo/ui/jetpack-compose";
import { Checkbox, Host, Text } from "expo-ui-easy";
import { Case, Page, Readout } from "../ui";

const LABELS = ["Milk", "Eggs", "Bread"] as const;

export default function CheckboxDemo() {
  const [basic, setBasic] = useState(false);
  const [colored, setColored] = useState(true);
  const [items, setItems] = useState([true, false, true]);
  const toggle = (index: number, value: boolean) =>
    setItems((prev) => prev.map((v, i) => (i === index ? value : v)));

  return (
    <Page>
      <Case
        title="value + onValueChange (RN names)"
        note="Tap it; the readout must follow."
      >
        <Checkbox value={basic} onValueChange={setBasic} />
        <Readout text={`value=${String(basic)}`} />
      </Case>

      <Case title="disabled (RN name)" note="Neither may respond.">
        <Checkbox value={false} disabled />
        <Checkbox value disabled />
      </Case>

      <Case
        title="Expo prop: colors (CheckboxColors)"
        note="checkedColor, uncheckedColor, checkmarkColor, plus disabled variants."
      >
        <Checkbox
          value={colored}
          onValueChange={setColored}
          colors={{
            checkedColor: "#2E7D32",
            uncheckedColor: "#B71C1C",
            checkmarkColor: "#FFEB3B",
          }}
        />
      </Case>

      <Case title="Checklist in ONE Host">
        <Host matchContents>
          <Column verticalArrangement={{ spacedBy: 6 }}>
            {LABELS.map((label, index) => (
              <Column key={label}>
                <Text>{label}</Text>
                <Checkbox
                  value={items[index] ?? false}
                  onValueChange={(v) => toggle(index, v)}
                />
              </Column>
            ))}
          </Column>
        </Host>
        <Readout
          text={`checked=${items.filter(Boolean).length}/${items.length}`}
        />
      </Case>
    </Page>
  );
}
