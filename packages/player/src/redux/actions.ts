
import { PlayableTrack, PlayableTrackList, PlaylistBrowser } from 'jukebox-utils';
import { SEEK_NEXT_TRACK, SEEK_PREV_TRACK, SET_CURRENT_BROWSER, SET_CURRENT_TRACK, SET_CURRENT_TRACKLIST, SET_IS_PLAYING, SET_IS_REPEAT, SET_IS_SHUFFLE, TOGGLE_IS_PLAYING, TOGGLE_IS_REPEAT, TOGGLE_IS_SHUFFLE } from "./actionTypes";

export const setCurrentTrack = (track: PlayableTrack) => ({
  type: SET_CURRENT_TRACK,
  payload: {
    track: track,
  },
});

export const setCurrentTrackList = (trackList: PlayableTrackList) => ({
  type: SET_CURRENT_TRACKLIST,
  payload: {
    trackList: trackList,
  },
});

export const setCurrentBrowser = (browser: PlaylistBrowser) => ({
  type: SET_CURRENT_BROWSER,
  payload: {
    browser: browser,
  },
});

export const setIsPlaying = (isPlaying: boolean) => ({
  type: SET_IS_PLAYING,
  payload: {
    isPlaying,
  },
});

export const setIsShuffle = (shuffle: boolean) => ({
  type: SET_IS_SHUFFLE,
  payload: {
    shuffle,
  },
});

export const setIsRepeat = (repeat: boolean) => ({
  type: SET_IS_REPEAT,
  payload: {
    repeat,
  },
});

export const toggleIsPlaying = () => ({
  type: TOGGLE_IS_PLAYING,
});

export const toggleIsShuffle = () => ({
  type: TOGGLE_IS_SHUFFLE,
});

export const toggleIsRepeat = () => ({
  type: TOGGLE_IS_REPEAT,
});

export const seekNextTrack = () => ({
  type: SEEK_NEXT_TRACK,
});

export const seekPrevTrack = () => ({
  type: SEEK_PREV_TRACK,
});
