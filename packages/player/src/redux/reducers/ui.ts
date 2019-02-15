import { TOGGLE_COLLAPSE_HEADER, TOGGLE_COLLAPSE_ROOT, TOGGLE_COLLAPSE_SIDEBAR, TOGGLE_POPUP_ABOUT } from '../actionTypes';

export interface UiState {
  collapseRoot: boolean;
  collapseHeader: boolean;
  collapseSidebar: boolean;
  showPopupAbout: boolean;
}

interface UiAction {
  type: string;
}

const initialState: UiState = {
  collapseRoot: true,
  collapseHeader: false,
  collapseSidebar: false,
  showPopupAbout: false,
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
    case TOGGLE_POPUP_ABOUT: {
      return {
        ...state,
        showPopupAbout: !state.showPopupAbout,
      };
    }
    default:
      return state;
  }
}
