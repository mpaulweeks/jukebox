import { fetchCollection, fetchInfoLookup } from 'jukebox-utils';
import { LibraryLoader, Loader } from "..";

async function main() {
  const librarySource = '../../temp/Library.xml';
  const library = await LibraryLoader.fromFile(librarySource);

  const collection = await fetchCollection();
  const InfoLookupData = await fetchInfoLookup();
  const loader = new Loader(collection, InfoLookupData);

  await loader.addPlaylists(library, ['Sample']);
  await loader.export();
}

main();
