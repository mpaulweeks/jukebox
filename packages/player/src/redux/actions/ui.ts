import { SET_AUDIO_PROGRESS_DISPLAY, TOGGLE_COLLAPSE_HEADER, TOGGLE_COLLAPSE_ROOT, TOGGLE_COLLAPSE_SIDEBAR, TOGGLE_POPUP_ABOUT } from '../actionTypes';

export const setAudioProgressDisplay = (currentTime: number, duration: number) => ({
  type: SET_AUDIO_PROGRESS_DISPLAY,
  payload: {
    currentTime,
    duration,
  },
});
export const toggleCollapseHeader = () => ({
  type: TOGGLE_COLLAPSE_HEADER,
});
export const toggleCollapseRoot = () => ({
  type: TOGGLE_COLLAPSE_ROOT,
});
export const toggleCollapseSidebar = () => ({
  type: TOGGLE_COLLAPSE_SIDEBAR,
});
export const togglePopupAbout = () => ({
  type: TOGGLE_POPUP_ABOUT,
});