import Constants from "./constants";
import { MetaLoader } from "./meta";
import { MetaData, SongData } from "./types";

export class SongLoader {
  static compileSongData(id: string, metaData: MetaData): SongData {
    return {
      ...metaData,
      id: id,
      updated: new Date(),
    };
  }
  static async fromFile(id: string, location: string): Promise<SongData> {
    console.log(id, location);
    const metaData = await MetaLoader.fromFile(location);
    return this.compileSongData(id, metaData);
  }
  static async fromId(songId: string): Promise<SongData> {
    const url = `${Constants.AudioRootPath}/${songId}`;
    const metaData = await MetaLoader.fromUrl(url);
    return this.compileSongData(url, metaData);
  }
}
