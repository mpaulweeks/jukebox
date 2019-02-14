import { PlayableTrack, PlayableTrackList, PlaylistBrowser } from "jukebox-utils";
import { SET_CURRENT_BROWSER, SET_CURRENT_TRACK, SET_CURRENT_TRACKLIST } from "../actionTypes";

export interface PlayerState {
  audioElm: HTMLAudioElement,
  isPlaying: boolean,
  track: undefined | PlayableTrack,
  trackList: undefined | PlayableTrackList,
  browser: undefined | PlaylistBrowser,
};

export interface PlayerAction {
  type: string,
  payload: {
    track?: PlayableTrack,
    trackList?: PlayableTrackList,
    browser?: PlaylistBrowser,
  }
};

const initialState: PlayerState = {
  audioElm: new Audio(),
  isPlaying: false,
  track: undefined,
  trackList: undefined,
  browser: undefined,
};

export default function (state = initialState, action: PlayerAction) {
  switch (action.type) {
    case SET_CURRENT_TRACK: {
      const { audioElm } = state;
      const { track } = action.payload;

      if (track && track.audioSrc !== audioElm.src) {
        audioElm.src = track.audioSrc;

        return {
          ...state,
          track: track,
          isPlaying: true,
        };
      }
    }
    case SET_CURRENT_TRACKLIST: {
      const { trackList } = action.payload;
      const current = state.trackList;
      if (!current || (trackList && current.name !== trackList.name)) {
        return {
          trackList,
          browser: undefined,
        };
      }
    }
    case SET_CURRENT_BROWSER: {
      const { browser } = action.payload;
      return {
        trackList: undefined,
        browser,
      };
    }
    default:
      return state;
  }
}
