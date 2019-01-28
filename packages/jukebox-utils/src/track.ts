import { Constants } from './constants';
import { getAudioUrl } from './fetch';
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

  constructor(trackData: TrackData) {
    const {
      id,
      album,
      artist,
      title,
      year,
      trackNumber,
      imageHash,
    } = trackData;
    this.id = id;
    this.album = album;
    this.artist = artist;
    this.title = title;
    this.year = year;
    this.trackNumber = trackNumber;

    if (trackNumber && trackNumber.split('/').length === 2) {
      this.trackNumerator = parseFloat(trackNumber.split('/')[0]);
      this.trackDenominator = parseFloat(trackNumber.split('/')[1]);
    }

    this.audioSrc = getAudioUrl(id);
    this.imageSrc = imageHash && `${Constants.ImageRootPath}/${imageHash}`;
  }

  static fromLookup(id: string, infoLookup: InfoLookup) {
    return new Track(infoLookup.get(id));
  }
}
