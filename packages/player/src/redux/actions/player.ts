import { PlayableTrack, PlayableTrackList, PlaylistBrowser } from 'jukebox-utils';
import * as TYPES from '../actionTypes';

export const setCurrentTrack = (track: PlayableTrack) => ({
  type: TYPES.SET_CURRENT_TRACK,
  payload: {
    track: track,
  },
});
export const setCurrentTrackList = (trackList: PlayableTrackList) => ({
  type: TYPES.SET_CURRENT_TRACKLIST,
  payload: {
    trackList: trackList,
  },
});
export const setCurrentBrowser = (browser: PlaylistBrowser) => ({
  type: TYPES.SET_CURRENT_BROWSER,
  payload: {
    browser: browser,
  },
});

export const setSeekByPercent = (percent: number) => ({
  type: TYPES.SET_SEEK_BY_PERCENT,
  payload: {
    seekPercent: percent,
  },
});
export const setSeekBySeconds = (seconds: number) => ({
  type: TYPES.SET_SEEK_BY_SECONDS,
  payload: {
    seekSeconds: seconds,
  },
});
export const setSeekByDelta = (delta: number) => ({
  type: TYPES.SET_SEEK_BY_DELTA,
  payload: {
    seekDelta: delta,
  },
});
export const resolveSeek = () => ({
  type: TYPES.RESOLVE_SEEK,
});

export const setIsPlaying = (isPlaying: boolean) => ({
  type: TYPES.SET_IS_PLAYING,
  payload: {
    isPlaying,
  },
});
export const setIsShuffle = (shuffle: boolean) => ({
  type: TYPES.SET_IS_SHUFFLE,
  payload: {
    shuffle,
  },
});
export const setIsRepeat = (repeat: boolean) => ({
  type: TYPES.SET_IS_REPEAT,
  payload: {
    repeat,
  },
});

export const toggleIsPlaying = () => ({
  type: TYPES.TOGGLE_IS_PLAYING,
});
export const toggleIsShuffle = () => ({
  type: TYPES.TOGGLE_IS_SHUFFLE,
});
export const toggleIsRepeat = () => ({
  type: TYPES.TOGGLE_IS_REPEAT,
});
export const seekNextTrack = () => ({
  type: TYPES.SEEK_NEXT_TRACK,
});
export const seekPrevTrack = () => ({
  type: TYPES.SEEK_PREV_TRACK,
});
