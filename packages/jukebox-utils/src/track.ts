import { Constants } from './constants';
import { InfoLookup } from './infoLookup';
import { PlayableTrack, TrackData } from './types';

export class Track implements PlayableTrack {
  id: string;
  album: string;
  artist: string;
  title: string;
  year: string;

  imageFormat?: string;
  trackNumber?: string;

  audioSrc: string;
  imageSrc?: string;
  trackNumerator?: number;
  trackDenominator?: number;
  trackNumberDisplay?: string;
  durationDisplay: string;
  sortKey: string;

  constructor(trackData: TrackData) {
    const {
      id,
      album,
      artist,
      title,
      year,
      duration,
      trackNumber,
      imageHash,
    } = trackData;
    this.id = id;
    this.album = album;
    this.artist = artist;
    this.title = title;
    this.year = year;
    this.trackNumber = trackNumber;

    if (trackNumber) {
      if (trackNumber.split('/').length === 2) {
        this.trackNumerator = parseFloat(trackNumber.split('/')[0]);
        this.trackDenominator = parseFloat(trackNumber.split('/')[1]);
        this.trackNumberDisplay = `${this.trackNumerator}/${this.trackDenominator}`;
      } else if (!trackNumber.includes('/')) {
        this.trackNumerator = parseFloat(trackNumber);
        this.trackNumberDisplay = `${this.trackNumerator}`;
      }
    }

    this.durationDisplay = (duration ? `${Math.floor(duration / 60)}:${String(Math.floor(duration % 60)).padStart(2, '0')}` : '')

    this.sortKey = `${this.album} ${String(this.trackNumerator || 0).padStart(4, '0')}`;

    this.audioSrc = `${Constants.AudioPath}/${id}`;
    this.imageSrc = imageHash && `${Constants.ImagePath}/${imageHash}`;
  }

  static compare(a: PlayableTrack, b: PlayableTrack) {
    if (a.sortKey < b.sortKey) {
      return -1;
    }
    if (a.sortKey > b.sortKey) {
      return 1;
    }
    return 1;
  }

  static fromLookup(id: string, infoLookup: InfoLookup): (undefined | Track) {
    const info = infoLookup.get(id);
    if (!info) {
      console.log('failed track lookup! ID:', id);
    }
    return info && new Track(info);
  }
}
