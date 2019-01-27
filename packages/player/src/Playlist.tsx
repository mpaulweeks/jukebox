import React from 'react';
import styled from 'styled-components';
import { PlaylistData, InfoLookup, TrackData } from 'jukebox-utils';
import Track from './Track';

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
  loadTrack: (track: TrackData) => void,
  infoLookup: InfoLookup,
  playlist: PlaylistData,
};

export default class Playlist extends React.Component<Props> {
  render() {
    const { loadTrack, infoLookup, playlist } = this.props;
    return (
      <PlaylistContainer>
        <h3>{playlist.name}</h3>
        <TracksContainer>
          {playlist.trackIds.map((id, index) => (
            <Track
              key={`track-${index}`}
              loadTrack={loadTrack}
              track={infoLookup.get(id)}
            />
          ))}
        </TracksContainer>
      </PlaylistContainer>
    )
  }
}
