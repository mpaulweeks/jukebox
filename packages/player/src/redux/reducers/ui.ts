import { SET_AUDIO_PROGRESS_DISPLAY, TOGGLE_COLLAPSE_HEADER, TOGGLE_COLLAPSE_ROOT, TOGGLE_COLLAPSE_SIDEBAR, TOGGLE_POPUP_ABOUT, TOGGLE_POPUP_IMAGE, TOGGLE_POPUP_SEARCH } from '../actionTypes';

export interface UiState {
  progressPercent: number;
  progressTime: number;
  durationTime: number;
  collapseRoot: boolean;
  collapseHeader: boolean;
  collapseSidebar: boolean;
  showPopupAbout: boolean;
  showPopupImage: boolean;
  showPopupSearch: boolean;
}

interface UiAction {
  type: string;
  payload?: {
    currentTime: number,
    duration: number,
  },
}

const initialState: UiState = {
  progressPercent: 0,
  progressTime: 0,
  durationTime: 0,
  collapseRoot: true,
  collapseHeader: false,
  collapseSidebar: false,
  showPopupAbout: false,
  showPopupImage: false,
  showPopupSearch: false,
};

export default function (state = initialState, action: UiAction) {
  switch (action.type) {
    case SET_AUDIO_PROGRESS_DISPLAY: {
      const { currentTime, duration } = (action.payload || { currentTime: 0, duration: 0 });
      return {
        ...state,
        progressPercent: duration ? (currentTime / duration) : 0,
        progressTime: currentTime || 0,
        durationTime: duration || 0,
      }
    }
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
    case TOGGLE_POPUP_IMAGE: {
      return {
        ...state,
        showPopupImage: !state.showPopupImage,
      };
    }
    case TOGGLE_POPUP_SEARCH: {
      return {
        ...state,
        showPopupSearch: !state.showPopupSearch,
      };
    }
    default:
      return state;
  }
}
