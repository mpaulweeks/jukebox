
export interface MetaData {
  album: string,
  artist: string,
  title: string,
  year: string,
  imageSrc: string,
};

export interface SongData extends MetaData {
  id: string,
  updated: Date,
};

export interface InfoLookupData {
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

export interface PlaylistList {
  // key: string name of playlsit
  // value: playlistData
  [id: string]: PlaylistData,
};

export interface CollectionData {
  playlists: PlaylistList,
  tracks: TrackList,
};
