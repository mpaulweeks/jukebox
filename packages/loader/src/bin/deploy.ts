import { Store } from '..';

(async () => {
  const store = new Store();
  // await store.deployPlayer();
  await store.deployJukebox();
})();
