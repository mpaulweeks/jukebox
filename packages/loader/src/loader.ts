import { asyncMap, Collection, Constants, InfoLookup, Logger, MetaLoader, SongLoader } from 'jukebox-utils';
import { iTunesLibrary } from './iTunesLibrary';
import { Store } from './store';

interface ImageFile {
  hash: string,
  buffer: Buffer,
  summary: string,
}

export class Loader {
  store: Store;
  library: iTunesLibrary;
  collection: Collection;
  infoLookup: InfoLookup;
  toUploadAudio: Array<any>;

  constructor(store: Store, library: iTunesLibrary, existingCollection: Collection, existingDataBase: InfoLookup) {
    this.store = store;
    this.library = library;
    this.collection = existingCollection;
    this.infoLookup = existingDataBase;
    this.toUploadAudio = [];

    Logger.log('created new loader!');
    Logger.log('collection size:', Object.keys(this.collection.data.tracks).length);
    Logger.log('infoLookup size:', Object.keys(this.infoLookup.data).length);
  }

  async addPlaylists(whitelist: Array<string>) {
    Logger.log('adding playlists to loader...');

    const { collection, library } = this;
    const allTracks = {};
    library.getPlaylists().forEach(playlist => {
      if (whitelist.includes(playlist.name)) {
        collection.data.playlists[playlist.name] = {
          name: playlist.name,
          trackIds: playlist.trackIds,
        };
        playlist.tracks.forEach(track => {
          allTracks[track.id] = track;
        });
      }
    });

    // determine what tracks are missing in collection
    this.toUploadAudio = Object.keys(allTracks)
      .filter(id => !collection.containsTrack(id))
      .map(id => library.getTrack(id));
    collection.data.tracks = Object.keys(allTracks).reduce((obj, id) => {
      obj[id] = allTracks[id].summary;
      return obj;
    }, {});
    Logger.log('tracks to upload:', this.toUploadAudio.length);
  }

  async export() {
    Logger.log('begin exporting...');
    const { store, library, collection, infoLookup, toUploadAudio } = this;

    const toUpdateMeta = Object.keys(collection.data.tracks).filter(id => !infoLookup.containsTrack(id));
    const imageBuffers = {};
    const songPromises = toUpdateMeta.map(async id => {
      const { path } = library.getTrack(id);
      // todo re-use this file read for uploading audio
      const metaData = await MetaLoader.fromFile(path);
      const song = SongLoader.compileTrackData(id, metaData);
      if (song.imageHash) {
        imageBuffers[song.imageHash] = {
          hash: song.imageHash,
          buffer: metaData.imageBuffer,
          summary: song.album,
        };
      }
      return song;
    });
    const trackDatas = await Promise.all(songPromises);
    const trackDatasById = trackDatas.reduce((obj, song) => {
      obj[song.id] = song;
      return obj;
    }, {});
    infoLookup.data = {
      ...infoLookup.data,
      ...trackDatasById,
    };

    // determine what images are missing in collection
    const toUploadImage = Object.keys(imageBuffers)
      .filter(id => !collection.containsImage(id))
      .map(id => imageBuffers[id]);
    collection.data.images = Object.keys(imageBuffers).reduce((obj, id) => {
      obj[id] = imageBuffers[id].summary;
      return obj;
    }, {});
    Logger.log('images to upload:', toUploadImage.length);

    await store.uploadData(Constants.CollectionFileName, collection.data);
    await store.uploadData(Constants.InfoLookupFileName, infoLookup.data);

    await asyncMap(toUploadAudio, (track => store.uploadAudio(track.id, track.path)));
    await asyncMap(toUploadImage, (image => store.uploadImage(image.hash, image.buffer)));

    this.toUploadAudio = [];
    Logger.log('success!')
  }
}
