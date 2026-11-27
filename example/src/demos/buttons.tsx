import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Icon as UniversalIcon } from '@expo/ui';
import {
  Button, Column, FloatingActionButton, Host, Icon, IconButton, RNHostView, Row, Shape,
  SplitButtonLayout, SplitButtonLeadingButton, SplitButtonTrailingButton, Text,
} from 'expo-ui-easy';
import { ICONS } from '../icons';
import { PreviewSection, StateRow } from '../ui';
import { NativeColumn } from './shared';

const BUTTON_VARIANTS = ['filled', 'tonal', 'outlined', 'elevated', 'text'] as const;
const ICON_BUTTON_VARIANTS = ['standard', 'filled', 'tonal', 'outlined'] as const;

export function ButtonDemo() {
  const [presses, setPresses] = useState(0);
  const press = () => setPresses((n) => n + 1);

  return (
    <>
      <PreviewSection
        title="Variants"
        description="One component; `variant` picks the Material3 look. A plain string child becomes a Compose Text."
        code={`<Button onPress={onPress}>Filled</Button>\n<Button variant="tonal">Tonal</Button>\n<Button variant="outlined">Outlined</Button>\n<Button variant="elevated">Elevated</Button>\n<Button variant="text">Text</Button>`}>
        <NativeColumn>
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} onPress={press} testID={`button-${variant}`}>
              {variant === 'filled' ? 'Filled (default)' : variant[0]!.toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </NativeColumn>
        <StateRow text={`presses=${presses}`} />
      </PreviewSection>

      <PreviewSection
        title="Start and end icons"
        description="Icons are Compose elements. With an icon the padding on that side follows the Material3 spec."
        code={`<Button startIcon={<Icon source={add} size={18} />}>Add item</Button>\n<Button variant="outlined" endIcon={<Icon source={arrowForward} size={18} />}>Continue</Button>`}>
        <NativeColumn>
          <Button onPress={press} startIcon={<Icon source={ICONS.add} size={18} />}>Add item</Button>
          <Button variant="tonal" onPress={press} startIcon={<Icon source={ICONS.favorite} size={18} />}>Favorite</Button>
          <Button variant="elevated" onPress={press} endIcon={<Icon source={ICONS.arrowForward} size={18} />}>Next</Button>
          <Button variant="text" onPress={press} startIcon={<Icon source={ICONS.check} size={18} />}>Done</Button>
          <Button
            variant="outlined"
            onPress={press}
            startIcon={<Icon source={ICONS.star} size={18} />}
            endIcon={<Icon source={ICONS.arrowForward} size={18} />}>
            Both sides
          </Button>
        </NativeColumn>
      </PreviewSection>

      <PreviewSection
        title="Icon sources"
        description="Material Symbols through Expo UI's universal Icon inherit the button's content color, disabled state included. Vector icons are React Native views embedded with RNHostView: they do not inherit the color, so pass it yourself.">
        <NativeColumn>
          <Button onPress={press} startIcon={<UniversalIcon name={ICONS.add} size={18} />}>Universal Icon</Button>
          <Button disabled startIcon={<UniversalIcon name={ICONS.add} size={18} />}>Disabled: icon dims too</Button>
          <Button
            variant="outlined"
            onPress={press}
            startIcon={
              <RNHostView matchContents>
                <Ionicons name="add" size={18} color="#6750A4" />
              </RNHostView>
            }>
            Ionicons via RNHostView
          </Button>
          <Button variant="tonal" onPress={press} startIcon={<Icon source={ICONS.favorite} size={18} tint="#E65100" />}>
            Tinted icon
          </Button>
        </NativeColumn>
      </PreviewSection>

      <PreviewSection title="Disabled" description="`disabled` is React Native's name for Expo's inverted `enabled`. None of these respond.">
        <NativeColumn>
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} disabled onPress={press}>{`Disabled ${variant}`}</Button>
          ))}
        </NativeColumn>
      </PreviewSection>

      <PreviewSection title="Colors, shape and padding" description="Expo's own props. An explicit contentPadding wins over the icon default.">
        <NativeColumn>
          <Button colors={{ containerColor: '#B71C1C', contentColor: '#FFFFFF' }} onPress={press}>Red container</Button>
          <Button variant="outlined" colors={{ contentColor: '#2E7D32' }} onPress={press}>Green content</Button>
          <Button
            onPress={press}
            shape={Shape.RoundedCorner({ cornerRadii: { topStart: 24, bottomEnd: 24, topEnd: 4, bottomStart: 4 } })}
            contentPadding={{ start: 32, end: 32, top: 12, bottom: 12 }}>
            Leaf shape
          </Button>
          <Button shape={Shape.Pill({})} onPress={press} startIcon={<Icon source={ICONS.add} size={18} />} contentPadding={{ start: 4, end: 24, top: 8, bottom: 8 }}>
            Explicit padding
          </Button>
        </NativeColumn>
      </PreviewSection>

      <PreviewSection title="Custom content" description="Any Compose content replaces the label.">
        <Button variant="tonal" onPress={press}>
          <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 6 }}>
            <Icon source={ICONS.star} size={18} tint="#E65100" />
            <Text style={{ fontWeight: '700' }} color="#4A148C">Rich label</Text>
          </Row>
        </Button>
      </PreviewSection>

      <PreviewSection title="Layout and accessibility" description="`style` goes to the auto-created Host; testID and accessibilityLabel become Compose modifiers (TalkBack reads 'Full width').">
        <Button onPress={press} style={{ alignSelf: 'stretch' }} testID="playground-button" accessibilityLabel="Full width">
          Full width
        </Button>
      </PreviewSection>
    </>
  );
}

