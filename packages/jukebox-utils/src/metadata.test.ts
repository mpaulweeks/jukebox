import fs from 'fs';
import { MetaDataLoader } from '.';

test('test constructor', () => {
  const contents = fs.readFileSync('../../temp/fusq_perfume.mp3');
  const metaData = new MetaDataLoader(contents).data;
  expect(metaData.title).toBe('Perfume! (Lost Station EP)');
});

test('test fromFile', async () => {
  const metaData = await MetaDataLoader.fromFile('../../temp/fusq_perfume.mp3');
  expect(metaData.title).toBe('Perfume! (Lost Station EP)');
});
