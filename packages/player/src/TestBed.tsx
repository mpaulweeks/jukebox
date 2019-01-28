import React from 'react';
import { Manager, Track, TrackData, SongLoader } from 'jukebox-utils';
import TrackView from './TrackView';

interface State {
  manager?: Manager;
  tracks: Array<Track>;
};

export default class TestBed extends React.Component<any, State> {
  audioElm = new Audio();
  state: State = {
    tracks: [],
  };

  test = async () => {
    const ids = [
      '18921', // hello
      '269', // disco fever
      '251', // we'll go from there
      '19267', // genesis of next
      '19290', // yooka
    ];
    ids.forEach(async id => {
      const trackData = await SongLoader.fromId(id);
      const track = new Track(trackData);
      const tracks = (this.state.tracks || []).concat(track);
      this.setState({
        tracks,
      });
    });
  }

  componentDidMount() {
    console.log(process.env);
    Manager.fetch().then(manager => this.setState({
      manager: manager,
    }, this.test));
  }

  render() {
    const { tracks } = this.state;
    return (
      <div>
        loaded
        {tracks.map((track, index) => (
          <TrackView
            key={`track-${index}`}
            track={track}
            loadTrack={() => { }}
          />
        ))}
      </div>
    )

  }
}
