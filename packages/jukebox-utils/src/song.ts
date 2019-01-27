import Constants from "./constants";
import { MetaLoader } from "./meta";
import { MetaData, SongData } from "./types";
import md5 = require("md5");

export class SongLoader {
  static compileSongData(id: string, metaData: MetaData): SongData {
    return {
      album: metaData.album,
      artist: metaData.artist,
      title: metaData.title,
      year: metaData.year,
      imageFormat: metaData.imageFormat,

      id: id,
      updated: new Date(),
      imageHash: metaData.imageBuffer && md5(metaData.imageBuffer),
    };
  }
  static async fromId(id: string): Promise<SongData> {
    const url = `${Constants.AudioRootPath}/${id}`;
    const metaData = await MetaLoader.fromUrl(url);
    return this.compileSongData(id, metaData);
  }
}
