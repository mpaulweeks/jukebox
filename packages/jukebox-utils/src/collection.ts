import { CollectionData } from './types';

export class Collection {
  static default(): Collection {
    return new Collection({
      playlists: {},
      tracks: {},
      images: {},
    });
  }

  data: CollectionData;

  constructor(data: CollectionData) {
    this.data = data;
  }

  containsTrack(trackId) {
    return !!this.data.tracks[trackId];
  }
  containsImage(imageHash) {
    return !!this.data.images[imageHash];
  }
}
