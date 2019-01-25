
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

export interface SongData extends MetaData {
  source: string,
  updated: Date,
};

export interface SongDataBase {
  [id: string]: SongData,
};


export interface TrackList {
  // key: string track id in itunes
  // value: summary of song, for human readability
  [id: string]: string,
};

export interface PlaylistData {
  name: string,
  trackIds: Array<string>,
};

export interface CollectionData {
  playlists: Array<PlaylistData>,
  tracks: TrackList,
};
