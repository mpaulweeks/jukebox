import { LibraryLoader } from ".";

const librarySource = '../../temp/Library.xml';

test('test fromFile', async () => {
  const library = await LibraryLoader.fromFile(librarySource);
  const playlists = library.getPlaylists();
  const test = playlists.filter(pl => pl.name === 'BroadwayTest')
  expect(JSON.stringify(test)).toBe('hello');
});
