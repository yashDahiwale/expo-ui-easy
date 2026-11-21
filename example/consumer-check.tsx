// Compiled by tsconfig.consumer.json against the BUILT package (lib/typescript), the way an app that installed
// expo-ui-easy from npm sees it. Run `npm run build` first, then `npm run typecheck:consumer`.
import { Button, Host, NativeList, Switch, Text, TextField, background, useNativeState } from 'expo-ui-easy';

export function ConsumerCheck() {
  const text = useNativeState('');
  return (
    <Host matchContents>
      <Switch value onValueChange={(v: boolean) => void v} disabled />
      <Button onPress={() => {}} startIcon={<Text>i</Text>}>Go</Button>
      <TextField value={text} onChangeText={(s: string) => void s} placeholder="x" modifiers={[background('red')]} />
      <NativeList data={[1, 2, 3]} renderItem={({ item }) => <Text>{String(item)}</Text>} keyExtractor={(n) => String(n)} />
    </Host>
  );
}
