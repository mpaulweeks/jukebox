import { Loader, Store } from "..";

async function main() {
  const whitelist = [
    'Anime',
    'Broadway',
    'Sample',
    'Yooka',
    'iPod',
  ]

  const store = new Store();
  const collection = await store.downloadCollection();
  const infoLookup = await store.downloadInfoLookup();
  const library = await store.iTunesLibrary();
  const loader = new Loader(store, library, collection, infoLookup);
  await loader.addPlaylists(whitelist);
  await loader.export();
}

main();
