interface BasicData {
  album: string;
  artist: string;
  title: string;
  year: string;
  trackNumber?: string;
  imageFormat?: string;
}

export interface MetaData extends BasicData {
  imageBuffer?: Buffer;
  duration: number;
}

export interface TrackData extends BasicData {
  id: string;
  updated: Date;
  imageHash?: string;
  duration: number;
}

export interface InfoLookupData {
  [id: string]: TrackData;
}

export interface PlayableTrack extends BasicData {
  id: string;
  trackNumerator?: number;
  trackDenominator?: number;
  trackNumberDisplay?: string;
  sortKey: string;
  audioSrc: string;
  imageSrc?: string;
  durationDisplay: string;
}

export interface PlayableTrackList {
  name: string;
  tracks: PlayableTrack[];
  custom: boolean;
  imageSrc?: string;
  album?: string;
  nextTrack(PlayerSettings, PlayableTrack): PlayableTrack;
  prevTrack(PlayerSettings, PlayableTrack): PlayableTrack;
}

export interface PlaylistBrowserData {
  // album/artist to trackIds
  [key: string]: string[];
}

/////////////////////
// data.json stuff //
/////////////////////

export interface PlaylistData {
  name: string;
  trackIds: string[];
}

export interface CollectionPlaylists {
  // key: string name of playlsit
  // value: playlistData
  [id: string]: PlaylistData;
}

export interface CollectionTrackLists {
  // key: string track id in itunes
  // value: summary of song, for human readability
  [id: string]: string;
}

export interface CollectionImageLists {
  // key: string hash of image buffer
  // value: album name
  [id: string]: string;
}

export interface CollectionData {
  playlists: CollectionPlaylists;
  tracks: CollectionTrackLists;
  images: CollectionImageLists;
}

export interface DataLoaderWithDefault<Data, Loader> {
  new(data: Data): Loader;
  default(): Loader;
}

/////////////
// playing //
/////////////
export interface PlayerSettings {
  isPlaying: boolean;
  repeat: boolean;
  shuffle: boolean;
}
export interface ColorScheme {
  foreground: string;
  background: string;
  highlightForeground: string;
  highlightBackground: string;
}
export interface DefaultWebConfig {
  playlists?: undefined | string[];
  hideAlbums?: boolean;
  onlyJukebox?: boolean;
  colorScheme?: string;
  customColors?: ColorScheme;
}
export interface WebConfig {
  playlists: undefined | string[];
  hideAlbums: boolean;
  onlyJukebox: boolean;
  colorScheme: string;
  customColors?: ColorScheme;
}
