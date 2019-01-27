import { CollectionData, PlaylistData } from './types';

export class Collection {
  data: CollectionData;

  constructor(data: CollectionData) {
    this.data = data;
  }

  private comparePlaylists(a: PlaylistData, b: PlaylistData) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 1;
  }

  containsTrack(trackId) {
    return !!this.data.tracks[trackId];
  }
  containsImage(imageHash) {
    return !!this.data.images[imageHash];
  }
  getPlaylists() {
    const { playlists } = this.data;
    const arr = Object.keys(playlists).map(key => playlists[key]);
    arr.sort(this.comparePlaylists);
    return arr;
  }

  static async fromUrl(source: string): Promise<Collection> {
    const resp = await fetch(source);
    const json = await resp.json();
    return new Collection(json);
  }
  static default(): Collection {
    return new Collection({
      playlists: {},
      tracks: {},
      images: {},
    });
  }
}
