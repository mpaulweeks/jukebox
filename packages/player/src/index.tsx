import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import TestBed from './TestBed';

let Component: any = App;
if (window.location.search === '?test') {
  Component = TestBed;
}
ReactDOM.render(<Component />, document.getElementById('root'));
