import { InfoLookup } from "./infoLookup";
import { Track } from "./track";
import { PlayableTrack, PlayableTrackList, PlaylistData } from "./types";

export class Playlist implements PlayableTrackList {
  name: string;
  tracks: Array<PlayableTrack>;
  ordered: boolean;

  constructor(data: PlaylistData, tracks: Array<PlayableTrack>, ordered: boolean) {
    this.name = data.name;
    this.tracks = tracks;
    this.ordered = ordered;

    if (!ordered) {
      this.tracks.sort(Track.compare);
    }
  }

  static compare(a: PlayableTrackList, b: PlayableTrackList) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 1;
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

  static fromLookup(infoLookup: InfoLookup, data: PlaylistData, ordered = true) {
    const tracks = data.trackIds.map(id => Track.fromLookup(id, infoLookup));
    return new Playlist(data, tracks, ordered);
  }
}
