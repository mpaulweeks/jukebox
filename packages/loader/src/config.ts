import fs from 'fs';

const init = () => {
  const json = fs.readFileSync('../../local/config.json', 'utf8');
  const config = JSON.parse(json);
  Object.assign(process.env, config.env);
  return config.config;
}

export const LoaderConfig = init();
