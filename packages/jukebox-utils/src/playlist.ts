import { InfoLookup } from "./infoLookup";
import { Track } from "./track";
import { PlayableTrack, PlayableTrackList, PlaylistData } from "./types";

export class Playlist implements PlayableTrackList {
  name: string;
  tracks: Array<PlayableTrack>;

  constructor(data: PlaylistData, tracks: Array<PlayableTrack>) {
    this.name = data.name;
    this.tracks = tracks;
  }

  nextTrack(track: PlayableTrack): PlayableTrack {
    const index = this.tracks.indexOf(track);
    const newIndex = (this.tracks.length + index + 1) % this.tracks.length;
    return this.tracks[newIndex];
  }
  prevTrack(track: PlayableTrack): PlayableTrack {
    const index = this.tracks.indexOf(track);
    const newIndex = (this.tracks.length + index - 1) % this.tracks.length;
    return this.tracks[newIndex];
  }

  static fromLookup(data: PlaylistData, infoLookup: InfoLookup) {
    const tracks = data.trackIds.map(id => Track.fromLookup(id, infoLookup));
    return new Playlist(data, tracks);
  }
}
