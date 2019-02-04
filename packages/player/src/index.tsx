import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import TestBed from './TestBed';
import { Constants } from 'jukebox-utils';
import './index.css';

const devWindow: any = window;
devWindow['openJukebox'] = () => new Promise((resolve, reject) => {
  let Comp: any = App;
  if (Constants.isTest) {
    Comp = TestBed;
  }
  const root = document.createElement('jukebox');
  document.body.appendChild(root);
  ReactDOM.render(<Comp />, root, () => resolve(root));
});
