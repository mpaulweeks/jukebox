import React from 'react';
import styled from 'styled-components';
import { PlayableTrackList, PlayableTrack } from 'jukebox-utils';
import PlaceholderImage from './placeholder.png';
import { MainViewContainer, MainViewScrollable } from './Components';

const TrackListContainer = styled(MainViewContainer)`
`;

const TracksTableContainer = styled(MainViewScrollable)`
`;

const TracksTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  & th, & td {
    border-top: 1px solid black;
    box-sizing: border-box;
    padding: 0px 5px;
    height: 60px;
  }

  & th {
    border-top-width: 0px;
  }
`;
const TrackRow = styled('tr') <{ isCurrent: boolean }>`
  cursor: pointer;

  ${props => props.isCurrent && `
    background-color: var(--jukebox-highlight);
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
  loadTrack: (track: PlayableTrack) => void,
  currentTrack?: PlayableTrack,
  playlist?: PlayableTrackList,
};

export default class TrackListView extends React.Component<Props> {
  truncate(info: string) {
    return (info || '').substring(0, 20);
  }
  render() {
    const { loadTrack, playlist, currentTrack } = this.props;
    if (!playlist) {
      return 'loading';
    }
    return (
      <TrackListContainer>
        <h1>
          {playlist.name}
          {!playlist.ordered && <em> (sortable) </em>}
        </h1>
        <TracksTableContainer>
          <TracksTable>
            <thead>
              <tr>
                {['', 'title', 'artist', 'length', 'album', '#'].map((text, index) => (
                  <th key={`header-${index}`}>
                    <TrackInfo>
                      {text}
                    </TrackInfo>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playlist.tracks.map((track, row) => {
                const columns = [
                  <TrackImage src={track.imageSrc || PlaceholderImage} />,
                  track.title,
                  this.truncate(track.artist),
                  track.durationDisplay,
                  track.album,
                  track.trackNumberDisplay,
                ];
                return (
                  <TrackRow
                    key={`track-${row}`}
                    onClick={() => loadTrack(track)}
                    isCurrent={track === currentTrack}
                  >
                    {columns.map((comp, column) => (
                      <td key={`body-${row}-${column}`}>
                        <TrackInfo>
                          {comp}
                        </TrackInfo>
                      </td>
                    ))}
                  </TrackRow>
                );
              })}
            </tbody>
          </TracksTable>
        </TracksTableContainer>
      </TrackListContainer>
    )
  }
}
