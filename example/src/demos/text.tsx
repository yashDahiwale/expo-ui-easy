import { useRef, useState } from 'react';
import type { TextFieldRef } from '@expo/ui/jetpack-compose';
import { BasicTextField, Box, Column, Host, Icon, Text, TextField, background, fillMaxWidth, paddingAll, useNativeState } from 'expo-ui-easy';
import { ICONS } from '../icons';
import { ActionButton, PreviewSection, StateRow } from '../ui';

const LONG =
  'Jetpack Compose renders this text natively. It is deliberately long so that truncation, wrapping and alignment can be checked on a small screen without any guesswork.';

/** Text that must wrap needs a bounded width, so these examples use a vertical-only matchContents. */
const WRAP_HOST = { matchContents: { vertical: true } } as const;
const FULL_WIDTH = { width: '100%' } as const;

const ROLES = ['displayMedium', 'headlineMedium', 'titleLarge', 'titleMedium', 'bodyLarge', 'bodyMedium', 'labelLarge', 'labelSmall'] as const;

export function TextDemo() {
  const [lines, setLines] = useState(2);

  return (
    <>
      <PreviewSection
        title="Type roles"
        description="`variant` picks a Material3 type role. It is shorthand for style={{ typography }}; any key in `style` overrides it."
        code={`<Text variant="titleLarge">Title</Text>\n<Text variant="bodyMedium" style={{ fontWeight: '700' }}>Bold body</Text>`}>
        {ROLES.map((role) => (
          <Text key={role} variant={role}>{role}</Text>
        ))}
        <Text variant="displayLarge" style={{ fontSize: 20 }}>displayLarge forced to 20</Text>
      </PreviewSection>

      <PreviewSection title="Weight, style and decoration" description="`style` is Expo's TextStyle. The text color is a separate Expo prop: `color`.">
        <Text style={{ fontSize: 18 }}>Regular 18</Text>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Bold 700</Text>
        <Text style={{ fontSize: 18, fontStyle: 'italic' }}>Italic</Text>
        <Text style={{ fontSize: 18, textDecoration: 'underline' }}>Underline</Text>
        <Text style={{ fontSize: 18, textDecoration: 'lineThrough' }}>Line through</Text>
      </PreviewSection>

      <PreviewSection title="Color, background and letter spacing">
        <Text style={{ fontSize: 18 }} color="#B71C1C">Red text</Text>
        <Text style={{ fontSize: 18, background: '#6750A4' }} color="#FFFFFF">White on purple</Text>
        <Text style={{ fontSize: 18, letterSpacing: 4 }}>SPACED OUT</Text>
      </PreviewSection>

      <PreviewSection title="Shadow and font family" description="Compose built-in families: serif, monospace and cursive.">
        <Text style={{ fontSize: 28, fontWeight: '700', shadow: { color: '#00000066', offsetX: 3, offsetY: 3, blurRadius: 4 } }} color="#6750A4">
          Shadow
        </Text>
        <Text style={{ fontSize: 18, fontFamily: 'serif' }}>serif</Text>
        <Text style={{ fontSize: 18, fontFamily: 'monospace' }}>monospace</Text>
        <Text style={{ fontSize: 18, fontFamily: 'cursive' }}>cursive</Text>
      </PreviewSection>

      <PreviewSection title="Truncation" description="`numberOfLines` is React Native's name for Expo's `maxLines`. 'ellipsis' shows …; 'clip' cuts the text.">
        <Text numberOfLines={lines} overflow="ellipsis" containerStyle={FULL_WIDTH} hostProps={WRAP_HOST}>{LONG}</Text>
        <Text numberOfLines={lines} overflow="clip" containerStyle={FULL_WIDTH} hostProps={WRAP_HOST}>{LONG}</Text>
        <StateRow text={`numberOfLines=${lines}`} />
        <ActionButton label="Fewer lines" tone="neutral" onPress={() => setLines((n) => Math.max(1, n - 1))} />
        <ActionButton label="More lines" tone="neutral" onPress={() => setLines((n) => n + 1)} />
      </PreviewSection>

      <PreviewSection title="Alignment and wrapping" description="textAlign, lineHeight, minLines and softWrap.">
        <Text style={{ textAlign: 'center', lineHeight: 28, fontSize: 16 }} containerStyle={FULL_WIDTH} hostProps={WRAP_HOST}>{LONG}</Text>
        <Text style={{ textAlign: 'end', fontSize: 16 }} containerStyle={FULL_WIDTH} hostProps={WRAP_HOST}>Right aligned</Text>
        <Text minLines={3} containerStyle={FULL_WIDTH} hostProps={WRAP_HOST}>Reserves three lines</Text>
        <Text softWrap={false} numberOfLines={1} containerStyle={FULL_WIDTH} hostProps={WRAP_HOST}>{LONG}</Text>
      </PreviewSection>

      <PreviewSection title="Nested spans" description="Inner Text elements become styled spans of one paragraph.">
        <Text style={{ fontSize: 18 }} containerStyle={FULL_WIDTH} hostProps={WRAP_HOST}>
          Plain, <Text style={{ fontWeight: '700' }} color="#6750A4">bold purple</Text>, then{' '}
          <Text style={{ fontStyle: 'italic', textDecoration: 'underline' }}>italic underlined</Text> text.
        </Text>
      </PreviewSection>
    </>
  );
}

