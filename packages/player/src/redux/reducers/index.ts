import { combineReducers } from "redux";
import manager from "./manager";
import player from "./player";
import ui from "./ui";

export default combineReducers({
  manager: manager,
  player: player,
  ui: ui,
} as any);
