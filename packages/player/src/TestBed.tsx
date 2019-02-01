import React from 'react';
import { Manager, Logger, PlayableTrack, Track, SongLoader, Playlist, range, asyncMap } from 'jukebox-utils';
import TrackListView from './TrackListView';

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
    const randomIds = range(5).map(() => manager.allSongs.randomTrack().id);
    const ids = [
      '???',
    ].concat(randomIds);
    asyncMap(ids, async (id: string) => {
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
    const playlist = new Playlist('test playlist', tracks, true);
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
