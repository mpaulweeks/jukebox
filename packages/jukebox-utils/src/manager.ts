import { Collection } from './collection';
import { Config } from './config';
import { fetchCollection, fetchInfoLookup } from './fetch';
import { InfoLookup } from './infoLookup';
import { Playlist } from './playlist';

export class Manager {
  collection: Collection;
  infoLookup: InfoLookup;

  playlists: Array<Playlist>;
  otherLists: Array<Playlist>;

  constructor(collection: Collection, infoLookup: InfoLookup) {
    this.collection = collection;
    this.infoLookup = infoLookup;

    const { PlaylistWhitelist } = Config;

    let playlistTracks = {};
    const unsortedPlaylists = Object.keys(collection.data.playlists)
      .filter(key => PlaylistWhitelist ? PlaylistWhitelist.includes(key) : true)
      .map(key => {
        const data = collection.data.playlists[key];
        playlistTracks = {
          ...playlistTracks,
          ...data.trackIds.reduce((obj, id) => {
            obj[id] = true;
            return obj;
          }, {}),
        }
        return Playlist.fromLookup(infoLookup, data);
      });
    unsortedPlaylists.sort(Playlist.compare);
    this.playlists = unsortedPlaylists;


    const allSongs = Playlist.fromLookup(infoLookup, {
      name: 'All Songs',
      trackIds: Object.keys(PlaylistWhitelist ? playlistTracks : collection.data.tracks),
    }, false);
    this.otherLists = [allSongs];
  }

  static async fetch(): Promise<Manager> {
    const collection = await fetchCollection();
    const infoLookup = await fetchInfoLookup();
    return new Manager(collection, infoLookup);
  }
}
