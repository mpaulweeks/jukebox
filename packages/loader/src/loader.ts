import { Collection, Constants, InfoLookup, MetaLoader, SongLoader } from 'jukebox-utils';
import { iTunesLibrary } from './iTunesLibrary';
import Store from './store';

interface ImageFile {
  hash: string,
  buffer: Buffer,
}

export class Loader {
  collection: Collection;
  infoLookup: InfoLookup;
  toUploadImage: Array<ImageFile>;
  toUploadAudio: Array<any>;

  constructor(existingCollection: Collection, existingDataBase: InfoLookup) {
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
      const song = SongLoader.compileSongData(id, metaData);
      if (song.imageHash) {
        imageBuffers[song.imageHash] = {
          hash: song.imageHash,
          buffer: metaData.imageBuffer,
        };
      }
      return song;
    });
    const songDatas = await Promise.all(songPromises);
    const songDatasById = songDatas.reduce((obj, song) => {
      obj[song.id] = song;
      return obj;
    }, {});
    infoLookup.data = {
      ...infoLookup.data,
      ...songDatasById,
    };

    // todo compare to images in collection
    this.toUploadImage = Object.keys(imageBuffers).map(key => imageBuffers[key]);
  }

  async export() {
    // console.log(this.collection);
    // console.log(this.InfoLookup);

    const store = new Store();

    await store.uploadData(Constants.CollectionFileName, this.collection.data);
    await store.uploadData(Constants.InfoLookupFileName, this.infoLookup.data);

    const trackPromises = this.toUploadAudio.map(track => store.uploadAudio(track.id, track.path));
    this.toUploadAudio = [];
    await Promise.all(trackPromises);

    const imagePromises = this.toUploadImage.map(image => store.uploadImage(image.hash, image.buffer));
    this.toUploadImage = [];
    await Promise.all(imagePromises);

    console.log('success!')
  }
}
