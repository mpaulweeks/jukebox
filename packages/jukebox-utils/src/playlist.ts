import { InfoLookupData, PlaylistData, TrackData } from "./types";

export class Playlist {
  data: PlaylistData;
  tracks: Array<TrackData>;

  constructor(playlistData: PlaylistData, InfoLookupData: InfoLookupData, ) {
    this.data = playlistData;
    this.tracks = playlistData.trackIds.map(id => InfoLookupData[id]);
  }
}
