import queryString from 'query-string';
import { DefaultWebConfig, WebConfig } from './types';

const isBrowser = typeof window !== 'undefined';

// function readConfig(name: string): (undefined | boolean | string | Array<string>) {
function readConfig(name: string, defaults: DefaultWebConfig): undefined | any {
  if (isBrowser) {
    const parsed = queryString.parse(location.search);
    if (parsed[name] !== undefined) {
      return parsed[name];
    }
  }
  return defaults[name];
}
function readConfigArray(
  name: string,
  defaults: DefaultWebConfig,
): undefined | Array<string> {
  const value = readConfig(name, defaults);
  if (value === undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [String(value)];
}

export const getWebConfig = (codeConfig?: DefaultWebConfig): WebConfig => {
  const defaults: DefaultWebConfig = {
    playlist: undefined,
    playlist_only: false,
    only_jukebox: false,
    color_scheme: undefined,
    ...codeConfig,
  };
  return {
    PlaylistWhitelist: readConfigArray('playlist', defaults),
    HideAggregateLists: !!readConfig('playlist_only', defaults),
    OnlyJukebox: !!readConfig('only_jukebox', defaults),
    ColorScheme: readConfig('color_scheme', defaults),
  };
};
