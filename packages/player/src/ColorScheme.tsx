import { string } from "prop-types";

export interface ColorScheme {
  foreground: string;
  background: string;
  highlightForeground: string;
  highlightBackground: string;
}

interface SchemeLookup {
  [key: string]: ColorScheme;
}

const lookup: SchemeLookup = {
  light: {
    foreground: 'black',
    background: 'white',
    highlightForeground: 'black',
    highlightBackground: 'lightgrey',
  },
  dark: {
    foreground: 'white',
    background: 'black',
    highlightForeground: 'white',
    highlightBackground: '#404040',
  },
};
lookup.default = lookup.light;

export const getColorScheme = (colorScheme?: string): ColorScheme => {
  return (colorScheme && lookup[colorScheme]) || lookup['default'];
};
