import { MetaData, SongData } from "./types";

export const compileSongData = (source: string, metaData: MetaData): SongData => {
  return {
    ...metaData,
    source,
    updated: new Date(),
  };
}
