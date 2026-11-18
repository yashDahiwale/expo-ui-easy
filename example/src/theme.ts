import { useColorScheme } from 'react-native';

export interface Theme {
  bg: string;
  card: string;
  text: string;
  subtle: string;
  border: string;
  accent: string;
  danger: string;
}

const light: Theme = {
  bg: '#F6F4F8', card: '#FFFFFF', text: '#1C1B1F', subtle: '#625B71',
  border: '#E3DFE8', accent: '#6750A4', danger: '#B3261E',
};
const dark: Theme = {
  bg: '#141218', card: '#211F26', text: '#E6E0E9', subtle: '#CAC4D0',
  border: '#36343B', accent: '#D0BCFF', danger: '#F2B8B5',
};

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}
