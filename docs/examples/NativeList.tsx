import { HorizontalDivider, ListItem, NativeList, Text } from 'expo-ui-easy';

const rows = Array.from({ length: 1000 }, (_, i) => ({ id: i, title: `Row ${i}` }));

export function Example() {
  return (
    <NativeList
      data={rows}
      keyExtractor={(row) => String(row.id)}
      renderItem={({ item }) => (
        <ListItem>
          <ListItem.HeadlineContent>
            <Text>{item.title}</Text>
          </ListItem.HeadlineContent>
        </ListItem>
      )}
      ItemSeparatorComponent={<HorizontalDivider />}
      onEndReached={() => console.log('load more')}
    />
  );
}
