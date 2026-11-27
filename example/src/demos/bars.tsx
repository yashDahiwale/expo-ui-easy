import { useState } from 'react';
import {
  DockedSearchBar, ExpandedFullScreenSearchBar, HorizontalFloatingToolbar, Host, Icon, IconButton, NavigationBar,
  NavigationBarItem, SearchBar, Text, TopAppBar,
} from 'expo-ui-easy';
import { ICONS } from '../icons';
import { PreviewSection, StateRow } from '../ui';

const TABS = ['Home', 'Favorites', 'Starred'] as const;
const TAB_ICONS = [ICONS.check, ICONS.favorite, ICONS.star] as const;

export function TopAppBarDemo() {
  return (
    <PreviewSection
      title="Navigation icon, title and actions"
      description="Slots: NavigationIcon, Title, Actions."
      requires={['TopAppBarView']}
      code={`<TopAppBar>\n  <TopAppBar.NavigationIcon><Icon source={back} size={24} /></TopAppBar.NavigationIcon>\n  <TopAppBar.Title><Text>Title</Text></TopAppBar.Title>\n</TopAppBar>`}>
      <TopAppBar>
        <TopAppBar.NavigationIcon><Icon source={ICONS.arrowForward} size={24} /></TopAppBar.NavigationIcon>
        <TopAppBar.Title><Text>App bar title</Text></TopAppBar.Title>
        <TopAppBar.Actions><Icon source={ICONS.favorite} size={24} /></TopAppBar.Actions>
      </TopAppBar>
    </PreviewSection>
  );
}

export function NavigationBarDemo() {
  const [tab, setTab] = useState(0);
  return (
    <PreviewSection title="Destinations" description="`selected` and `onPress` on each item; slots Icon, SelectedIcon and Label.">
      <NavigationBar>
        {TABS.map((label, i) => (
          <NavigationBarItem key={label} selected={tab === i} onPress={() => setTab(i)}>
            <NavigationBarItem.Icon><Icon source={TAB_ICONS[i] ?? ICONS.star} size={24} /></NavigationBarItem.Icon>
            <NavigationBarItem.Label><Text>{label}</Text></NavigationBarItem.Label>
          </NavigationBarItem>
        ))}
      </NavigationBar>
      <StateRow text={`tab=${TABS[tab] ?? '?'}`} />
    </PreviewSection>
  );
}

export function SearchBarDemo() {
  const [searched, setSearched] = useState('-');
  return (
    <PreviewSection
      title="Collapsed bar with expanded view"
      description="Submit a search on the keyboard. ExpandedFullScreenSearchBar holds the content shown while the bar is expanded."
      requires={['SearchBarView']}>
      <SearchBar onSearch={setSearched}>
        <SearchBar.Placeholder><Text>Search fruits</Text></SearchBar.Placeholder>
        <ExpandedFullScreenSearchBar>
          <Text>Suggestions would go here</Text>
        </ExpandedFullScreenSearchBar>
      </SearchBar>
      <StateRow text={`onSearch="${searched}"`} />
    </PreviewSection>
  );
}

export function DockedSearchBarDemo() {
  const [query, setQuery] = useState('');
  return (
    <PreviewSection title="Docked" description="onQueryChange fires while typing.">
      <DockedSearchBar onQueryChange={setQuery}>
        <DockedSearchBar.Placeholder><Text>Search</Text></DockedSearchBar.Placeholder>
        <DockedSearchBar.LeadingIcon><Icon source={ICONS.star} size={24} /></DockedSearchBar.LeadingIcon>
      </DockedSearchBar>
      <StateRow text={`query="${query}"`} />
    </PreviewSection>
  );
}

export function HorizontalFloatingToolbarDemo() {
  const [taps, setTaps] = useState(0);
  return (
    <PreviewSection
      title="Standard and vibrant"
      description="`variant` is 'standard' or 'vibrant', with a trailing floating action button (onPress)."
      requires={['HorizontalFloatingToolbarView']}>
      <Host matchContents>
        <HorizontalFloatingToolbar variant="vibrant">
          <IconButton><Icon source={ICONS.star} size={24} /></IconButton>
          <IconButton><Icon source={ICONS.favorite} size={24} /></IconButton>
          <HorizontalFloatingToolbar.FloatingActionButton onPress={() => setTaps((n) => n + 1)}>
            <Icon source={ICONS.add} size={24} />
          </HorizontalFloatingToolbar.FloatingActionButton>
        </HorizontalFloatingToolbar>
      </Host>
      <StateRow text={`fab taps=${taps}`} />
    </PreviewSection>
  );
}
