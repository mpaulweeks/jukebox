import { MetaLoader } from "./meta";
import { MetaData, SongData } from "./types";

export class SongLoader {
  static compileSongData(source: string, metaData: MetaData): SongData {
    return {
      ...metaData,
      source,
      updated: new Date(),
    };
  }
  static async fromId(songId: string): Promise<SongData> {
    const url = 'todo s3/' + songId;
    const metaData = await MetaLoader.fromUrl(url);
    return this.compileSongData(url, metaData);
  }
}
