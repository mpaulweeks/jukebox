import { iTunesLibraryLoader } from ".";

const librarySource = '../../temp/Library.Big.xml';
let libraryPromise;

beforeAll(() => {
  libraryPromise = iTunesLibraryLoader.fromFile(librarySource);
});

test('test fromFile', async () => {
  const library = await libraryPromise;
  const playlists = library.getPlaylists();
  const test = playlists.filter(pl => pl.name === '2016')[0];
  expect(test.trackIds.length).toBe(92);
}, 1000 * 60);

test('test for uniqueness', async () => {
  const library = await libraryPromise;

  // ensure unique Track ID
  const iTunesTracks = Object.keys(library.data.iTunesTracks);
  expect(iTunesTracks.length).toBe(library.trackCount);

  // ensure unique Persistent ID
  const tracks = library.getTracks();
  expect(tracks.length).toBe(library.trackCount);
}, 1000 * 60);
