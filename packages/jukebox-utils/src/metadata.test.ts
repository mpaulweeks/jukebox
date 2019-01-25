import fs from 'fs';
import { MetaData, MetaDataLoader } from '.';

const perfumeSource = '../../temp/fusq_perfume.mp3';

function testPerfume(metaData: MetaData) {
  expect(metaData.source).toBe(perfumeSource);
  expect(metaData.album).toBe('Perfume! (Lost Station EP)');
  expect(metaData.artist).toBe('fusq');
  expect(metaData.title).toBe('Perfume! (Lost Station EP)');
  expect(metaData.year).toBe('2015');
  expect(metaData.imageSrc).toMatch(/data:image\/jpeg;base64,.+/);
}

test('test constructor', () => {
  const contents = fs.readFileSync(perfumeSource);
  const metaData = new MetaDataLoader(perfumeSource, contents).data;
  testPerfume(metaData);
});

test('test fromFile', async () => {
  const metaData = await MetaDataLoader.fromFile(perfumeSource);
  testPerfume(metaData);
});
