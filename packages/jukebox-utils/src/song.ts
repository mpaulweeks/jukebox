import md5 from 'md5';
import { Constants } from './constants';
import { MetaLoader } from './meta';
import { MetaData, TrackData } from './types';

export class SongLoader {
  static compileTrackData(id: string, metaData: MetaData): TrackData {
    return {
      album: metaData.album,
      artist: metaData.artist,
      title: metaData.title,
      year: metaData.year,
      duration: metaData.duration,
      trackNumber: metaData.trackNumber,
      imageFormat: metaData.imageFormat,

      id: id,
      updated: new Date(),
      imageHash: metaData.imageBuffer && md5(metaData.imageBuffer),
    };
  }
  static async fromId(id: string): Promise<TrackData> {
    const url = `${Constants.AudioPath}/${id}`;
    const metaData = await MetaLoader.fromUrl(url);
    return this.compileTrackData(id, metaData);
  }
}
