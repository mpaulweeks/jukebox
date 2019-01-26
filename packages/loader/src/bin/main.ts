import { Collection, Constants, fetchCollection, fetchInfoLookup, InfoLookup } from 'jukebox-utils';
import { LibraryLoader, Loader } from "..";

async function main() {
  const librarySource = '../../temp/Library.xml.20190126';
  const whitelist = [
    'Broadway',
    'Sample',
    'Yooka',
  ]
  const library = await LibraryLoader.fromFile(librarySource);

  const { isDev } = Constants;
  const collection = isDev ? Collection.default() : await fetchCollection();
  const infoLookup = isDev ? InfoLookup.default() : await fetchInfoLookup();
  const loader = new Loader(collection, infoLookup);

  await loader.addPlaylists(library, whitelist);
  await loader.export();
}

main();
