const DevRootPath = 'http://localhost:8081';
const ProdRootPath = 'aws something todo';
const ServerRootPath = DevRootPath; // todo diff on prod

const StorageRootPath = 'https://s3.amazonaws.com/mpaulweeks-jukebox';
const DataRootPath = `${StorageRootPath}/data`;
const AudioRootPath = `${StorageRootPath}/audio`;

const CollectionFileName = 'collection.json';
const InfoLookupFileName = 'metaData.json';

export default {
  ServerRootPath,
  DataRootPath,
  AudioRootPath,
  CollectionFileName,
  InfoLookupFileName,
};
