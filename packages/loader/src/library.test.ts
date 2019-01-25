import { LibraryLoader } from ".";

const librarySource = '../../temp/Library.Big.xml';

test('test fromFile', async () => {
  const library = await LibraryLoader.fromFile(librarySource);
  const playlists = library.getPlaylists();
  const test = playlists.filter(pl => pl.name === '2016')[0];
  expect(test.trackIds.length).toBe(92);
}, 1000 * 60);
