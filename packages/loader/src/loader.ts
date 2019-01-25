import { Collection, SongDataBase, SongLoader } from 'jukebox-utils';
import { Library } from './library';

export default class Loader {
  collection: Collection;
  songDataBase: SongDataBase;

  constructor(existingCollection: Collection, existingDataBase: SongDataBase) {
    this.collection = existingCollection;
    this.songDataBase = existingDataBase;
  }

  async addPlaylists(library: Library, whitelist: Array<string>) {
    const { collection } = this;
    const allTracks = {};
    library.getPlaylists().forEach(playlist => {
      if (whitelist.includes(playlist.name)) {
        collection.data.playlists[playlist.id] = {
          name: playlist.name,
          trackIds: playlist.trackIds,
        };
        playlist.tracks.forEach(track => {
          allTracks[track.id] = track;
        });
      }
    });

    const toUpload = Object.keys(allTracks).filter(id => !collection.data.tracks[id]);
    // todo upload to s3
    collection.data.tracks = Object.keys(allTracks).reduce((obj, id) => {
      obj[id] = allTracks[id].summary;
      return obj;
    }, {});

    const toUpdateMeta = Object.keys(collection.data.tracks).filter(id => !this.songDataBase[id]);
    const songPromises = Object.keys(toUpdateMeta).map(id => SongLoader.fromId(id));
    const songDatas = await Promise.all(songPromises);
    const songDatasById = songDatas.reduce((obj, song) => {
      obj[song.id] = song;
      return obj;
    }, {});
    this.songDataBase = {
      ...this.songDataBase,
      ...songDatasById,
    };

    // todo save two collection files
  }
}
