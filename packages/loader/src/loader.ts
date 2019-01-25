import { Collection, SongDataBase, SongLoader } from 'jukebox-utils';
import { Library } from './library';
import Store from './store';

export default class Loader {
  collection: Collection;
  songDataBase: SongDataBase;
  toUpload: Array<any>;

  constructor(existingCollection: Collection, existingDataBase: SongDataBase) {
    this.collection = existingCollection;
    this.songDataBase = existingDataBase;
    this.toUpload = [];
  }

  async addPlaylists(library: Library, whitelist: Array<string>) {
    const { collection } = this;
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
      .filter(id => !collection.data.tracks[id])
      .map(id => library.getTrack(id));
    collection.data.tracks = Object.keys(allTracks).reduce((obj, id) => {
      obj[id] = allTracks[id].summary;
      return obj;
    }, {});

    const toUpdateMeta = Object.keys(collection.data.tracks).filter(id => !this.songDataBase[id]);
    const songPromises = toUpdateMeta.map(id => {
      const location = library.getTrack(id).location;
      return SongLoader.fromFile(id, location);
    });
    const songDatas = await Promise.all(songPromises);
    const songDatasById = songDatas.reduce((obj, song) => {
      obj[song.id] = song;
      return obj;
    }, {});
    this.songDataBase = {
      ...this.songDataBase,
      ...songDatasById,
    };
  }

  async export() {
    console.log(this.collection);
    // console.log(this.songDataBase);

    const store = new Store();

    await store.uploadData('collection.json', this.collection);
    await store.uploadData('metaData.json', this.songDataBase);

    const trackPromises = this.toUpload.map(track => store.uploadAudio(track.id, track.path));
    this.toUpload = [];
    await Promise.all(trackPromises);

    console.log('success!')
  }
}
