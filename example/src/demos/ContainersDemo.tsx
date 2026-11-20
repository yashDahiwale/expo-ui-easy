import { useRef, useState } from 'react';
import {
  AnimatedVisibility, Badge, BadgedBox, Box, Card, Column, ElevatedCard, EnterTransition, ExitTransition,
  FlowRow, HorizontalCenteredHeroCarousel, HorizontalDivider, HorizontalMultiBrowseCarousel, HorizontalPager,
  HorizontalUncontainedCarousel, Host, Icon, Image, LazyColumn, LazyRow, ListItem, OutlinedCard, PullToRefreshBox,
  Row, Shape, Spacer, Surface, Switch, Text, VerticalDivider,
} from 'expo-ui-easy';
import { background, clip, fillMaxWidth, height, paddingAll, Shapes, size, weight, width } from '@expo/ui/jetpack-compose/modifiers';
import { ICONS } from '../icons';
import { ActionButton, Case, Page, Readout } from '../ui';

const COLORS = ['#6750A4', '#1565C0', '#2E7D32', '#E65100', '#B71C1C', '#00838F'] as const;
const ROWS = Array.from({ length: 200 }, (_, i) => i);
const keyOf = (n: number): string => String(n);

function Swatch({ index, w, h }: { index: number; w?: number; h?: number }) {
  return (
    <Box
      modifiers={[
        ...(w !== undefined ? [width(w)] : [fillMaxWidth()]),
        height(h ?? 80),
        clip(Shapes.RoundedCorner(16)),
        background(COLORS[index % COLORS.length] ?? '#6750A4'),
      ]}
    />
  );
}

