import { CollectionData } from './types';

export class Collection {
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

  static default(): Collection {
    return new Collection({
      playlists: {},
      tracks: {},
      images: {},
    });
  }
}
