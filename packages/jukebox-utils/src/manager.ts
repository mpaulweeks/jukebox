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

    const unsortedPlaylists = Object.keys(collection.data.playlists).map(key => {
      const data = collection.data.playlists[key];
      return Playlist.fromLookup(data, infoLookup);
    });
    unsortedPlaylists.sort(this.comparePlaylists);
    this.playlists = unsortedPlaylists;
  }

  private comparePlaylists(a: Playlist, b: Playlist) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 1;
  }

  static async fetch(): Promise<Manager> {
    const collection = await fetchCollection();
    const infoLookup = await fetchInfoLookup();
    return new Manager(collection, infoLookup);
  }
}
