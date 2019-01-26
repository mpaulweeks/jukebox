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

    (window as any).state = this.state;

    fetchCollection().then(collection => this.setState({
      collection: collection,
    }));
    fetchInfoLookup().then(infoLookup => this.setState({
      infoLookup: infoLookup,
    }));
  }

  render() {
    console.log('state:', this.state);

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
