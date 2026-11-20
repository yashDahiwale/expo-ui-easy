import { useRef, useState } from 'react';
import type { TextFieldRef } from '@expo/ui/jetpack-compose';
import { Column, Host, Icon, OutlinedTextField, Text, TextField, useNativeState } from 'expo-ui-easy';
import { ICONS } from '../icons';
import { ActionButton, Case, Page, Readout } from '../ui';

export default function TextFieldsDemo() {
  const basic = useNativeState('');
  const [typed, setTyped] = useState('');
  const email = useNativeState('');
  const password = useNativeState('');
  const bio = useNativeState('');
  const limited = useNativeState('');
  const [limitedText, setLimitedText] = useState('');
  const refValue = useNativeState('start');
  const fieldRef = useRef<TextFieldRef>(null);
  const [done, setDone] = useState('-');

  return (
    <Page>
      <Case
        title="onChangeText + placeholder (RN names)"
        note="`value` is Expo's ObservableState from useNativeState (not a string). onChangeText is Expo's onValueChange; placeholder fills the TextField.Placeholder slot. The readout must follow what you type.">
        <TextField value={basic} onChangeText={setTyped} placeholder="Type here" />
        <Readout text={`text="${typed}"`} />
      </Case>

      <Case title="Expo slots: Label, LeadingIcon, TrailingIcon, SupportingText" note="OutlinedTextField with the full Expo slot API.">
        <OutlinedTextField value={email} keyboardOptions={{ keyboardType: 'email', autoCorrectEnabled: false, capitalization: 'none' }}>
          <OutlinedTextField.Label><Text>Email</Text></OutlinedTextField.Label>
          <OutlinedTextField.LeadingIcon><Icon source={ICONS.favorite} size={20} /></OutlinedTextField.LeadingIcon>
          <OutlinedTextField.SupportingText><Text>We never share it</Text></OutlinedTextField.SupportingText>
        </OutlinedTextField>
        <Readout text="keyboard must be the email keyboard" />
      </Case>

      <Case title="secureTextEntry (RN name)" note="Expo: visualTransformation='password'.">
        <TextField value={password} secureTextEntry placeholder="Password" />
      </Case>

      <Case title="multiline (RN name) + Expo minLines / maxLines" note="multiline={true} allows several lines; minLines reserves 3.">
        <OutlinedTextField value={bio} multiline minLines={3} maxLines={5} placeholder="Tell us about yourself" />
      </Case>

      <Case title="maxLength (same in both) + isError" note="Typing beyond 8 characters must be blocked. isError turns the field red.">
        <TextField value={limited} maxLength={8} onChangeText={setLimitedText} isError={limitedText.length >= 8} placeholder="Max 8 characters">
          <TextField.SupportingText><Text>{`${limitedText.length}/8`}</Text></TextField.SupportingText>
        </TextField>
      </Case>

      <Case title="editable={false} (RN name)" note="Expo: readOnly. The text must not be editable.">
        <TextField value={refValue} editable={false} />
      </Case>

      <Case title="Expo colors + keyboardActions" note="Press 'done' on the keyboard: the readout shows the submitted value.">
        <TextField
          value={basic}
          keyboardOptions={{ imeAction: 'done' }}
          keyboardActions={{ onDone: (text) => setDone(text) }}
          colors={{ focusedContainerColor: '#EDE9FE', unfocusedContainerColor: '#F3F4F6', cursorColor: '#7C3AED', focusedIndicatorColor: '#7C3AED' }}
          placeholder="Colored"
        />
        <Readout text={`onDone="${done}"`} />
      </Case>

      <Case title="Imperative ref (Expo's TextFieldRef)" note="focus, blur, clear and setText go through the ref.">
        <TextField ref={fieldRef} value={refValue} placeholder="Controlled by buttons" />
        <ActionButton label="focus" tone="neutral" onPress={() => void fieldRef.current?.focus()} />
        <ActionButton label="blur" tone="neutral" onPress={() => void fieldRef.current?.blur()} />
        <ActionButton label="clear" tone="neutral" onPress={() => void fieldRef.current?.clear()} />
        <ActionButton label="setText('Hello')" tone="neutral" onPress={() => void fieldRef.current?.setText('Hello')} />
      </Case>

      <Case title="Two fields in ONE Host" note="Shared Compose root.">
        <Host matchContents>
          <Column verticalArrangement={{ spacedBy: 8 }}>
            <TextField value={basic} placeholder="First" />
            <OutlinedTextField value={bio} placeholder="Second" />
          </Column>
        </Host>
      </Case>
    </Page>
  );
}
