import { Manager } from 'jukebox-utils';
import { SET_MANAGER } from '../actionTypes';

export const setManager = (manager: Manager) => ({
  type: SET_MANAGER,
  payload: {
    manager: manager,
  },
});
