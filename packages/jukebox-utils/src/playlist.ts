import { InfoLookup } from "./infoLookup";
import { Track } from "./track";
import { PlaylistData } from "./types";

export class Playlist {
  name: string;
  tracks: Array<Track>;

  constructor(data: PlaylistData, tracks: Array<Track>) {
    this.name = data.name;
    this.tracks = tracks;
  }

  static fromLookup(data: PlaylistData, infoLookup: InfoLookup) {
    const tracks = data.trackIds.map(id => Track.fromLookup(id, infoLookup));
    return new Playlist(data, tracks);
  }
}
