import { Collection, Constants, InfoLookup, SongLoader } from 'jukebox-utils';
import { Library } from './library';
import Store from './store';

export class Loader {
  collection: Collection;
  infoLookup: InfoLookup;
  toUpload: Array<any>;

  constructor(existingCollection: Collection, existingDataBase: InfoLookup) {
    this.collection = existingCollection;
    this.infoLookup = existingDataBase;
    this.toUpload = [];
  }

  async addPlaylists(library: Library, whitelist: Array<string>) {
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

    this.toUpload = Object.keys(allTracks)
      .filter(id => !collection.containsTrack(id))
      .map(id => library.getTrack(id));
    collection.data.tracks = Object.keys(allTracks).reduce((obj, id) => {
      obj[id] = allTracks[id].summary;
      return obj;
    }, {});

    const toUpdateMeta = Object.keys(collection.data.tracks).filter(id => !infoLookup.containsTrack(id));
    const songPromises = toUpdateMeta.map(id => {
      const { path } = library.getTrack(id);
      return SongLoader.fromFile(id, path);
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
  }

  async export() {
    // console.log(this.collection);
    // console.log(this.InfoLookup);

    const store = new Store();

    await store.uploadData(Constants.CollectionFileName, this.collection.data);
    await store.uploadData(Constants.InfoLookupFileName, this.infoLookup.data);

    const trackPromises = this.toUpload.map(track => store.uploadAudio(track.id, track.path));
    this.toUpload = [];
    await Promise.all(trackPromises);

    console.log('success!')
  }
}
