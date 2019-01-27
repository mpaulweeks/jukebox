
interface BasicData {
  album: string,
  artist: string,
  title: string,
  year: string,
  imageFormat?: string,
}

export interface MetaData extends BasicData {
  imageBuffer?: Buffer,
};

export interface SongData extends BasicData {
  id: string,
  updated: Date,
  imageHash?: string,
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
