import React from 'react';
import { MetaLoader, MetaData, fetchCollection, Collection, InfoLookup, fetchInfoLookup, getAudioUrl, SongData, SongLoader } from 'jukebox-utils';
import Playlist from './Playlist';
import Track from './Track';
import styled from 'styled-components';

interface State {
  collection?: Collection,
  infoLookup?: InfoLookup,
  tracks?: Array<SongData>,
};

export default class TestBed extends React.Component<any, State> {
  audioElm = new Audio();
  state: State = {};

  async test() {
    const { collection, infoLookup } = this.state;
    const ids = [
      '18921', // hello
      '269', // disco fever
      '251', // we'll go from there
      '19267', // genesis of next
      '19290', // yooka
    ];
    ids.forEach(id => SongLoader.fromId(id)
      .then(track => this.setState({
        tracks: (this.state.tracks || []).concat(track),
      }))
    );
  }

  componentDidMount() {
    console.log(process.env);

    fetchCollection().then(collection => this.setState({
      collection: collection,
    }));
    fetchInfoLookup().then(infoLookup => this.setState({
      infoLookup: infoLookup,
    }));
  }

  componentDidUpdate() {
    const { collection, infoLookup, tracks } = this.state;
    if (collection && infoLookup && !tracks) {
      this.test();
    }
  }

  render() {
    const { collection, infoLookup, tracks } = this.state;
    if (!collection || !infoLookup) {
      return (
        <h3> loading, please wait... </h3>
      );
    }
    return (
      <div>
        loaded
        {tracks && tracks.map((track, index) => (
          <Track
            key={`track-${index}`}
            track={track}
            loadTrack={() => { }}
          />
        ))}
      </div>
    )

  }
}
