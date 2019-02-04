const isBrowser = (typeof window !== 'undefined');
const isTest = isBrowser && window.location.search === '?test';

const isStaging = (
  (process.env.REACT_APP_JUKEBOX_ENV === 'staging') ||
  (isBrowser && window.location.pathname.includes('/staging/'))
);
const isDev = (
  !isStaging &&
  (process.env.REACT_APP_JUKEBOX_ENV === 'development')
);
const isProduction = !(isDev || isStaging);

const LogDebug = isTest;

const LocalDataRoot = '../../local';
const PlayerBuildPath = '../player/build';
const PlayerDistPath = '../player/dist';
const LocalFileServerRoot = 'http://localhost:8080';
const AwsRoot = 'https://s3.amazonaws.com/mpaulweeks-jukebox';
const StorageBasePath = isDev ? LocalFileServerRoot : AwsRoot;
const BucketPath = isProduction ? 'production' : 'staging';

const DataDirectory = `${BucketPath}/data`;
const AudioDirectory = `${BucketPath}/audio`;
const ImageDirectory = `${BucketPath}/image`;
const WebDirectory = `${BucketPath}/web`;

const DataPath = `${StorageBasePath}/${DataDirectory}`;
const AudioPath = `${StorageBasePath}/${AudioDirectory}`;
const ImagePath = `${StorageBasePath}/${ImageDirectory}`;

const CollectionFileName = `collection.min.json`;
const InfoLookupFileName = `metaData.min.json`;

export const Constants = {
  isDev,
  isStaging,
  isTest,
  LogDebug,
  LocalDataRoot,
  PlayerBuildPath,
  PlayerDistPath,
  DataDirectory,
  AudioDirectory,
  ImageDirectory,
  WebDirectory,
  DataPath,
  AudioPath,
  ImagePath,
  CollectionFileName,
  InfoLookupFileName,
};