export function IconButtonDemo() {
  const [presses, setPresses] = useState(0);
  const press = () => setPresses((n) => n + 1);
  return (
    <>
      <PreviewSection
        title="Variants"
        description="`variant` picks standard, filled, tonal or outlined. Children are a Compose Icon."
        code={`<IconButton onPress={onPress}><Icon source={favorite} size={24} /></IconButton>\n<IconButton variant="filled">...</IconButton>`}>
        <Host matchContents>
          <Row horizontalArrangement={{ spacedBy: 8 }}>
            {ICON_BUTTON_VARIANTS.map((variant) => (
              <IconButton key={variant} variant={variant} onPress={press} accessibilityLabel={`${variant} icon button`}>
                <Icon source={ICONS.favorite} size={24} />
              </IconButton>
            ))}
          </Row>
        </Host>
        <StateRow text={`presses=${presses}`} />
      </PreviewSection>
      <PreviewSection title="Disabled" description="Same four variants, none respond.">
        <Host matchContents>
          <Row horizontalArrangement={{ spacedBy: 8 }}>
            {ICON_BUTTON_VARIANTS.map((variant) => (
              <IconButton key={variant} variant={variant} disabled onPress={press}>
                <Icon source={ICONS.add} size={24} />
              </IconButton>
            ))}
          </Row>
        </Host>
      </PreviewSection>
      <PreviewSection title="Colors" description="`colors` takes containerColor, contentColor and their disabled counterparts.">
        <IconButton variant="filled" onPress={press} colors={{ containerColor: '#B71C1C', contentColor: '#FFFFFF' }}>
          <Icon source={ICONS.star} size={24} />
        </IconButton>
      </PreviewSection>
    </>
  );
}

export function FloatingActionButtonDemo() {
  const [taps, setTaps] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const tap = () => setTaps((n) => n + 1);
  return (
    <>
      <PreviewSection
        title="Sizes"
        description="`size` is small, medium (default) or large. The icon goes in the `.Icon` slot."
        code={`<FloatingActionButton size="small" onPress={onPress}>\n  <FloatingActionButton.Icon><Icon source={add} /></FloatingActionButton.Icon>\n</FloatingActionButton>`}>
        <Host matchContents>
          <Row horizontalArrangement={{ spacedBy: 12 }} verticalAlignment="center">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <FloatingActionButton key={size} size={size} onPress={tap} accessibilityLabel={`${size} floating action button`}>
                <FloatingActionButton.Icon><Icon source={ICONS.add} size={size === 'large' ? 36 : size === 'small' ? 20 : 24} /></FloatingActionButton.Icon>
              </FloatingActionButton>
            ))}
          </Row>
        </Host>
        <StateRow text={`taps=${taps}`} />
      </PreviewSection>
      <PreviewSection title="Extended" description={'`size="extended"` adds a label slot and the `expanded` prop. Tap it to collapse to the icon only.'}>
        <Host matchContents>
          <FloatingActionButton size="extended" expanded={expanded} onPress={() => setExpanded((v) => !v)}>
            <FloatingActionButton.Icon><Icon source={ICONS.add} size={24} /></FloatingActionButton.Icon>
            <FloatingActionButton.Text><Text>Compose</Text></FloatingActionButton.Text>
          </FloatingActionButton>
        </Host>
        <StateRow text={`expanded=${String(expanded)}`} />
      </PreviewSection>
      <PreviewSection title="Container color">
        <FloatingActionButton containerColor="#6750A4" onPress={tap}>
          <FloatingActionButton.Icon><Icon source={ICONS.star} size={24} tint="#FFFFFF" /></FloatingActionButton.Icon>
        </FloatingActionButton>
      </PreviewSection>
    </>
  );
}

export function SplitButtonLayoutDemo() {
  const [saves, setSaves] = useState(0);
  const [open, setOpen] = useState(false);
  return (
    <PreviewSection
      title="Leading action and trailing toggle"
      description="The leading button acts; the trailing one toggles (`checked`). The two parts keep Expo's own props (onClick, onCheckedChange)."
      requires={['SplitButtonLayoutView', 'SplitButtonLeadingButtonView', 'SplitButtonTrailingButtonView']}>
      <Host matchContents>
        <Column>
          <SplitButtonLayout>
            <SplitButtonLayout.LeadingButton>
              <SplitButtonLeadingButton onClick={() => setSaves((n) => n + 1)}>
                <Text>Save</Text>
              </SplitButtonLeadingButton>
            </SplitButtonLayout.LeadingButton>
            <SplitButtonLayout.TrailingButton>
              <SplitButtonTrailingButton checked={open} onCheckedChange={setOpen}>
                <Icon source={ICONS.arrowForward} size={20} />
              </SplitButtonTrailingButton>
            </SplitButtonLayout.TrailingButton>
          </SplitButtonLayout>
        </Column>
      </Host>
      <StateRow text={`saves=${saves}  trailing checked=${String(open)}`} />
    </PreviewSection>
  );
}
