export interface ColorScheme {
  foreground: string;
  background: string;
  hover: string;
  highlight: string;
  collapseForeground: string;
  collapseBackground: string;
}

interface SchemeLookup {
  [key: string]: ColorScheme;
}

const lookup: SchemeLookup = {
  light: {
    foreground: 'black',
    background: 'white',
    hover: 'darkgrey',
    highlight: 'lightblue',
    collapseForeground: 'white',
    collapseBackground: 'grey',
  },
  dark: {
    foreground: 'white',
    background: 'black',
    hover: 'lightgrey',
    highlight: 'blue',
    collapseForeground: 'black',
    collapseBackground: 'grey',
  },
};
lookup.default = lookup.light;

export const getColorScheme = (colorScheme?: string): ColorScheme => {
  return (colorScheme && lookup[colorScheme]) || lookup['default'];
};
