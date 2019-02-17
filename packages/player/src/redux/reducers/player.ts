import { PlayableTrack, PlayableTrackList, PlayerSettings, PlaylistBrowser } from 'jukebox-utils';
import { RESOLVE_SEEK, SEEK_NEXT_TRACK, SEEK_PREV_TRACK, SET_CURRENT_BROWSER, SET_CURRENT_TRACK, SET_CURRENT_TRACKLIST, SET_IS_PLAYING, SET_IS_REPEAT, SET_IS_SHUFFLE, SET_SEEK_BY_PERCENT, TOGGLE_IS_PLAYING, TOGGLE_IS_REPEAT, TOGGLE_IS_SHUFFLE } from '../actionTypes';

export interface PlayerState extends PlayerSettings {
  track: undefined | PlayableTrack;
  trackList: undefined | PlayableTrackList;
  browser: undefined | PlaylistBrowser;
  seekPercent: undefined | number;
  seekSeconds: undefined | number;
  seekDelta: undefined | number;
}

export interface PlayerAction {
  type: string;
  payload: {
    isPlaying?: boolean;
    shuffle?: boolean;
    repeat?: boolean;
    track?: PlayableTrack;
    trackList?: PlayableTrackList;
    browser?: PlaylistBrowser;
    seekPercent?: number;
    seekSeconds?: number;
    seekDelta?: number;
  };
}

const initialState: PlayerState = {
  isPlaying: false,
  shuffle: false,
  repeat: false,
  track: undefined,
  trackList: undefined,
  browser: undefined,
  seekPercent: undefined,
  seekSeconds: undefined,
  seekDelta: undefined,
};

export default function (state = initialState, action: PlayerAction) {
  switch (action.type) {
    case SET_CURRENT_TRACK: {
      const { track } = action.payload;
      if (!state.track || (track && track.audioSrc !== state.track.audioSrc)) {
        return {
          ...state,
          track: track,
          isPlaying: true,
        };
      }
      return state;
    }
    case SET_CURRENT_TRACKLIST: {
      const { trackList } = action.payload;
      const current = state.trackList;
      if (!current || (trackList && current.name !== trackList.name)) {
        return {
          ...state,
          trackList,
          browser: undefined,
        };
      }
      return state;
    }
    case SET_CURRENT_BROWSER: {
      const { browser } = action.payload;
      return {
        ...state,
        trackList: undefined,
        browser,
      };
    }
    case SET_SEEK_BY_PERCENT: {
      const { seekPercent } = action.payload;
      return {
        ...state,
        seekPercent,
      };
    }
    case RESOLVE_SEEK: {
      return {
        ...state,
        seekPercent: undefined,
        seekSeconds: undefined,
        seekDelta: undefined,
      };
    }
    case SET_IS_PLAYING: {
      const { isPlaying } = action.payload;
      if (isPlaying && !state.track && state.trackList) {
        return {
          ...state,
          track: state.trackList.tracks[0],
          isPlaying: isPlaying,
        };
      }
      return {
        ...state,
        isPlaying: isPlaying,
      };
    }
    case SET_IS_SHUFFLE: {
      const { shuffle } = action.payload;
      return {
        ...state,
        shuffle,
      };
    }
    case SET_IS_REPEAT: {
      const { repeat } = action.payload;
      return {
        ...state,
        repeat,
      };
    }
    case TOGGLE_IS_PLAYING: {
      const { isPlaying } = state;
      if (!isPlaying && !state.track && state.trackList) {
        return {
          ...state,
          track: state.trackList.tracks[0],
          isPlaying: !isPlaying,
        };
      }
      return {
        ...state,
        isPlaying: !isPlaying,
      };
    }
    case TOGGLE_IS_SHUFFLE: {
      const { shuffle } = state;
      return {
        ...state,
        shuffle: !shuffle,
      };
    }
    case TOGGLE_IS_REPEAT: {
      const { repeat } = state;
      return {
        ...state,
        repeat: !repeat,
      };
    }
    case SEEK_NEXT_TRACK: {
      const { track, trackList } = state;
      if (track && trackList) {
        const newTrack = trackList.nextTrack(state, track);
        return {
          ...state,
          track: newTrack,
        };
      }
      return state;
    }
    case SEEK_PREV_TRACK: {
      const { track, trackList } = state;
      if (track && trackList) {
        const newTrack = trackList.prevTrack(state, track);
        return {
          ...state,
          track: newTrack,
        };
      }
      return state;
    }
    case TOGGLE_IS_SHUFFLE: {
      const { shuffle } = state;
      return {
        ...state,
        shuffle: !shuffle,
      };
    }
    default:
      return state;
  }
}
