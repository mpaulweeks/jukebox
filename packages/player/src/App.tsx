import React from 'react';
import { MetaLoader, MetaData, fetchCollection, Collection, InfoLookup, fetchInfoLookup, getAudioUrl, SongData } from 'jukebox-utils';
import Playlist from './Playlist';
import Track from './Track';

interface State {
  collection?: Collection,
  infoLookup?: InfoLookup,
  currentTrack?: SongData,
};

export default class App extends React.Component<any, State> {
  audioElm = new Audio();
  state: State = {};

  componentDidMount() {
    console.log(process.env);

    fetchCollection().then(collection => this.setState({
      collection: collection,
    }));
    fetchInfoLookup().then(infoLookup => this.setState({
      infoLookup: infoLookup,
    }));
  }

  loadTrack = (track: SongData) => {
    // todo make this redux
    const newSource = getAudioUrl(track.id);
    if (newSource !== this.audioElm.src) {
      this.audioElm.src = getAudioUrl(track.id);
      this.audioElm.play();

      this.setState({
        currentTrack: track,
      });
    }
  }

  render() {
    console.log('state:', this.state);

    const { collection, infoLookup, currentTrack } = this.state;
    if (!collection || !infoLookup) {
      return (
        <h3> loading, please wait... </h3>
      );
    }

    const { loadTrack } = this;
    return (
      <div>
        {currentTrack && (
          <Track
            loadTrack={loadTrack}
            track={currentTrack}
            isCurrent={true}
          />
        )}
        {collection.getPlaylists().map((pl, index) => (
          <Playlist
            key={`playlist-${index}`}
            loadTrack={loadTrack}
            infoLookup={infoLookup}
            playlist={pl}
          />
        ))}
      </div>
    )

  }
}
