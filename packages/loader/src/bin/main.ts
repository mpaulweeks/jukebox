import { Logger } from "jukebox-utils";
import { iTunesLibraryLoader, Loader, Store } from "..";

async function main() {
  const librarySource = '/Users/mpaulweeks/Music/iTunes/iTunes Music Library.xml';
  const whitelist = [
    'Anime',
    'Broadway',
    'Sample',
    'Yooka',
    'iPod',
  ]

  Logger.log('loading existing data...');
  const store = new Store();
  const collection = await store.downloadCollection();
  const infoLookup = await store.downloadInfoLookup();
  const loader = new Loader(store, collection, infoLookup);
  Logger.log('done loading existing data');

  const library = await iTunesLibraryLoader.fromFile(librarySource);
  await loader.addPlaylists(library, whitelist);
  await loader.export();
}

main();
