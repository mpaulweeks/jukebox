import { combineReducers } from 'redux';
import data, { DataState } from './data';
import player, { PlayerState } from './player';
import ui, { UiState } from './ui';

export interface MasterState {
  data: DataState;
  player: PlayerState;
  ui: UiState;
}

export default combineReducers({
  data: data,
  player: player,
  ui: ui,
} as any);
