import { Icon } from '@expo/ui';
import AddIcon from '@expo/material-symbols/add.xml';
import { Button } from 'expo-ui-easy';

export function Example() {
  return (
    <Button variant="outlined" onPress={() => console.log('pressed')} startIcon={<Icon name={AddIcon} size={18} />}>
      Add item
    </Button>
  );
}
