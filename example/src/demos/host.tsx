import { useState } from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Column, Host, RNHostView, Row, Switch, Text, useHostStats } from 'expo-ui-easy';
import { space, useTheme } from '../theme';
import { PreviewSection, StateRow } from '../ui';

export function HostDemo() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const stats = useHostStats();
  return (
    <>
      <PreviewSection
        title="One Host, many components"
        description="Everything inside a Host renders as a bare Compose node: one Compose root, however many components. Put a Host around a screen or section."
        code={`<Host matchContents>\n  <Column verticalArrangement={{ spacedBy: 8 }}>\n    <Switch value={a} onValueChange={setA} />\n    <Button>Save</Button>\n  </Column>\n</Host>`}>
        <Host matchContents>
          <Column verticalArrangement={{ spacedBy: 8 }}>
            <Switch value={a} onValueChange={setA} />
            <Switch value={b} onValueChange={setB} />
            <Button variant="tonal">Inside one Host</Button>
          </Column>
        </Host>
      </PreviewSection>

      <PreviewSection title="Without a Host" description="A component used outside any Host creates its own (matchContents). Convenient, but one Compose root each: avoid it in lists.">
        <Switch value={a} onValueChange={setA} />
        <Switch value={b} onValueChange={setB} />
        <StateRow text={`auto-created Hosts in the app: ${stats.autoHosts}`} />
      </PreviewSection>
    </>
  );
}

export function RNHostViewDemo() {
  const t = useTheme();
  return (
    <PreviewSection
      title="React Native inside Compose"
      description="RNHostView embeds RN views in a Compose tree, for things Compose does not have, like @expo/vector-icons. Library components inside it create their own Host again."
      code={`<Host matchContents>\n  <Row>\n    <RNHostView matchContents><Ionicons name="heart" size={24} color="#B71C1C" /></RNHostView>\n  </Row>\n</Host>`}>
      <Host matchContents>
        <Row horizontalArrangement={{ spacedBy: 12 }} verticalAlignment="center">
          <RNHostView matchContents>
            <Ionicons name="heart" size={28} color="#B71C1C" />
          </RNHostView>
          <Text>Compose text</Text>
          <RNHostView matchContents>
            <View style={[styles.rnBadge, { backgroundColor: t.accentContainer }]}>
              <RNText style={{ color: t.onAccentContainer, fontWeight: '600' }}>RN view</RNText>
            </View>
          </RNHostView>
        </Row>
      </Host>
    </PreviewSection>
  );
}

const styles = StyleSheet.create({
  rnBadge: { borderRadius: 999, paddingHorizontal: space.md, paddingVertical: space.xs },
});
