import React from 'react';
import { Manager, Logger, PlayableTrack, Track, SongLoader, Playlist } from 'jukebox-utils';
import TrackListView from './TrackListView';

function range(length: number) {
  const toReturn = [];
  for (let i = 0; i < length; i++) {
    toReturn.push(i);
  }
  return toReturn;
}

interface State {
  manager?: Manager;
  tracks: Array<PlayableTrack>;
};

export default class TestBed extends React.Component<any, State> {
  audioElm = new Audio();
  state: State = {
    tracks: [],
  };

  test = async (manager: Manager) => {
    const randomIds = range(5).map(i => manager.randomTrack().id);
    const ids: Array<string> = [
      // put test ids here
      '???'
    ].concat(randomIds);
    ids.forEach(async id => {
      const trackData = await SongLoader.fromId(id);
      const track = new Track(trackData);
      const tracks = this.state.tracks.concat(track);
      this.setState({
        tracks,
      });
    });
  }

  componentDidMount() {
    Logger.log(process.env);
    Manager.fetch().then(manager => this.setState({
      manager: manager,
    }, () => this.test(manager)));
  }

  render() {
    const { tracks } = this.state;
    const playlist = new Playlist('test playlist', tracks, false);
    return (
      <div>
        loaded
        <TrackListView
          loadTrack={() => { }}
          currentTrack={undefined}
          playlist={playlist}
        />
      </div>
    )

  }
}
