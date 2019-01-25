
export interface UrlList {
  updated: Date,
  urls: Array<string>,
};

export interface MetaData {
  album: string,
  artist: string,
  title: string,
  year: string,
  imageSrc: string,
};

export interface PlaylistData {
  name: string,
  trackIds: Array<string>,
};

export interface SongData extends MetaData {
  source: string,
  updated: Date,
};

export interface SongLookup {
  [source: string]: SongData,
};

export interface CollectionData {
  playlists: Array<PlaylistData>,
  songs: SongLookup,
};
