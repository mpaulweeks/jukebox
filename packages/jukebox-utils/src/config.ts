import queryString from 'query-string';

const isBrowser = (typeof window !== 'undefined');

function readConfig(name: string): (undefined | boolean | string | Array<string>) {
  if (isBrowser) {
    const parsed = queryString.parse(location.search);
    if (parsed[name] !== undefined) {
      return parsed[name] || true;
    }
  }
  return undefined;
}
function readConfigArray(name: string): (undefined | Array<string>) {
  const value = readConfig(name);
  if (!value) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [String(value)];
}

const PlaylistWhitelist = readConfigArray('playlist');
const HideOtherLists = !!readConfig('playlist_only');

export const Config = {
  PlaylistWhitelist,
  HideOtherLists,
}
