
interface BasicData {
  album: string,
  artist: string,
  title: string,
  year: string,
  trackNumber?: string,
  imageFormat?: string,
}

export interface MetaData extends BasicData {
  imageBuffer?: Buffer,
  duration: number,
};

export interface TrackData extends BasicData {
  id: string,
  updated: Date,
  imageHash?: string,
  duration: number,
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
  durationDisplay: string,
}

export interface PlayableTrackList {
  name: string,
  tracks: Array<PlayableTrack>,
  custom: boolean,
  imageSrc?: string,
  album?: string,
  nextTrack(PlayerSettings, PlayableTrack): PlayableTrack,
  prevTrack(PlayerSettings, PlayableTrack): PlayableTrack,
}

export interface PlaylistBrowserData {
  // album/artist to trackIds
  [key: string]: Array<string>,
};


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

export interface DataLoaderWithDefault<Data, Loader> {
  new(data: Data): Loader;
  default(): Loader,
}

/////////////
// playing //
/////////////
export interface PlayerSettings {
  isPlaying: boolean,
  repeat: boolean,
  shuffle: boolean,
};
export interface DefaultWebConfig {
  playlist?: undefined | Array<string>,
  playlist_only?: boolean,
  only_jukebox?: boolean,
  color_scheme?: string,
};
export interface WebConfig {
  PlaylistWhitelist: undefined | Array<string>,
  HideAggregateLists: boolean,
  OnlyJukebox: boolean,
  ColorScheme: string,
};
