const isDev = process.env.JUKEBOX_ENV === 'development';
const isStaging = process.env.JUKEBOX_ENV === 'staging';
const isProduction = process.env.JUKEBOX_ENV === 'production';

const isBrowser = (typeof window !== 'undefined');
const isTest = isBrowser && window.location.search === '?test';

const LogDebug = isTest;

const LocalDataRoot = '../../local';
const LocalFileServerRoot = 'http://localhost:8081';
const AwsRoot = 'https://s3.amazonaws.com/mpaulweeks-jukebox';
const StorageRootPath = isDev ? LocalFileServerRoot : AwsRoot;
const BucketPath = isProduction ? 'production' : 'staging';

const DataLocalPath = `${BucketPath}/data`;
const AudioLocalPath = `${BucketPath}/audio`;
const ImageLocalPath = `${BucketPath}/image`;

const DataRootPath = `${StorageRootPath}/${DataLocalPath}`;
const AudioRootPath = `${StorageRootPath}/${AudioLocalPath}`;
const ImageRootPath = `${StorageRootPath}/${ImageLocalPath}`;

const CollectionFileName = `collection.json`;
const InfoLookupFileName = `metaData.json`;

const CollectionPath = `${DataRootPath}/${CollectionFileName}`;
const InfoLookupPath = `${DataRootPath}/${InfoLookupFileName}`;

export const Constants = {
  isDev,
  isTest,
  LogDebug,
  LocalDataRoot,
  AudioRootPath,
  ImageRootPath,
  DataLocalPath,
  AudioLocalPath,
  ImageLocalPath,
  CollectionFileName,
  InfoLookupFileName,
  CollectionPath,
  InfoLookupPath,
};
