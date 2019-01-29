import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import TestBed from './TestBed';
import { Constants } from 'jukebox-utils';
import './index.css';

let Component: any = App;
if (Constants.isTest) {
  Component = TestBed;
}
ReactDOM.render(<Component />, document.getElementById('root'));
