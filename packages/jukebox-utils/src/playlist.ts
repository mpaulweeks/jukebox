import { PlaylistData, SongData, SongDataBase } from "./types";

export class Playlist {
  data: PlaylistData;
  tracks: Array<SongData>;

  constructor(playlistData: PlaylistData, songDataBase: SongDataBase, ) {
    this.data = playlistData;
    this.tracks = playlistData.trackIds.map(id => songDataBase[id]);
  }
}
