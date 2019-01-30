import fs from 'fs';
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
  allTracks: any;

  constructor(store: Store, library: iTunesLibrary, existingCollection: Collection, existingDataBase: InfoLookup) {
    this.store = store;
    this.library = library;
    this.collection = existingCollection;
    this.infoLookup = existingDataBase;
    this.allTracks = {};

    Logger.log('created new loader!');
    Logger.log('collection size:', Object.keys(this.collection.data.tracks).length);
    Logger.log('infoLookup size:', Object.keys(this.infoLookup.data).length);
  }

  async addPlaylists(whitelist: Array<string>) {
    Logger.log('adding playlists to loader...');

    const { collection, library, allTracks } = this;
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

  }

  async export() {
    Logger.log('begin exporting...');
    const { store, library, collection, infoLookup, allTracks } = this;

    Logger.log('uploading missing songs...');
    const toUploadAudio = Object.keys(allTracks)
      .filter(id => !collection.containsTrack(id))
      .map(id => library.getTrack(id));
    const audioBuffers = {};
    await asyncMap(toUploadAudio, async track => {
      const buffer = await store.uploadAudio(track.id, track.path);
      audioBuffers[track.id] = buffer;
    });
    collection.data.tracks = Object.keys(allTracks).reduce((obj, id) => {
      obj[id] = allTracks[id].summary;
      return obj;
    }, {});

    Logger.log('loading missing metaData from files...');
    const toUpdateMeta = Object.keys(collection.data.tracks).filter(id => !infoLookup.containsTrack(id));
    await asyncMap(toUpdateMeta, async id => {
      if (!audioBuffers[id]) {
        const { path } = library.getTrack(id);
        const newBuffer = await new Promise((resolve, reject) => {
          fs.readFile(path, (err, buffer) => {
            if (err) {
              Logger.debug('error reading meta:', err);
              reject(err);
            } else {
              resolve(buffer);
            }
          });
        });
        audioBuffers[id] = newBuffer;
      }
    });

    Logger.log('generating MetaDatas...');
    const imageBuffers = {};
    // todo read off collection.images, not toUpdateMeta
    const trackDatas = await asyncMap(toUpdateMeta, async id => {
      const buffer = audioBuffers[id];
      const metaData = await MetaLoader.fromBuffer(buffer);
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

    Logger.log('uploading missing images...')
    const toUploadImage = Object.keys(imageBuffers)
      .filter(id => !collection.containsImage(id))
      .map(id => imageBuffers[id]);
    await asyncMap(toUploadImage, (image => store.uploadImage(image.hash, image.buffer)));
    collection.data.images = Object.keys(imageBuffers).reduce((obj, id) => {
      obj[id] = imageBuffers[id].summary;
      return obj;
    }, {});

    Logger.log('updating infoLookup...');
    const trackDatasById = trackDatas.reduce((obj, song) => {
      obj[song.id] = song;
      return obj;
    }, {});
    infoLookup.data = {
      ...infoLookup.data,
      ...trackDatasById,
    };
    await store.uploadData(Constants.InfoLookupFileName, infoLookup.data);

    Logger.log('updating collection:', toUploadImage.length);
    await store.uploadData(Constants.CollectionFileName, collection.data);

    Logger.log('success!')
  }
}
