import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { DefaultWebConfig } from 'jukebox-utils';

export interface WebAPI {
  elm: HTMLElement,
  toggle(): void,
};

export const LoadApp = () => {
  let api: (undefined | WebAPI) = undefined;
  const devWindow: any = window;
  devWindow['createJukebox'] = (codeConfig: DefaultWebConfig) => new Promise((resolve, reject) => {
    if (api) {
      resolve(api);
    } else {
      const root = document.createElement('jukebox');
      document.body.appendChild(root);
      const callback = (elm: App) => {
        api = {
          elm: root,
          toggle: elm.toggleCollapseRoot,
        };
        resolve(api);
      };
      ReactDOM.render(<App codeConfig={codeConfig} ref={callback} />, root);
    }
  });
};
