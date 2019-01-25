import { CollectionData } from './types';

export class Collection {
  data: CollectionData;

  constructor(data: CollectionData) {
    this.data = data;
  }

  containsTrack(trackId) {
    return !!this.data.tracks[trackId];
  }

  static async fromUrl(source: string): Promise<Collection> {
    const resp = await fetch(source);
    const json = await resp.json();
    return new Collection(json);
  }
  static default(): Collection {
    return new Collection({
      tracks: {},
      playlists: {},
    });
  }
}
