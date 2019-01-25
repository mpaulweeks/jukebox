import { Collection } from "jukebox-utils";
import { LibraryLoader } from "../library";
import Loader from "../loader";

async function main() {
  const librarySource = '../../temp/Library.xml';
  const library = await LibraryLoader.fromFile(librarySource);

  const collection = Collection.default();
  const songDataBase = {};
  const loader = new Loader(collection, songDataBase);

  await loader.addPlaylists(library, ['Sample']);
  await loader.export();
}

main();
