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
  const loader = new Loader(store, collection, infoLookup);

  const library = await store.iTunesLibrary();
  await loader.addPlaylists(library, whitelist);
  await loader.export();
}

main();
