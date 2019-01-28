import React from 'react';
import styled from 'styled-components';
import { Playlist, Track } from 'jukebox-utils';
import PlaceholderImage from './placeholder.png';
import { DisplayConstants } from './DisplayConstants';

const PlaylistContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: no-wrap;

  width: 100%;
`;

const TracksTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  & th, & td {
    border-top: 1px solid black;
    box-sizing: border-box;
    padding: 5px;
  }

  & th {
    border-top-width: 0px;
  }
`;

const TrackRow = styled('tr') <{ isCurrent: boolean }>`
  cursor: pointer;

  ${props => props.isCurrent && `
    background-color: ${DisplayConstants.Highlight};
  `}
`;

const TrackImage = styled.img`
  width: auto;
  height: 50px;
`;
const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: no-wrap;
`;


interface Props {
  loadTrack: (track: Track) => void,
  currentTrack?: Track,
  playlist?: Playlist,
};

export default class PlaylistView extends React.Component<Props> {
  truncate(info: string) {
    return (info || '').substring(0, 20);
  }
  render() {
    const { loadTrack, playlist, currentTrack } = this.props;
    if (!playlist) {
      return 'loading';
    }
    return (
      <PlaylistContainer>
        <h1>{playlist.name}</h1>
        <TracksTable>
          <thead>
            <tr>
              <th><TrackInfo>art</TrackInfo></th>
              <th><TrackInfo>title</TrackInfo></th>
              <th><TrackInfo>artist</TrackInfo></th>
              <th><TrackInfo>album</TrackInfo></th>
              <th><TrackInfo>id</TrackInfo></th>
            </tr>
          </thead>
          <tbody>
            {playlist.tracks.map((track, index) => (
              <TrackRow key={`track-${index}`} onClick={() => loadTrack(track)} isCurrent={track === currentTrack}>
                <td><TrackInfo><TrackImage src={track.imageSrc || PlaceholderImage} /></TrackInfo></td>
                <td><TrackInfo>{track.title}</TrackInfo></td>
                <td><TrackInfo>{this.truncate(track.artist)}</TrackInfo></td>
                <td><TrackInfo>{track.album}</TrackInfo></td>
                <td><TrackInfo>{track.id}</TrackInfo></td>
              </TrackRow>
            ))}
          </tbody>
        </TracksTable>
      </PlaylistContainer>
    )
  }
}
