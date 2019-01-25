import { PlaylistData, SongData, SongLookup } from "./types";

export class Playlist {
  data: PlaylistData;
  tracks: Array<SongData>;

  constructor(playlistData: PlaylistData, songLookup: SongLookup, ) {
    this.data = playlistData;
    this.tracks = playlistData.trackIds.map(id => songLookup[id]);
  }
}
