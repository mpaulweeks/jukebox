import { InfoLookupData } from './types';

export class InfoLookup {
  data: InfoLookupData;

  constructor(data: InfoLookupData) {
    this.data = data;
  }

  containsTrack(trackId) {
    return !!this.get(trackId);
  }
  get(trackId) {
    return this.data[trackId];
  }

  static async fromUrl(source: string): Promise<InfoLookup> {
    const resp = await fetch(source);
    const json = await resp.json();
    return new InfoLookup(json);
  }

  static default(): InfoLookup {
    return new InfoLookup({});
  }
}
