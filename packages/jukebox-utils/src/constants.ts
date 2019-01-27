const isDev = process.env.NODE_ENV === 'development';
console.log('isDev:', isDev);

const LocalFileServerRoot = 'http://localhost:8081';
const AwsRoot = 'https://s3.amazonaws.com/mpaulweeks-jukebox';
const StorageRootPath = isDev ? LocalFileServerRoot : AwsRoot;

const DataRootPath = `${StorageRootPath}/data`;
const AudioRootPath = `${StorageRootPath}/audio`;
const ImageRootPath = `${StorageRootPath}/image`;

const CollectionFileName = `collection.json`;
const InfoLookupFileName = `metaData.json`;

const CollectionPath = `${DataRootPath}/${CollectionFileName}`;
const InfoLookupPath = `${DataRootPath}/${InfoLookupFileName}`;

export default {
  isDev,
  AudioRootPath,
  ImageRootPath,
  CollectionFileName,
  InfoLookupFileName,
  CollectionPath,
  InfoLookupPath,
};
