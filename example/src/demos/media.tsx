import { useState } from 'react';
import {
  AnimatedVisibility, Box, EnterTransition, ExitTransition, Host, Icon, Image, Row, Shapes, Switch, Text,
  background, clip, fillMaxWidth, height,
} from 'expo-ui-easy';
import { Icon as UniversalIcon } from '@expo/ui';
import { ICONS } from '../icons';
import { PreviewSection } from '../ui';

export function IconDemo() {
  return (
    <>
      <PreviewSection
        title="Sizes and tint"
        description="`source` is any XML vector drawable, including Material Symbols from @expo/material-symbols. `tint` colors it; tint={null} keeps the drawable's own colors."
        code={`import AddIcon from '@expo/material-symbols/add.xml';\n\n<Icon source={AddIcon} size={24} tint="#6750A4" />`}>
        <Host matchContents>
          <Row horizontalArrangement={{ spacedBy: 16 }} verticalAlignment="center">
            <Icon source={ICONS.star} size={20} />
            <Icon source={ICONS.star} size={32} tint="#6750A4" />
            <Icon source={ICONS.favorite} size={44} tint="#B71C1C" />
          </Row>
        </Host>
      </PreviewSection>
      <PreviewSection title="Universal Icon" description="Expo UI's cross-platform Icon takes a `name` and inherits the surrounding content color.">
        <Host matchContents>
          <Row horizontalArrangement={{ spacedBy: 16 }} verticalAlignment="center">
            <UniversalIcon name={ICONS.add} size={24} />
            <UniversalIcon name={ICONS.check} size={24} color="#2E7D32" accessibilityLabel="Done" />
          </Row>
        </Host>
        <Text>Material Symbols work in both worlds.</Text>
      </PreviewSection>
    </>
  );
}

export function ImageDemo() {
  return (
    <PreviewSection title="From a URI" description="Compose Image: contentScale, alpha and contentDescription. Needs network." code={`<Image source={{ uri }} contentScale="crop" modifiers={[fillMaxWidth(), height(140)]} />`}>
      <Image
        source={{ uri: 'https://picsum.photos/id/10/400/200' }}
        contentScale="crop"
        contentDescription="Forest"
        modifiers={[fillMaxWidth(), height(140), clip(Shapes.RoundedCorner(16))]}
        style={{ alignSelf: 'stretch' }}
      />
    </PreviewSection>
  );
}

export function AnimatedVisibilityDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <PreviewSection title="Enter and exit" description="Flip the switch: the box fades and slides in and out.">
      <Switch value={visible} onValueChange={setVisible} />
      <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
        <AnimatedVisibility
          visible={visible}
          enterTransition={EnterTransition.fadeIn().plus(EnterTransition.slideInVertically())}
          exitTransition={ExitTransition.fadeOut().plus(ExitTransition.slideOutVertically())}>
          <Box modifiers={[fillMaxWidth(), height(60), clip(Shapes.RoundedCorner(16)), background('#6750A4')]} />
        </AnimatedVisibility>
      </Host>
    </PreviewSection>
  );
}
