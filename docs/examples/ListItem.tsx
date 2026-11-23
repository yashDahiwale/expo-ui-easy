import { Card, Host, ListItem, Text } from 'expo-ui-easy';

export function Example() {
  return (
    <Host matchContents>
      <Card>
        <ListItem>
          <ListItem.OverlineContent><Text>Overline</Text></ListItem.OverlineContent>
          <ListItem.HeadlineContent><Text>Headline</Text></ListItem.HeadlineContent>
          <ListItem.SupportingContent><Text>Supporting text</Text></ListItem.SupportingContent>
        </ListItem>
      </Card>
    </Host>
  );
}
