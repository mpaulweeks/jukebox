import { LoadTestBed } from './TestBed';
import { Constants } from 'jukebox-utils';
import { LoadApp } from './LoadApp';

if (Constants.isTest) {
  LoadTestBed();
} else {
  LoadApp();
}
