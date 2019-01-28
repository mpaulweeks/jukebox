import { Collection } from './collection';
import { fetchCollection, fetchInfoLookup } from './fetch';
import { InfoLookup } from './infoLookup';
import { Playlist } from './playlist';

export class Manager {
  collection: Collection;
  infoLookup: InfoLookup;

  playlists: Array<Playlist>;

  constructor(collection: Collection, infoLookup: InfoLookup) {
    this.collection = collection;
    this.infoLookup = infoLookup;

    const allSongs = Playlist.fromLookup(infoLookup, {
      name: 'All Songs',
      trackIds: Object.keys(collection.data.tracks),
    }, false);

    const unsortedPlaylists = Object.keys(collection.data.playlists).map(key => {
      const data = collection.data.playlists[key];
      return Playlist.fromLookup(infoLookup, data);
    });
    unsortedPlaylists.sort(Playlist.compare);
    this.playlists = [allSongs].concat(unsortedPlaylists);
  }

  static async fetch(): Promise<Manager> {
    const collection = await fetchCollection();
    const infoLookup = await fetchInfoLookup();
    return new Manager(collection, infoLookup);
  }
}
