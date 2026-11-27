import { useState } from 'react';
import {
  Badge, BadgedBox, Box, Card, Column, FlowRow, HorizontalDivider, Host, Icon, ListItem, Row, Shape, Shapes, Spacer,
  Surface, Text, VerticalDivider, background, clip, fillMaxWidth, height, paddingAll, size, weight,
} from 'expo-ui-easy';
import { ICONS } from '../icons';
import { PreviewSection, StateRow } from '../ui';

const COLORS = ['#6750A4', '#1565C0', '#2E7D32', '#E65100', '#B71C1C', '#00838F'] as const;
const STRETCH = { vertical: true } as const;
const CARD_VARIANTS = ['filled', 'elevated', 'outlined'] as const;

export function RowDemo() {
  return (
    <PreviewSection title="Horizontal layout" description="horizontalArrangement (spacedBy, spaceBetween, ...) and verticalAlignment are Expo's props." code={`<Row horizontalArrangement={{ spacedBy: 12 }} verticalAlignment="center">...</Row>`}>
      <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
        <Row horizontalArrangement="spaceBetween" verticalAlignment="center" modifiers={[fillMaxWidth()]}>
          {COLORS.slice(0, 3).map((color) => (
            <Box key={color} modifiers={[size(56, 56), clip(Shapes.RoundedCorner(12)), background(color)]} />
          ))}
        </Row>
      </Host>
    </PreviewSection>
  );
}

export function ColumnDemo() {
  return (
    <PreviewSection title="Vertical layout" description="verticalArrangement and horizontalAlignment are Expo's props." code={`<Column verticalArrangement={{ spacedBy: 8 }}>...</Column>`}>
      <Host matchContents>
        <Column verticalArrangement={{ spacedBy: 8 }} horizontalAlignment="center">
          <Text>One</Text>
          <Text>Two</Text>
          <Text>Three</Text>
        </Column>
      </Host>
    </PreviewSection>
  );
}

export function BoxDemo() {
  return (
    <PreviewSection title="Stacking and alignment" description="Children are stacked; contentAlignment places them inside the box.">
      <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
        <Box contentAlignment="center" modifiers={[fillMaxWidth(), height(80), clip(Shapes.RoundedCorner(16)), background('#EDE9FE')]}>
          <Text>Centered in a Box</Text>
        </Box>
      </Host>
      <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
        <Box contentAlignment="bottomEnd" modifiers={[fillMaxWidth(), height(80), clip(Shapes.RoundedCorner(16)), background('#E0F2F1')]}>
          <Text modifiers={[paddingAll(8)]}>Bottom end</Text>
        </Box>
      </Host>
    </PreviewSection>
  );
}

export function FlowRowDemo() {
  return (
    <PreviewSection title="Wrapping row" description="Items wrap onto new lines when the row runs out of width.">
      <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
        <FlowRow horizontalArrangement={{ spacedBy: 6 }} verticalArrangement={{ spacedBy: 6 }}>
          {[...COLORS, ...COLORS].map((color, i) => (
            <Box key={i} modifiers={[size(70, 36), clip(Shapes.RoundedCorner(8)), background(color)]} contentAlignment="center">
              <Text color="#FFFFFF">{`#${i + 1}`}</Text>
            </Box>
          ))}
        </FlowRow>
      </Host>
    </PreviewSection>
  );
}

export function SpacerDemo() {
  return (
    <PreviewSection title="Flexible space" description="A Spacer with weight(1) pushes the right label to the end.">
      <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
        <Row modifiers={[fillMaxWidth()]} verticalAlignment="center">
          <Text>Start</Text>
          <Spacer modifiers={[weight(1)]} />
          <Text>End</Text>
        </Row>
      </Host>
    </PreviewSection>
  );
}

export function SurfaceDemo() {
  const [selected, setSelected] = useState(false);
  return (
    <PreviewSection title="Selectable surface" description="`onPress` and `selected`. The color follows the state." code={`<Surface onPress={toggle} selected={selected} color="#EDE9FE">...</Surface>`}>
      <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
        <Surface
          onPress={() => setSelected((v) => !v)}
          selected={selected}
          color={selected ? '#EDE9FE' : '#F3F4F6'}
          shape={Shape.RoundedCorner({ cornerRadii: { topStart: 12, topEnd: 12, bottomStart: 12, bottomEnd: 12 } })}
          modifiers={[fillMaxWidth()]}>
          <Text modifiers={[paddingAll(16)]}>{selected ? 'Selected surface' : 'Tap me'}</Text>
        </Surface>
      </Host>
      <StateRow text={`selected=${String(selected)}`} />
    </PreviewSection>
  );
}

