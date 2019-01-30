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

  static default(): InfoLookup {
    return new InfoLookup({});
  }
}
