import { iTunesLibraryLoader, Loader, Store } from "..";

async function main() {
  const librarySource = '/Users/mpaulweeks/Music/iTunes/iTunes Music Library.xml';
  const whitelist = [
    'Anime',
    'Broadway',
    'Sample',
    'Yooka',
  ]

  const store = new Store();
  const collection = await store.downloadCollection();
  const infoLookup = await store.downloadInfoLookup();
  const loader = new Loader(store, collection, infoLookup);

  const library = await iTunesLibraryLoader.fromFile(librarySource);
  await loader.addPlaylists(library, whitelist);
  await loader.export();
}

main();