export function CardDemo() {
  return (
    <>
      <PreviewSection
        title="Variants"
        description="`variant` is filled (default), elevated or outlined."
        code={`<Card>...</Card>\n<Card variant="elevated" elevation={8}>...</Card>\n<Card variant="outlined" border={{ width: 2, color: '#6750A4' }}>...</Card>`}>
        <Host matchContents={STRETCH} style={{ alignSelf: 'stretch' }}>
          <Column verticalArrangement={{ spacedBy: 8 }} modifiers={[fillMaxWidth()]}>
            {CARD_VARIANTS.map((variant) => (
              <Card key={variant} variant={variant} modifiers={[fillMaxWidth()]}>
                <Text modifiers={[paddingAll(16)]}>{variant}</Text>
              </Card>
            ))}
          </Column>
        </Host>
      </PreviewSection>
      <PreviewSection title="Elevation, border and colors" description="`border` exists on filled and outlined cards only; the elevated card has none.">
        <Host matchContents={STRETCH} style={{ alignSelf: 'stretch' }}>
          <Column verticalArrangement={{ spacedBy: 8 }} modifiers={[fillMaxWidth()]}>
            <Card variant="elevated" elevation={8} modifiers={[fillMaxWidth()]}><Text modifiers={[paddingAll(16)]}>Elevation 8</Text></Card>
            <Card variant="outlined" border={{ width: 2, color: '#6750A4' }} modifiers={[fillMaxWidth()]}><Text modifiers={[paddingAll(16)]}>Purple border</Text></Card>
            <Card colors={{ containerColor: '#EDE9FE', contentColor: '#4A148C' }} modifiers={[fillMaxWidth()]}><Text modifiers={[paddingAll(16)]}>Custom colors</Text></Card>
          </Column>
        </Host>
      </PreviewSection>
    </>
  );
}

export function ListItemDemo() {
  return (
    <PreviewSection title="Slots" description="HeadlineContent, OverlineContent, SupportingContent, LeadingContent and TrailingContent.">
      <Host matchContents={STRETCH} style={{ alignSelf: 'stretch' }}>
        <Column modifiers={[fillMaxWidth()]}>
          <ListItem modifiers={[fillMaxWidth()]}>
            <ListItem.OverlineContent><Text>Overline</Text></ListItem.OverlineContent>
            <ListItem.HeadlineContent><Text>Headline</Text></ListItem.HeadlineContent>
            <ListItem.SupportingContent><Text>Supporting text goes here</Text></ListItem.SupportingContent>
            <ListItem.LeadingContent><Icon source={ICONS.star} size={24} /></ListItem.LeadingContent>
            <ListItem.TrailingContent><Text>2m</Text></ListItem.TrailingContent>
          </ListItem>
          <HorizontalDivider />
          <ListItem modifiers={[fillMaxWidth()]}>
            <ListItem.HeadlineContent><Text>Headline only</Text></ListItem.HeadlineContent>
          </ListItem>
        </Column>
      </Host>
    </PreviewSection>
  );
}

export function HorizontalDividerDemo() {
  return (
    <PreviewSection title="Thickness and color" code={`<HorizontalDivider thickness={3} color="#6750A4" />`}>
      <HorizontalDivider />
      <HorizontalDivider thickness={3} color="#6750A4" />
    </PreviewSection>
  );
}

export function VerticalDividerDemo() {
  return (
    <PreviewSection title="Between items" description="Give it a height with a modifier.">
      <Host matchContents>
        <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 16 }}>
          <Text>Left</Text>
          <VerticalDivider thickness={2} modifiers={[height(24)]} />
          <Text>Right</Text>
        </Row>
      </Host>
    </PreviewSection>
  );
}

export function BadgeDemo() {
  return (
    <PreviewSection title="Count and dot">
      <Host matchContents>
        <Row horizontalArrangement={{ spacedBy: 12 }} verticalAlignment="center">
          <Badge><Text>3</Text></Badge>
          <Badge containerColor="#2E7D32"><Text color="#FFFFFF">New</Text></Badge>
          <Badge />
        </Row>
      </Host>
    </PreviewSection>
  );
}

export function BadgedBoxDemo() {
  return (
    <PreviewSection title="Anchored badge" description="The badge sits on the corner of the content through BadgedBox.Badge.">
      <Host matchContents>
        <BadgedBox>
          <BadgedBox.Badge><Badge><Text>3</Text></Badge></BadgedBox.Badge>
          <Icon source={ICONS.favorite} size={28} />
        </BadgedBox>
      </Host>
    </PreviewSection>
  );
}
