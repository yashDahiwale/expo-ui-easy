import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Icon as UniversalIcon } from '@expo/ui';
import { Icon, Row, Shape } from '@expo/ui/jetpack-compose';
import {
  Button, ElevatedButton, FilledIconButton, FilledTonalButton, FilledTonalIconButton,
  IconButton, OutlinedButton, OutlinedIconButton, RNHostView, TextButton, Host, Text,
} from 'expo-ui-easy';
import { ICONS } from '../icons';
import { Case, Page, Readout } from '../ui';

export default function ButtonsDemo() {
  const [presses, setPresses] = useState(0);
  const press = () => setPresses((n) => n + 1);

  return (
    <Page>
      <Case title="The five Expo variants" note="Same names as Expo UI. Each press must bump the counter by exactly 1. A plain string child is wrapped in a Compose Text for you.">
        <Button onPress={press}>Button (filled)</Button>
        <FilledTonalButton onPress={press}>FilledTonalButton</FilledTonalButton>
        <OutlinedButton onPress={press}>OutlinedButton</OutlinedButton>
        <ElevatedButton onPress={press}>ElevatedButton</ElevatedButton>
        <TextButton onPress={press}>TextButton</TextButton>
        <Readout text={`presses=${presses}`} />
      </Case>

      <Case title="startIcon" note="Icon is a Compose element. With an icon the start padding shrinks to the Material3 value.">
        <Button onPress={press} startIcon={<Icon source={ICONS.add} size={18} />}>Add item</Button>
        <FilledTonalButton onPress={press} startIcon={<Icon source={ICONS.favorite} size={18} />}>Favorite</FilledTonalButton>
        <OutlinedButton onPress={press} startIcon={<Icon source={ICONS.star} size={18} />}>Star</OutlinedButton>
        <TextButton onPress={press} startIcon={<Icon source={ICONS.check} size={18} />}>Done</TextButton>
      </Case>

      <Case title="endIcon" note="Trailing icon: the end padding shrinks instead.">
        <Button onPress={press} endIcon={<Icon source={ICONS.arrowForward} size={18} />}>Continue</Button>
        <ElevatedButton onPress={press} endIcon={<Icon source={ICONS.arrowForward} size={18} />}>Next</ElevatedButton>
        <TextButton onPress={press} endIcon={<Icon source={ICONS.arrowForward} size={18} />}>Skip</TextButton>
      </Case>

      <Case title="startIcon + endIcon together">
        <OutlinedButton
          onPress={press}
          startIcon={<Icon source={ICONS.star} size={18} />}
          endIcon={<Icon source={ICONS.arrowForward} size={18} />}>
          Both sides
        </OutlinedButton>
      </Case>

      <Case
        title="Icon source 1: Material Symbols with Expo UI's universal Icon"
        note="`Icon` from '@expo/ui' with `name` from @expo/material-symbols, `size`, `color`. With no color it inherits the button's content color, including the disabled color.">
        <Button onPress={press} startIcon={<UniversalIcon name={ICONS.add} size={18} />}>Universal Icon</Button>
        <OutlinedButton onPress={press} endIcon={<UniversalIcon name={ICONS.arrowForward} size={18} accessibilityLabel="Next" />}>With accessibilityLabel</OutlinedButton>
        <Button onPress={press} disabled startIcon={<UniversalIcon name={ICONS.add} size={18} />}>Disabled: icon must dim too</Button>
      </Case>

      <Case
        title="Icon source 2: Expo UI's Compose Icon"
        note="`Icon` from '@expo/ui/jetpack-compose' with `source` (any XML vector drawable, including your own).">
        <FilledTonalButton onPress={press} startIcon={<Icon source={ICONS.favorite} size={18} />}>Compose Icon</FilledTonalButton>
      </Case>

      <Case
        title="Icon source 3: @expo/vector-icons (React Native side)"
        note="Vector icons are React Native views, so they go through RNHostView. They do NOT inherit the button's content color, so pass `color` yourself. Prefer Material Symbols for long lists: each vector icon is an extra RN view.">
        <Button
          onPress={press}
          startIcon={
            <RNHostView matchContents>
              <Ionicons name="add" size={18} color="#FFFFFF" />
            </RNHostView>
          }>
          Ionicons start
        </Button>
        <OutlinedButton
          onPress={press}
          endIcon={
            <RNHostView matchContents>
              <Ionicons name="arrow-forward" size={18} color="#6750A4" />
            </RNHostView>
          }>
          Ionicons end
        </OutlinedButton>
        <TextButton
          onPress={press}
          startIcon={
            <RNHostView matchContents>
              <Ionicons name="heart" size={18} color="#B71C1C" />
            </RNHostView>
          }>
          Colored heart
        </TextButton>
      </Case>

      <Case title="Icon tint" note="tint=null keeps the icon's own colors; a color overrides it; omitted inherits the button's content color.">
        <Button onPress={press} startIcon={<Icon source={ICONS.favorite} size={18} tint="#FFEB3B" />}>Yellow icon</Button>
        <Button onPress={press} startIcon={<Icon source={ICONS.favorite} size={18} />}>Inherited tint</Button>
      </Case>

      <Case title="Disabled (RN name)" note="Must not respond and must not bump the counter.">
        <Button onPress={press} disabled>Button</Button>
        <OutlinedButton onPress={press} disabled startIcon={<Icon source={ICONS.add} size={18} />}>Outlined + icon</OutlinedButton>
        <TextButton onPress={press} disabled>TextButton</TextButton>
      </Case>

      <Case title="Expo props: colors" note="colors is Expo's ButtonColors (containerColor, contentColor, disabledContainerColor, disabledContentColor).">
        <Button onPress={press} colors={{ containerColor: '#B71C1C', contentColor: '#FFFFFF' }}>Red container</Button>
        <OutlinedButton onPress={press} colors={{ contentColor: '#2E7D32' }}>Green content</OutlinedButton>
        <Button disabled colors={{ disabledContainerColor: '#FFCDD2', disabledContentColor: '#B71C1C' }}>Custom disabled colors</Button>
      </Case>

      <Case title="Expo props: shape + contentPadding" note="An explicit contentPadding wins over the icon default.">
        <Button
          onPress={press}
          shape={Shape.RoundedCorner({ cornerRadii: { topStart: 24, bottomEnd: 24, topEnd: 4, bottomStart: 4 } })}
          contentPadding={{ start: 32, end: 32, top: 12, bottom: 12 }}>
          Leaf shape
        </Button>
        <Button onPress={press} shape={Shape.Pill({})} startIcon={<Icon source={ICONS.add} size={18} />} contentPadding={{ start: 4, end: 24, top: 8, bottom: 8 }}>
          Explicit padding
        </Button>
      </Case>

      <Case title="Custom Compose children" note="Any Compose content replaces the label.">
        <FilledTonalButton onPress={press}>
          <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 6 }}>
            <Icon source={ICONS.star} size={18} tint="#E65100" />
            <Text style={{ fontWeight: '700' }} color="#4A148C">Rich label</Text>
          </Row>
        </FilledTonalButton>
      </Case>

      <Case title="Icon buttons" note="IconButton, FilledIconButton, FilledTonalIconButton, OutlinedIconButton.">
        <Host matchContents>
          <Row horizontalArrangement={{ spacedBy: 8 }}>
            <IconButton onPress={press}><Icon source={ICONS.favorite} size={24} /></IconButton>
            <FilledIconButton onPress={press}><Icon source={ICONS.add} size={24} /></FilledIconButton>
            <FilledTonalIconButton onPress={press}><Icon source={ICONS.star} size={24} /></FilledTonalIconButton>
            <OutlinedIconButton onPress={press}><Icon source={ICONS.check} size={24} /></OutlinedIconButton>
            <FilledIconButton onPress={press} disabled><Icon source={ICONS.add} size={24} /></FilledIconButton>
          </Row>
        </Host>
      </Case>

      <Case title="Layout (RN style) + testID / accessibilityLabel" note="style goes to the auto-created Host. TalkBack should read 'Full width'.">
        <Button onPress={press} style={{ alignSelf: 'stretch' }} testID="playground-button" accessibilityLabel="Full width">Full width</Button>
      </Case>
    </Page>
  );
}
