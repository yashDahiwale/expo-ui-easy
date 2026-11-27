import { useRef, useState } from 'react';
import {
  Box, HorizontalCenteredHeroCarousel, HorizontalMultiBrowseCarousel, HorizontalPager, HorizontalUncontainedCarousel,
  Host, LazyColumn, LazyRow, ListItem, PullToRefreshBox, Shapes, Text,
  background, clip, fillMaxWidth, height, paddingAll, width,
} from 'expo-ui-easy';
import { ActionButton, PreviewSection, StateRow } from '../ui';

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

export function LazyColumnDemo() {
  return (
    <PreviewSection
      title="200 rows, one Host"
      description="Scrolls inside its own fixed-height Host. Only the visible rows are composed."
      code={`<Host style={{ height: 220 }}>\n  <LazyColumn>\n    <LazyColumn.Items data={rows} keyExtractor={(n) => String(n)}>\n      {({ item }) => <ListItem>...</ListItem>}\n    </LazyColumn.Items>\n  </LazyColumn>\n</Host>`}>
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
    </PreviewSection>
  );
}

export function LazyRowDemo() {
  return (
    <PreviewSection title="Horizontal list" description="LazyRow.Items recycles the same way.">
      <LazyRow>
        <LazyRow.Items data={ROWS.slice(0, 30)} keyExtractor={keyOf}>
          {({ item }: { item: number }) => <Swatch index={item} w={90} h={90} />}
        </LazyRow.Items>
      </LazyRow>
    </PreviewSection>
  );
}

export function HorizontalPagerDemo() {
  const [page, setPage] = useState(0);
  return (
    <PreviewSection title="Swipeable pages" description="The readout follows onCurrentPageChange.">
      <HorizontalPager onCurrentPageChange={setPage} pageSpacing={12} contentPadding={16}>
        {COLORS.slice(0, 4).map((_, i) => (
          <Swatch key={i} index={i} h={120} />
        ))}
      </HorizontalPager>
      <StateRow text={`page=${page}`} />
    </PreviewSection>
  );
}

export function HorizontalMultiBrowseCarouselDemo() {
  return (
    <PreviewSection title="Multi-browse" description="Several items at once, varying in size.">
      <HorizontalMultiBrowseCarousel preferredItemWidth={160} itemSpacing={8} contentPadding={16}>
        {COLORS.map((_, i) => <Swatch key={i} index={i} h={120} />)}
      </HorizontalMultiBrowseCarousel>
    </PreviewSection>
  );
}

export function HorizontalUncontainedCarouselDemo() {
  return (
    <PreviewSection title="Uncontained" description="Uniform items that scroll freely.">
      <HorizontalUncontainedCarousel itemWidth={120} itemSpacing={8} contentPadding={16}>
        {COLORS.map((_, i) => <Swatch key={i} index={i} h={100} />)}
      </HorizontalUncontainedCarousel>
    </PreviewSection>
  );
}

export function HorizontalCenteredHeroCarouselDemo() {
  return (
    <PreviewSection title="Centered hero" description="One large item in the middle, smaller ones on the sides.">
      <HorizontalCenteredHeroCarousel itemSpacing={8} contentPadding={16}>
        {COLORS.map((_, i) => <Swatch key={i} index={i} h={140} />)}
      </HorizontalCenteredHeroCarousel>
    </PreviewSection>
  );
}

export function PullToRefreshBoxDemo() {
  const [refreshing, setRefreshing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refresh = () => {
    setRefreshing(true);
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => setRefreshing(false), 1500);
  };
  return (
    <PreviewSection title="Pull to refresh" description="Pull down inside the box: the indicator shows for 1.5 s, then onRefresh ends. `isRefreshing` is controlled.">
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
      <StateRow text={`isRefreshing=${String(refreshing)}`} />
    </PreviewSection>
  );
}
