import { ColorScheme, WebConfig } from 'jukebox-utils'

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

export const getColorScheme = (webConfig: WebConfig): ColorScheme => {
  const { colorScheme, customColors } = webConfig;
  const scheme = (colorScheme && lookup[colorScheme]) || lookup['default'];
  return {
    ...scheme,
    ...(customColors || {}),
  };
};
