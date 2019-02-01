import { InfoLookup } from "./infoLookup";
import { notEmpty } from "./tools";
import { Track } from "./track";
import { PlayableTrack, PlayableTrackList, PlayerSettings, PlaylistData } from "./types";

export class Playlist implements PlayableTrackList {
  name: string;
  tracks: Array<PlayableTrack>;
  shuffled: Array<PlayableTrack>;
  custom: boolean;
  imageSrc?: string;
  album?: string;
  artist?: string;

  constructor(name: string, tracks: Array<PlayableTrack>, custom: boolean) {
    this.name = name;
    this.tracks = tracks;
    this.custom = custom;

    if (!custom) {
      this.tracks.sort(Track.compare);
    }
    this.shuffled = Playlist.shuffle(this.tracks);

    this.imageSrc = this.tracks.length ? this.tracks[0].imageSrc : undefined;
    this.album = this.tracks.length ? (this.tracks[0].album || this.tracks[0].title) : undefined;
    this.artist = this.tracks.length ? this.tracks[0].artist : undefined;
  }

  randomTrack() {
    const { tracks } = this;
    return tracks[Math.floor(Math.random() * tracks.length)];
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

  static fromLookup(infoLookup: InfoLookup, data: PlaylistData, custom?: boolean) {
    const tracks = data.trackIds
      .map(id => Track.fromLookup(id, infoLookup))
      .filter(notEmpty);
    return new Playlist(data.name, tracks, !!custom);
  }
}
