import React from 'react';
import { MetaLoader, MetaData, fetchCollection, Collection, InfoLookup, fetchInfoLookup } from 'jukebox-utils';
import Playlist from './Playlist';

interface State {
  collection?: Collection,
  infoLookup?: InfoLookup,
  audioSource?: string,
  metaData?: MetaData,
};

export default class App extends React.Component<any, State> {
  state: State = {};

  async loadSong(source: string) {
    const metaData = await MetaLoader.fromUrl(source);
    console.log(metaData);
    this.setState({
      audioSource: source,
      metaData,
    });
  }

  componentDidMount() {
    console.log(process.env);
    // const source = `${FILE_ROOT}/claire_de_lune.mp3`;
    // const source = `${Constants.ServerRootPath}/slimegirls_warpstar.mp3`;
    // const source = `${FILE_ROOT}/robgasser_move.mp3`;
    // const source = 'https://s3.amazonaws.com/jsmediatags-offset-issue/audio.mp3';
    // this.loadSong(source);

    fetchCollection().then(collection => this.setState({
      collection: collection,
    }));
    fetchInfoLookup().then(infoLookup => this.setState({
      infoLookup: infoLookup,
    }));
  }

  render() {
    const { collection, infoLookup } = this.state;
    if (!collection || !infoLookup) {
      return (
        <h3> loading, please wait... </h3>
      );
    }

    return (
      <div>
        {collection.getPlaylists().map((pl, index) => (
          <Playlist
            key={`playlist-${index}`}
            playlist={pl}
            infoLookup={infoLookup}
          />
        ))}
      </div>
    )

  }
}
