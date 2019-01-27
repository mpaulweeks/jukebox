import { MetaData, MetaLoader } from '.';

const perfumeSource = '../../temp/fusq_perfume.mp3';

function testPerfume(metaData: MetaData) {
  expect(metaData.album).toBe('Perfume! (Lost Station EP)');
  expect(metaData.artist).toBe('fusq');
  expect(metaData.title).toBe('Perfume! (Lost Station EP)');
  expect(metaData.year).toBe('2015');
  expect(metaData.imageSrc).toMatch(/data:image\/jpeg;base64,.+/);
}

test('test fromFile', async () => {
  const metaData = await MetaLoader.fromFile(perfumeSource);
  testPerfume(metaData);
});
