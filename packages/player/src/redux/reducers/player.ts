import { PlayableTrack } from "jukebox-utils";
import { SET_CURRENT_TRACK } from "../actionTypes";

export interface PlayerState {
  track: undefined | PlayableTrack,
};

export interface PlayerAction {
  type: string,
  payload: {
    track?: PlayableTrack,
  }
};

const initialState: PlayerState = {
  track: undefined,
};

export default function (state = initialState, action: PlayerAction) {
  console.log('player action dispatched');
  switch (action.type) {
    case SET_CURRENT_TRACK: {
      const { track } = action.payload;
      console.log(track);
      return {
        ...state,
        track,
      };
    }
    default:
      return state;
  }
}
