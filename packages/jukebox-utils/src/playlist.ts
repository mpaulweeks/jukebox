import { InfoLookupData, PlaylistData, SongData } from "./types";

export class Playlist {
  data: PlaylistData;
  tracks: Array<SongData>;

  constructor(playlistData: PlaylistData, InfoLookupData: InfoLookupData, ) {
    this.data = playlistData;
    this.tracks = playlistData.trackIds.map(id => InfoLookupData[id]);
  }
}