export default function ContainersDemo() {
  const [selected, setSelected] = useState(false);
  const [visible, setVisible] = useState(true);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refresh = () => {
    setRefreshing(true);
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <Page>
      <Case title="Cards" note="Card, ElevatedCard, OutlinedCard with Expo's colors / elevation / border props.">
        <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
          <Column verticalArrangement={{ spacedBy: 8 }} modifiers={[fillMaxWidth()]}>
            <Card modifiers={[fillMaxWidth()]}><Text modifiers={[paddingAll(16)]}>Card</Text></Card>
            <ElevatedCard elevation={8} modifiers={[fillMaxWidth()]}><Text modifiers={[paddingAll(16)]}>ElevatedCard (elevation 8)</Text></ElevatedCard>
            <OutlinedCard border={{ width: 2, color: '#6750A4' }} modifiers={[fillMaxWidth()]}><Text modifiers={[paddingAll(16)]}>OutlinedCard (purple border)</Text></OutlinedCard>
            <Card colors={{ containerColor: '#EDE9FE', contentColor: '#4A148C' }} modifiers={[fillMaxWidth()]}><Text modifiers={[paddingAll(16)]}>Card with colors</Text></Card>
          </Column>
        </Host>
      </Case>

      <Case title="ListItem slots" note="HeadlineContent, OverlineContent, SupportingContent, LeadingContent, TrailingContent.">
        <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
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
      </Case>

      <Case title="Dividers, Badge, BadgedBox" note="HorizontalDivider / VerticalDivider (thickness, color) and a badge anchored on an icon.">
        <HorizontalDivider thickness={3} color="#6750A4" />
        <Host matchContents>
          <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 16 }}>
            <Text>Left</Text>
            <VerticalDivider thickness={2} modifiers={[height(24)]} />
            <Text>Right</Text>
            <BadgedBox>
              <BadgedBox.Badge><Badge><Text>3</Text></Badge></BadgedBox.Badge>
              <Icon source={ICONS.favorite} size={28} />
            </BadgedBox>
          </Row>
        </Host>
      </Case>

      <Case title="Surface (selectable) + layout: Row, Column, Box, FlowRow, Spacer" note="Surface: onPress / selected. Spacer with weight() pushes the right label to the end.">
        <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
          <Column verticalArrangement={{ spacedBy: 8 }} modifiers={[fillMaxWidth()]}>
            <Surface
              onPress={() => setSelected((v) => !v)}
              selected={selected}
              color={selected ? '#EDE9FE' : '#F3F4F6'}
              shape={Shape.RoundedCorner({ cornerRadii: { topStart: 12, topEnd: 12, bottomStart: 12, bottomEnd: 12 } })}
              modifiers={[fillMaxWidth()]}>
              <Text modifiers={[paddingAll(16)]}>{selected ? 'Selected surface' : 'Tap me'}</Text>
            </Surface>
            <Row modifiers={[fillMaxWidth()]} verticalAlignment="center">
              <Text>Start</Text>
              <Spacer modifiers={[weight(1)]} />
              <Text>End</Text>
            </Row>
            <Box contentAlignment="center" modifiers={[fillMaxWidth(), height(60), background('#F3F4F6')]}>
              <Text>Centered in Box</Text>
            </Box>
            <FlowRow horizontalArrangement={{ spacedBy: 6 }} verticalArrangement={{ spacedBy: 6 }}>
              {COLORS.map((color, i) => (
                <Box key={color} modifiers={[size(70, 36), clip(Shapes.RoundedCorner(8)), background(color)]} contentAlignment="center">
                  <Text color="#FFFFFF">{`#${i + 1}`}</Text>
                </Box>
              ))}
            </FlowRow>
          </Column>
        </Host>
      </Case>

      <Case title="AnimatedVisibility" note="Flip the switch: the box fades and slides in / out.">
        <Switch value={visible} onValueChange={setVisible} />
        <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
          <AnimatedVisibility visible={visible} enterTransition={EnterTransition.fadeIn().plus(EnterTransition.slideInVertically())} exitTransition={ExitTransition.fadeOut().plus(ExitTransition.slideOutVertically())}>
            <Swatch index={0} h={60} />
          </AnimatedVisibility>
        </Host>
      </Case>

      <Case title="Image" note="Compose Image from a URI: contentScale, alpha, contentDescription. Needs network.">
        <Image
          source={{ uri: 'https://picsum.photos/id/10/400/200' }}
          contentScale="crop"
          contentDescription="Forest"
          modifiers={[fillMaxWidth(), height(140), clip(Shapes.RoundedCorner(16))]}
          style={{ alignSelf: 'stretch' }}
        />
      </Case>

      <Case title="LazyColumn (200 rows, ONE Host)" note="Scrolls inside its own fixed-height Host. Only visible rows are composed.">
        <Host style={{ height: 220, alignSelf: 'stretch' }}>
          <LazyColumn>
            <LazyColumn.Items data={ROWS} keyExtractor={keyOf}>
              {({ item }: { item: number }) => (
                <ListItem modifiers={[fillMaxWidth()]}>
                  <ListItem.HeadlineContent><Text>{`Row ${item}`}</Text></ListItem.HeadlineContent>
                </ListItem>
              )}
            </LazyColumn.Items>
          </LazyColumn>
        </Host>
      </Case>

      <Case title="LazyRow" note="Horizontal scrolling list.">
        <LazyRow>
          <LazyRow.Items data={ROWS.slice(0, 30)} keyExtractor={keyOf}>
            {({ item }: { item: number }) => <Swatch index={item} w={90} h={90} />}
          </LazyRow.Items>
        </LazyRow>
      </Case>

      <Case title="HorizontalPager" note="Swipe between pages: the readout follows onCurrentPageChange.">
        <HorizontalPager onCurrentPageChange={setPage} pageSpacing={12} contentPadding={16}>
          {COLORS.slice(0, 4).map((_, i) => (
            <Swatch key={i} index={i} h={120} />
          ))}
        </HorizontalPager>
        <Readout text={`page=${page}`} />
      </Case>

      <Case title="Carousels" note="HorizontalMultiBrowse, HorizontalUncontained, HorizontalCenteredHero.">
        <HorizontalMultiBrowseCarousel preferredItemWidth={160} itemSpacing={8} contentPadding={16}>
          {COLORS.map((_, i) => <Swatch key={i} index={i} h={120} />)}
        </HorizontalMultiBrowseCarousel>
        <HorizontalUncontainedCarousel itemWidth={120} itemSpacing={8} contentPadding={16}>
          {COLORS.map((_, i) => <Swatch key={i} index={i} h={100} />)}
        </HorizontalUncontainedCarousel>
        <HorizontalCenteredHeroCarousel itemSpacing={8} contentPadding={16}>
          {COLORS.map((_, i) => <Swatch key={i} index={i} h={140} />)}
        </HorizontalCenteredHeroCarousel>
      </Case>

      <Case title="PullToRefreshBox" note="Pull down inside the box: the indicator shows for 1.5s, then onRefresh ends. isRefreshing is controlled.">
        <Host style={{ height: 200, alignSelf: 'stretch' }}>
          <PullToRefreshBox isRefreshing={refreshing} onRefresh={refresh}>
            <LazyColumn>
              <LazyColumn.Items data={ROWS.slice(0, 30)} keyExtractor={keyOf}>
                {({ item }: { item: number }) => <Text modifiers={[paddingAll(12)]}>{`Item ${item}`}</Text>}
              </LazyColumn.Items>
            </LazyColumn>
          </PullToRefreshBox>
        </Host>
        <ActionButton label="Start refresh from JS" tone="neutral" onPress={refresh} />
        <Readout text={`isRefreshing=${String(refreshing)}`} />
      </Case>
    </Page>
  );
}
