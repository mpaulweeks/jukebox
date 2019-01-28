import React from 'react';
import styled from 'styled-components';
import { Playlist, Track } from 'jukebox-utils';
import TrackView from './TrackView';

const PlaylistContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: no-wrap;

  width: 100%;
`;

const TracksContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: no-wrap;

  width: 100%;
`;

interface Props {
  loadTrack: (track: Track) => void,
  playlist?: Playlist,
};

export default class PlaylistView extends React.Component<Props> {
  render() {
    const { loadTrack, playlist } = this.props;
    if (!playlist) {
      return 'loading';
    }
    return (
      <PlaylistContainer>
        <h1>{playlist.name}</h1>
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
