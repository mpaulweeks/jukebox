const isReactDev = process.env.NODE_ENV === 'development';

const LocalFileServerRoot = 'http://localhost:8081';
const AwsRoot = 'https://s3.amazonaws.com/mpaulweeks-jukebox';
const StorageRootPath = isReactDev ? LocalFileServerRoot : AwsRoot;

const DataRootPath = `${StorageRootPath}/data`;
const AudioRootPath = `${StorageRootPath}/audio`;

const CollectionPath = `${DataRootPath}/collection.json`;
const InfoLookupPath = `${DataRootPath}/metaData.json`;

export default {
  AudioRootPath,
  CollectionPath,
  InfoLookupPath,
};
