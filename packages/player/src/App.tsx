import React from 'react';
import { Manager, Track } from 'jukebox-utils';
import PlaylistView from './PlaylistView';
import TrackView from './TrackView';
import styled from 'styled-components';

const PlaylistWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
`;

interface State {
  manager?: Manager,
  currentTrack?: Track,
};

export default class App extends React.Component<any, State> {
  audioElm = new Audio();
  state: State = {};

  componentDidMount() {
    Manager.fetch().then(manager => this.setState({
      manager: manager,
    }));
  }

  loadTrack = (track: Track) => {
    // todo make this redux
    const newSource = track.audioSrc;
    if (newSource !== this.audioElm.src) {
      this.audioElm.src = newSource;
      this.audioElm.play();

      this.setState({
        currentTrack: track,
      });
    }
  }

  render() {
    console.log('state:', this.state);

    const { manager, currentTrack } = this.state;
    if (!manager) {
      return (
        <h3> loading, please wait... </h3>
      );
    }

    const { loadTrack } = this;
    return (
      <div>
        {currentTrack && (
          <TrackView
            loadTrack={loadTrack}
            track={currentTrack}
            isCurrent={true}
          />
        )}
        <PlaylistWrapper>
          {manager.playlists.map((pl, index) => (
            <PlaylistView
              key={`playlist-${index}`}
              loadTrack={loadTrack}
              playlist={pl}
            />
          ))}
        </PlaylistWrapper>
      </div>
    )

  }
}
