import { Constants } from "./constants";

export class Logger {
  static debug(...args) {
    if (Constants.LogDebug) {
      console.log(...args);
    }
  }
  static log(...args) {
    console.log(...args);
  }
}
