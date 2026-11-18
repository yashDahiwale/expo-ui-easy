import { useState } from "react";
import { Text } from "expo-ui-easy";
import { ActionButton, Case, Page, Readout } from "../ui";

const LONG =
  "Jetpack Compose renders this text natively. It is deliberately long so that truncation, wrapping and alignment can be checked on a small screen without any guesswork.";

/** Text that must wrap needs a bounded width, so these cases use a vertical-only matchContents. */
const WRAP_HOST = { matchContents: { vertical: true } } as const;
const FULL_WIDTH = { width: "100%" } as const;

export default function TextDemo() {
  const [lines, setLines] = useState(2);

  return (
    <Page>
      <Case
        title="Expo TextStyle: weight, style, decoration"
        note="`style` is Expo's TextStyle (fontWeight '700', textDecoration 'lineThrough', ...). The text color is a separate Expo prop: `color`."
      >
        <Text style={{ fontSize: 18 }}>Regular 18</Text>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>Bold 700</Text>
        <Text style={{ fontSize: 18, fontStyle: "italic" }}>Italic</Text>
        <Text style={{ fontSize: 18, textDecoration: "underline" }}>
          Underline
        </Text>
        <Text style={{ fontSize: 18, textDecoration: "lineThrough" }}>
          Line through
        </Text>
      </Case>

      <Case title="color, background, letterSpacing">
        <Text style={{ fontSize: 18 }} color="#B71C1C">
          Red text
        </Text>
        <Text style={{ fontSize: 18, background: "#6750A4" }} color="#FFFFFF">
          White on purple
        </Text>
        <Text style={{ fontSize: 18, letterSpacing: 4 }}>SPACED OUT</Text>
      </Case>

      <Case
        title="shadow"
        note="Expo's style.shadow { color, offsetX, offsetY, blurRadius }."
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            shadow: {
              color: "#00000066",
              offsetX: 3,
              offsetY: 3,
              blurRadius: 4,
            },
          }}
          color="#6750A4"
        >
          Shadow
        </Text>
      </Case>

      <Case title="fontFamily" note="Compose built-in families.">
        <Text style={{ fontSize: 18, fontFamily: "serif" }}>serif</Text>
        <Text style={{ fontSize: 18, fontFamily: "monospace" }}>monospace</Text>
        <Text style={{ fontSize: 18, fontFamily: "cursive" }}>cursive</Text>
      </Case>

      <Case
        title="numberOfLines (RN name) + Expo overflow"
        note="Use the buttons to change the line limit. 'ellipsis' shows … ; 'clip' cuts the text."
      >
        <Text
          numberOfLines={lines}
          overflow="ellipsis"
          containerStyle={FULL_WIDTH}
          hostProps={WRAP_HOST}
        >
          {LONG}
        </Text>
        <Text
          numberOfLines={lines}
          overflow="clip"
          containerStyle={FULL_WIDTH}
          hostProps={WRAP_HOST}
        >
          {LONG}
        </Text>
        <Readout text={`numberOfLines=${lines}`} />
        <ActionButton
          label="Fewer lines"
          tone="neutral"
          onPress={() => setLines((n) => Math.max(1, n - 1))}
        />
        <ActionButton
          label="More lines"
          tone="neutral"
          onPress={() => setLines((n) => n + 1)}
        />
      </Case>

      <Case title="textAlign + lineHeight, minLines, softWrap">
        <Text
          style={{ textAlign: "center", lineHeight: 28, fontSize: 16 }}
          containerStyle={FULL_WIDTH}
          hostProps={WRAP_HOST}
        >
          {LONG}
        </Text>
        <Text
          style={{ textAlign: "end", fontSize: 16 }}
          containerStyle={FULL_WIDTH}
          hostProps={WRAP_HOST}
        >
          Right aligned
        </Text>
        <Text minLines={3} containerStyle={FULL_WIDTH} hostProps={WRAP_HOST}>
          Reserves three lines
        </Text>
        <Text
          softWrap={false}
          numberOfLines={1}
          containerStyle={FULL_WIDTH}
          hostProps={WRAP_HOST}
        >
          {LONG}
        </Text>
      </Case>

      <Case
        title="Expo style.typography (Material3 scale)"
        note="Base style from the Material3 typography; other style keys override single values (last one is displayLarge forced to 20)."
      >
        <Text style={{ typography: "headlineMedium" }}>headlineMedium</Text>
        <Text style={{ typography: "titleLarge" }}>titleLarge</Text>
        <Text style={{ typography: "bodyMedium" }}>bodyMedium</Text>
        <Text style={{ typography: "labelSmall" }}>labelSmall</Text>
        <Text style={{ typography: "displayLarge", fontSize: 20 }}>
          displayLarge @ 20
        </Text>
      </Case>

      <Case
        title="Nested Text spans"
        note="Inner Text elements become styled spans of one paragraph."
      >
        <Text
          style={{ fontSize: 18 }}
          containerStyle={FULL_WIDTH}
          hostProps={WRAP_HOST}
        >
          Plain,{" "}
          <Text style={{ fontWeight: "700" }} color="#6750A4">
            bold purple
          </Text>
          , then{" "}
          <Text style={{ fontStyle: "italic", textDecoration: "underline" }}>
            italic underlined
          </Text>{" "}
          text.
        </Text>
      </Case>
    </Page>
  );
}
