
import { PlayableTrack } from 'jukebox-utils';
import { SET_CURRENT_TRACK } from "./actionTypes";

export const setCurrentTrack = (track: PlayableTrack) => ({
  type: SET_CURRENT_TRACK,
  payload: {
    track: track,
  },
});
