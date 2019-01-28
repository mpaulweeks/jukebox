import { Collection, Constants, InfoLookup, Logger, MetaLoader, SongLoader } from 'jukebox-utils';
import { iTunesLibrary } from './iTunesLibrary';
import { Store } from './store';

interface ImageFile {
  hash: string,
  buffer: Buffer,
  summary: string,
}

export class Loader {
  store: Store;
  collection: Collection;
  infoLookup: InfoLookup;
  toUploadImage: Array<ImageFile>;
  toUploadAudio: Array<any>;

  constructor(store: Store, existingCollection: Collection, existingDataBase: InfoLookup) {
    this.store = store;
    this.collection = existingCollection;
    this.infoLookup = existingDataBase;
    this.toUploadImage = [];
    this.toUploadAudio = [];
  }

  async addPlaylists(library: iTunesLibrary, whitelist: Array<string>) {
    const { collection, infoLookup } = this;
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

    const toUpdateMeta = Object.keys(collection.data.tracks).filter(id => !infoLookup.containsTrack(id));
    const imageBuffers = {};
    const songPromises = toUpdateMeta.map(async id => {
      const { path } = library.getTrack(id);
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
    this.toUploadImage = Object.keys(imageBuffers)
      .filter(id => !collection.containsImage(id))
      .map(id => imageBuffers[id]);
    collection.data.images = Object.keys(imageBuffers).reduce((obj, id) => {
      obj[id] = imageBuffers[id].summary;
      return obj;
    }, {});
  }

  async export() {
    const { store, collection, infoLookup, toUploadAudio, toUploadImage } = this;

    await store.uploadData(Constants.CollectionFileName, collection.data);
    await store.uploadData(Constants.InfoLookupFileName, infoLookup.data);

    const trackPromises = toUploadAudio.map(track => store.uploadAudio(track.id, track.path));
    this.toUploadAudio = [];
    await Promise.all(trackPromises);

    const imagePromises = toUploadImage.map(image => store.uploadImage(image.hash, image.buffer));
    this.toUploadImage = [];
    await Promise.all(imagePromises);

    Logger.log('success!')
  }
}
