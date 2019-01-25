import { CollectionData, compileSongData, MetaLoader, SongData } from 'jukebox-utils/src';
import { UrlList } from 'jukebox-utils/src/types';

export class CollectionLoader {
  data: CollectionData;

  constructor(existingCollection: CollectionData) {
    this.data = existingCollection;
  }

  contains(songUrl) {
    return !!this.data.songs[songUrl];
  }
  merge(songData: SongData) {
    this.data.songs = {
      ...this.data.songs,
      [songData.source]: {
        ...songData,
      },
    };
  }
  mergeMany(songDatas: Array<SongData>) {
    songDatas.forEach(sd => this.merge(sd));
  }

  static async fromUrlList(urlList: UrlList, existing: CollectionData): Promise<CollectionLoader> {
    const loader = new CollectionLoader(existing);

    const urlsToUpdate: Array<string> = [];
    urlList.urls.forEach(url => {
      if (!loader.contains(url)) {
        urlsToUpdate.push(url);
      }
    });

    const songPromises = urlsToUpdate.map(url => {
      return MetaLoader.fromUrl(url).then(metaData => compileSongData(url, metaData))
    });
    const songs = await Promise.all(songPromises);
    loader.mergeMany(songs);
    return loader;
  }
}
