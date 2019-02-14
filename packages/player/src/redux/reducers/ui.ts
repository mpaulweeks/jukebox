import { ColorScheme } from "../../ColorScheme";
import { TOGGLE_COLLAPSE_HEADER, TOGGLE_COLLAPSE_ROOT, TOGGLE_COLLAPSE_SIDEBAR } from "../actionTypes";

export interface UiState {
  colorScheme?: ColorScheme,
  collapseRoot?: boolean,
  collapseHeader?: boolean,
  collapseSidebar?: boolean,
}

interface UiAction {
  type: string,
  payload: {
    colorScheme?: ColorScheme,
  }
}

const initialState: UiState = {
  colorScheme: undefined,
  collapseRoot: true,
  collapseHeader: false,
  collapseSidebar: false,
};

export default function (state = initialState, action: UiAction) {
  switch (action.type) {
    case TOGGLE_COLLAPSE_ROOT: {
      return {
        ...state,
        collapseRoot: !state.collapseRoot,
      };
    }
    case TOGGLE_COLLAPSE_HEADER: {
      return {
        ...state,
        collapseHeader: !state.collapseHeader,
      };
    }
    case TOGGLE_COLLAPSE_SIDEBAR: {
      return {
        ...state,
        collapseSidebar: !state.collapseSidebar,
      };
    }
    default:
      return state;
  }
}
