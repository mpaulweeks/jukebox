import queryString from 'query-string';

const isBrowser = (typeof window !== 'undefined');

// function readConfig(name: string): (undefined | boolean | string | Array<string>) {
function readConfig(name: string, defaultValue?: any): undefined | any {
  if (isBrowser) {
    const appWindow: any = window;
    const parsed = queryString.parse(location.search);
    if (parsed[name] !== undefined) {
      return parsed[name];
    }
    const configObj = appWindow.JUKEBOX_CONFIG || {};
    if (configObj[name] !== undefined) {
      return configObj[name];
    }
  }
  return defaultValue;
}
function readConfigArray(name: string, defaultValue?: Array<string>): undefined | Array<string> {
  const value = readConfig(name, defaultValue);
  if (value === undefined) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [String(value)];
}

const PlaylistWhitelist = readConfigArray('playlist', undefined);
const HideAggregateLists = !!readConfig('playlist_only', false);
const OnlyJukebox = !!readConfig('only_jukebox', false);

export const WebConfig = {
  PlaylistWhitelist,
  HideAggregateLists,
  OnlyJukebox,
}
