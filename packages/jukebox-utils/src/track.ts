import { Constants } from './constants';
import { getAudioUrl } from './fetch';
import { InfoLookup } from './infoLookup';
import { TrackData } from './types';

export class Track {
  id: string;
  album: string;
  artist: string;
  title: string;
  year: string;

  audioSrc: string;
  imageSrc?: string;

  constructor(trackData: TrackData) {
    const {
      id,
      album,
      artist,
      title,
      year,
      imageHash,
    } = trackData;
    this.id = id;
    this.album = album;
    this.artist = artist;
    this.title = title;
    this.year = year;

    this.audioSrc = getAudioUrl(id);
    this.imageSrc = imageHash && `${Constants.ImageRootPath}/${imageHash}`;
  }

  static fromLookup(id: string, infoLookup: InfoLookup) {
    return new Track(infoLookup.get(id));
  }
}
