import fs from 'fs';

const defaultEnv = {
  AWS_ACCESS_KEY_ID: '',
  AWS_SECRET_ACCESS_KEY: '',
};
const defaultConfig = {
  iTunesLibraryPath: '',
  whitelist: [],
};

const init = () => {
  const json = fs.readFileSync('../../local/config.json', 'utf8');
  const config = JSON.parse(json);
  Object.assign(process.env, {
    ...defaultEnv,
    ...config.env,
  });
  return {
    ...defaultConfig,
    ...config.config,
  };
};

export const LoaderConfig = init();
