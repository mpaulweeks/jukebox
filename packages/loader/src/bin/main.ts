import { LibraryLoader } from "../library";
import Loader from "../loader";

async function main() {
  const librarySource = '../../temp/Library.xml';
  const library = await LibraryLoader.fromFile(librarySource);

  const collection = await fetchCollection();
  const songDataBase = await fetchMetaData();
  const loader = new Loader(collection, songDataBase);

  await loader.addPlaylists(library, ['Sample']);
  await loader.export();
}

main();
