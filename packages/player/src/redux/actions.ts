
import { PlayableTrack, PlayableTrackList, PlaylistBrowser } from 'jukebox-utils';
import { SET_CURRENT_BROWSER, SET_CURRENT_TRACK, SET_CURRENT_TRACKLIST } from "./actionTypes";

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
