import { InfoLookup } from "./infoLookup";
import { Track } from "./track";
import { PlayableTrack, PlayableTrackList, PlayerSettings, PlaylistData } from "./types";

export class Playlist implements PlayableTrackList {
  name: string;
  tracks: Array<PlayableTrack>;
  shuffled: Array<PlayableTrack>;
  ordered: boolean;

  constructor(data: PlaylistData, tracks: Array<PlayableTrack>, ordered: boolean) {
    this.name = data.name;
    this.tracks = tracks;
    this.ordered = ordered;

    if (!ordered) {
      this.tracks.sort(Track.compare);
    }
    this.shuffled = Playlist.shuffle(this.tracks);
  }

  static shuffle(tracks: Array<PlayableTrack>): Array<PlayableTrack> {
    const toShuffle = tracks.concat();
    const toReturn: Array<PlayableTrack> = [];
    while (toShuffle.length > 0) {
      const index = Math.floor(Math.random() * toShuffle.length);
      const track = toShuffle.splice(index, 1)[0];
      toReturn.push(track);
    }
    return toReturn;
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

  jumpToTrack(settings: PlayerSettings, current: PlayableTrack, delta: number) {
    const { tracks, shuffled } = this;
    const arr = settings.shuffle ? shuffled : tracks;
    const index = arr.indexOf(current);
    const newIndex = (arr.length + index + delta) % arr.length;
    return arr[newIndex];
  }
  nextTrack(settings: PlayerSettings, current: PlayableTrack): PlayableTrack {
    return this.jumpToTrack(settings, current, 1);
  }
  prevTrack(settings: PlayerSettings, current: PlayableTrack): PlayableTrack {
    return this.jumpToTrack(settings, current, -1);
  }

  static fromLookup(infoLookup: InfoLookup, data: PlaylistData, ordered = true) {
    const tracks = data.trackIds.map(id => Track.fromLookup(id, infoLookup));
    return new Playlist(data, tracks, ordered);
  }
}
