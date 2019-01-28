import React from 'react';
import { Manager, Logger, PlayableTrack, Track, SongLoader } from 'jukebox-utils';
import CurrentTrackView from './CurrentTrackView';
import styled from 'styled-components';

interface State {
  manager?: Manager;
  tracks: Array<PlayableTrack>;
};

const TracksHolder = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
`;
const TrackHolder = styled.div`
  height: 100px;
  width: 600px;
  border: 1px solid black;
  margin: 10px;
`;

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
    Logger.log(process.env);
    Manager.fetch().then(manager => this.setState({
      manager: manager,
    }, this.test));
  }

  render() {
    const { tracks } = this.state;
    return (
      <div>
        loaded
        <TracksHolder>
          {tracks.map((track, index) => (
            <TrackHolder key={`track-${index}`}>
              <CurrentTrackView
                track={track}
              />
            </TrackHolder>
          ))}
        </TracksHolder>
      </div>
    )

  }
}
