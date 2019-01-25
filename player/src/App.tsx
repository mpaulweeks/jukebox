import React from 'react';
import { FILE_ROOT } from './constants';
import { MetaDataLoader, MetaData } from './metadata';

interface State {
  audioSource?: string,
  metaData?: MetaData,
};

export default class App extends React.Component<any, State> {
  state: State = {};

  async loadSong(source) {
    const metaData = await MetaDataLoader.fromUrl(source);
    console.log(metaData);
    this.setState({
      audioSource: source,
      metaData,
    });
  }

  componentDidMount() {
    // const source = `${FILE_ROOT}/claire_de_lune.mp3`;
    const source = `${FILE_ROOT}/slimegirls_warpstar.mp3`;
    // const source = `${FILE_ROOT}/robgasser_move.mp3`;
    // const source = 'https://s3.amazonaws.com/jsmediatags-offset-issue/audio.mp3';

    this.loadSong(source);
  }

  render() {
    // todo store in audio obj, only display inteface
    const { audioSource, metaData } = this.state;
    return (
      <div>
        {metaData && audioSource && (
          <div>
            <div>
              {metaData.title}
            </div>
            <div>
              {metaData.artist}
            </div>
            {metaData.imageSrc && (
              <img src={metaData.imageSrc} />
            )}
            <audio controls src={audioSource}></audio>
          </div>
        )}
      </div>
    );
  }
}
