const isDev = process.env.REACT_APP_JUKEBOX_ENV === 'development';
const isStaging = process.env.REACT_APP_JUKEBOX_ENV === 'staging';
const isProduction = !(isDev || isStaging);

const isBrowser = (typeof window !== 'undefined');
const isTest = isBrowser && window.location.search === '?test';

const LogDebug = isTest;

const LocalDataRoot = '../../local';
const LocalFileServerRoot = 'http://localhost:8080';
const AwsRoot = 'https://s3.amazonaws.com/mpaulweeks-jukebox';
const StorageBasePath = isDev ? LocalFileServerRoot : AwsRoot;
const BucketPath = isProduction ? 'production' : 'staging';

const DataDirectory = `${BucketPath}/data`;
const AudioDirectory = `${BucketPath}/audio`;
const ImageDirectory = `${BucketPath}/image`;

const DataPath = `${StorageBasePath}/${DataDirectory}`;
const AudioPath = `${StorageBasePath}/${AudioDirectory}`;
const ImagePath = `${StorageBasePath}/${ImageDirectory}`;

const CollectionFileName = `collection.min.json`;
const InfoLookupFileName = `metaData.min.json`;

export const Constants = {
  isDev,
  isTest,
  LogDebug,
  LocalDataRoot,
  DataPath,
  AudioPath,
  ImagePath,
  DataDirectory,
  AudioDirectory,
  ImageDirectory,
  CollectionFileName,
  InfoLookupFileName,
};
