import { Manager } from "jukebox-utils";
import { SET_MANAGER } from "../actionTypes";

const initialState = {
  manager: undefined,
};

interface Action {
  type: string,
  payload: {
    manager: Manager,
  }
}

export default function (state = initialState, action: Action) {
  switch (action.type) {
    case SET_MANAGER: {
      const { manager } = action.payload;
      return {
        ...state,
        manager,
      };
    }
    default:
      return state;
  }
}
