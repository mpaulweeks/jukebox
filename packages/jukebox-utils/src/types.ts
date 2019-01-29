
interface BasicData {
  album: string,
  artist: string,
  title: string,
  year: string,
  duration: number,
  trackNumber?: string,
  imageFormat?: string,
}

export interface MetaData extends BasicData {
  imageBuffer?: Buffer,
};

export interface TrackData extends BasicData {
  id: string,
  updated: Date,
  imageHash?: string,
};

export interface InfoLookupData {
  [id: string]: TrackData,
};

export interface PlayableTrack extends BasicData {
  id: string,
  trackNumerator?: number,
  trackDenominator?: number,
  trackNumberDisplay?: string,
  sortKey: string,
  audioSrc: string,
  imageSrc?: string,
}

export interface PlayableTrackList {
  name: string,
  tracks: Array<PlayableTrack>,
  ordered: boolean;
  nextTrack(PlayerSettings, PlayableTrack): PlayableTrack,
  prevTrack(PlayerSettings, PlayableTrack): PlayableTrack,
}

/////////////////////
// data.json stuff //
/////////////////////

export interface PlaylistData {
  name: string,
  trackIds: Array<string>,
};

export interface CollectionPlaylists {
  // key: string name of playlsit
  // value: playlistData
  [id: string]: PlaylistData,
};

export interface CollectionTrackLists {
  // key: string track id in itunes
  // value: summary of song, for human readability
  [id: string]: string,
};

export interface CollectionImageLists {
  // key: string hash of image buffer
  // value: album name
  [id: string]: string,
};

export interface CollectionData {
  playlists: CollectionPlaylists,
  tracks: CollectionTrackLists,
  images: CollectionImageLists,
};

/////////////
// playing //
/////////////
export interface PlayerSettings {
  isPlaying: boolean,
  repeat: boolean,
  shuffle: boolean,
};
