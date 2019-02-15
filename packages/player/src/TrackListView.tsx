import React from 'react';
import styled from 'styled-components';
import { PlayableTrackList, PlayableTrack } from 'jukebox-utils';
import PlaceholderImage from './placeholder.png';
import { MainViewContainer, MainViewScrollable } from './components/Common';
import { MasterState } from './redux/reducers';
import { PlayerState } from './redux/reducers/player';
import { setCurrentTrack } from './redux/actions';
import { connect } from 'react-redux';

const TrackListContainer = styled(MainViewContainer)``;

const TracksTableContainer = styled(MainViewScrollable)``;

const TracksTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: inherit;

  & th,
  & td {
    border-top: 1px solid var(--jukebox-foreground);
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

  ${props =>
    props.isCurrent &&
    `
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
  player: PlayerState;
  setCurrentTrack(track: PlayableTrack): void;
}

function trimColumns<T>(trackList: PlayableTrackList, arr: Array<T>): Array<T> {
  if (trackList.custom) {
    arr.splice(5, 1);
  }
  return arr;
}

class TrackListView extends React.Component<Props> {
  truncate(info: string) {
    return (info || '').substring(0, 20);
  }
  render() {
    const { player, setCurrentTrack } = this.props;
    const { trackList } = player;
    if (!trackList) {
      throw new Error('TrackListView should not be rendered in this state!');
    }

    const columnHeaders = trimColumns(trackList, [
      '',
      'title',
      'artist',
      'length',
      'album',
      'track #',
    ]);
    return (
      <TrackListContainer>
        <h1>
          {trackList.name}
          {!trackList.custom && <em> (sortable) </em>}
        </h1>
        <TracksTableContainer>
          <TracksTable>
            <thead>
              <tr>
                {columnHeaders.map((text, index) => (
                  <th key={`header-${index}`}>
                    <TrackInfo>{text}</TrackInfo>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trackList.tracks.map((track, row) => {
                const columns = trimColumns(trackList, [
                  <TrackImage src={track.imageSrc || PlaceholderImage} />,
                  track.title,
                  this.truncate(track.artist),
                  track.durationDisplay,
                  track.album,
                  track.trackNumberDisplay,
                ]);
                return (
                  <TrackRow
                    key={`track-${row}`}
                    onClick={() => setCurrentTrack(track)}
                    isCurrent={track === player.track}
                  >
                    {columns.map((comp, column) => (
                      <td key={`body-${row}-${column}`}>
                        <TrackInfo>{comp}</TrackInfo>
                      </td>
                    ))}
                  </TrackRow>
                );
              })}
            </tbody>
          </TracksTable>
        </TracksTableContainer>
      </TrackListContainer>
    );
  }
}

export default connect(
  (state: MasterState) => ({
    player: state.player,
  }),
  {
    setCurrentTrack,
  },
)(TrackListView);
