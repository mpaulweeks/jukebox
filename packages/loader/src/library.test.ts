import { Library } from '.';

const librarySource = '../../temp/Library.xml';

test('test fromFile', async () => {
  const library = await Library.fromFile(librarySource);
  expect(library.data).toBe('hello');
});