export function TextFieldDemo() {
  const basic = useNativeState('');
  const [typed, setTyped] = useState('');
  const email = useNativeState('');
  const password = useNativeState('');
  const bio = useNativeState('');
  const limited = useNativeState('');
  const [limitedText, setLimitedText] = useState('');
  const readOnly = useNativeState('Read-only value');
  const refValue = useNativeState('start');
  const fieldRef = useRef<TextFieldRef>(null);
  const [done, setDone] = useState('-');

  return (
    <>
      <PreviewSection
        title="Filled and outlined"
        description="`variant` is filled (default) or outlined. `value` is Expo's ObservableState from useNativeState; onChangeText and placeholder use React Native's names."
        code={`const name = useNativeState('');\n\n<TextField value={name} onChangeText={setText} placeholder="Name" />\n<TextField variant="outlined" value={name} placeholder="Name" />`}>
        <TextField value={basic} onChangeText={setTyped} placeholder="Type here" />
        <TextField variant="outlined" value={basic} placeholder="Outlined" />
        <StateRow text={`text="${typed}"`} />
      </PreviewSection>

      <PreviewSection title="Slots" description="Label, LeadingIcon, TrailingIcon, Prefix, Suffix, SupportingText and Placeholder are Expo's statics and work with both variants.">
        <TextField variant="outlined" value={email} keyboardOptions={{ keyboardType: 'email', autoCorrectEnabled: false, capitalization: 'none' }}>
          <TextField.Label><Text>Email</Text></TextField.Label>
          <TextField.LeadingIcon><Icon source={ICONS.favorite} size={20} /></TextField.LeadingIcon>
          <TextField.SupportingText><Text>We never share it</Text></TextField.SupportingText>
        </TextField>
        <StateRow text="the keyboard must be the email keyboard" />
      </PreviewSection>

      <PreviewSection title="secureTextEntry" description="Hides the text (Expo: visualTransformation='password').">
        <TextField value={password} secureTextEntry placeholder="Password" />
      </PreviewSection>

      <PreviewSection title="multiline" description="multiline allows several lines (Expo: singleLine inverted); minLines reserves 3.">
        <TextField variant="outlined" value={bio} multiline minLines={3} maxLines={5} placeholder="Tell us about yourself" />
      </PreviewSection>

      <PreviewSection title="maxLength and isError" description="Typing beyond 8 characters is blocked. isError turns the field red.">
        <TextField value={limited} maxLength={8} onChangeText={setLimitedText} isError={limitedText.length >= 8} placeholder="Max 8 characters">
          <TextField.SupportingText><Text>{`${limitedText.length}/8`}</Text></TextField.SupportingText>
        </TextField>
      </PreviewSection>

      <PreviewSection title="editable={false}" description="Expo: readOnly. The text cannot be edited.">
        <TextField value={readOnly} editable={false} />
      </PreviewSection>

      <PreviewSection title="Colors and keyboard actions" description="Press 'done' on the keyboard to submit the value.">
        <TextField
          value={basic}
          keyboardOptions={{ imeAction: 'done' }}
          keyboardActions={{ onDone: (value) => setDone(value) }}
          colors={{ focusedContainerColor: '#EDE9FE', unfocusedContainerColor: '#F3F4F6', cursorColor: '#7C3AED', focusedIndicatorColor: '#7C3AED' }}
          placeholder="Colored"
        />
        <StateRow text={`onDone="${done}"`} />
      </PreviewSection>

      <PreviewSection title="Imperative ref" description="Expo's TextFieldRef: focus, blur, clear and setText.">
        <TextField ref={fieldRef} value={refValue} placeholder="Controlled by the buttons" />
        <ActionButton label="focus" tone="neutral" onPress={() => void fieldRef.current?.focus()} />
        <ActionButton label="blur" tone="neutral" onPress={() => void fieldRef.current?.blur()} />
        <ActionButton label="clear" tone="neutral" onPress={() => void fieldRef.current?.clear()} />
        <ActionButton label="setText('Hello')" tone="neutral" onPress={() => void fieldRef.current?.setText('Hello')} />
      </PreviewSection>

      <PreviewSection title="Two fields in one Host" description="One shared Compose root for both.">
        <Host matchContents>
          <Column verticalArrangement={{ spacedBy: 8 }}>
            <TextField value={basic} placeholder="First" />
            <TextField variant="outlined" value={bio} placeholder="Second" />
          </Column>
        </Host>
      </PreviewSection>
    </>
  );
}

export function BasicTextFieldDemo() {
  const value = useNativeState('');
  return (
    <PreviewSection
      title="Decoration box"
      description="The undecorated field: you supply the look through DecorationBox, with InnerTextField where the text goes.">
      <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
        <BasicTextField value={value}>
          <BasicTextField.DecorationBox>
            <Box modifiers={[fillMaxWidth(), background('#F3F4F6'), paddingAll(12)]}>
              <BasicTextField.InnerTextField />
            </Box>
          </BasicTextField.DecorationBox>
        </BasicTextField>
      </Host>
    </PreviewSection>
  );
}
