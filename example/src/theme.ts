import { useColorScheme } from 'react-native';

/** Color tokens. Material3-flavoured so the RN chrome sits comfortably next to the Compose components. */
export interface Theme {
  /** Screen background. */
  bg: string;
  /** Cards and elevated surfaces. */
  card: string;
  /** Inset wells (code blocks, readouts, search field). */
  well: string;
  text: string;
  subtle: string;
  border: string;
  accent: string;
  /** Text / icon color on top of `accent`. */
  onAccent: string;
  /** Tinted background for selected chips and badges. */
  accentContainer: string;
  onAccentContainer: string;
  danger: string;
  warning: string;
  warningContainer: string;
  onWarningContainer: string;
  dark: boolean;
}

const light: Theme = {
  bg: '#FEF7FF', card: '#FFFFFF', well: '#F3EDF7', text: '#1D1B20', subtle: '#625B71',
  border: '#E6E0E9', accent: '#6750A4', onAccent: '#FFFFFF', accentContainer: '#EADDFF', onAccentContainer: '#21005D',
  danger: '#B3261E', warning: '#7D5700', warningContainer: '#FFDEA6', onWarningContainer: '#271900', dark: false,
};

const dark: Theme = {
  bg: '#141218', card: '#211F26', well: '#2B2930', text: '#E6E0E9', subtle: '#CAC4D0',
  border: '#36343B', accent: '#D0BCFF', onAccent: '#381E72', accentContainer: '#4F378B', onAccentContainer: '#EADDFF',
  danger: '#F2B8B5', warning: '#FFB951', warningContainer: '#5E4200', onWarningContainer: '#FFDEA6', dark: true,
};

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;
/** Minimum touch target on Android (dp). */
export const TOUCH = 48;
