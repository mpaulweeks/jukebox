import { InfoLookup } from "./infoLookup";
import { Playlist } from "./playlist";
import { PlaylistBrowserData } from "./types";

export class PlaylistBrowser {
  name: string;
  playlists: Array<Playlist>;

  constructor(infoLookup: InfoLookup, name: string, browserData: PlaylistBrowserData) {
    this.name = name;
    this.playlists = Object.keys(browserData).map(key => Playlist.fromLookup(infoLookup, {
      name: key,
      trackIds: browserData[key],
    }, false));
  }
}
