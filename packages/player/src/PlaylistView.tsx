import React from 'react';
import styled from 'styled-components';
import { Playlist, Track } from 'jukebox-utils';
import TrackView from './TrackView';

const PlaylistContainer = styled.div`
  border: 5px solid grey;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
`;

const TracksContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
`;

interface Props {
  loadTrack: (track: Track) => void,
  playlist: Playlist,
};

export default class PlaylistView extends React.Component<Props> {
  render() {
    const { loadTrack, playlist } = this.props;
    return (
      <PlaylistContainer>
        <h3>{playlist.name}</h3>
        <TracksContainer>
          {playlist.tracks.map((track, index) => (
            <TrackView
              key={`track-${index}`}
              loadTrack={loadTrack}
              track={track}
            />
          ))}
        </TracksContainer>
      </PlaylistContainer>
    )
  }
}
