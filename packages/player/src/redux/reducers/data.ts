import { Manager } from 'jukebox-utils';
import { SET_MANAGER } from '../actionTypes';

export interface DataState {
  manager?: Manager;
}

interface DataAction {
  type: string;
  payload: {
    manager: Manager;
  };
}

const initialState: DataState = {
  manager: undefined,
};

export default function (state = initialState, action: DataAction) {
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
