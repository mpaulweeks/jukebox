import React from 'react';
import { PlayableTrackList, PlayableTrack, truncate } from 'jukebox-utils';
import PlaceholderImage from './placeholder.png';
import { MainViewContainer, MainViewScrollable, MainTitle, CanHighlightTableRow, HoverMixin } from './components/Common';
import { TrackListContainer, TracksTableContainer, TracksTable, TrackRow, TrackImage, TrackInfo, trimColumns } from './components/TrackTable';
import { MasterState } from './redux/reducers';
import { PlayerState } from './redux/reducers/player';
import { setCurrentTrack } from './redux/actions';
import { connect } from 'react-redux';

interface Props {
  player: PlayerState;
  setCurrentTrack(track: PlayableTrack): void;
}

class TrackListView extends React.Component<Props> {
  render() {
    const { player, setCurrentTrack } = this.props;
    const { trackList } = player;
    if (!trackList) {
      throw new Error('TrackListView should not be rendered in this state!');
    }

    const columnHeaders = trimColumns([
      '',
      'title',
      'artist',
      'length',
      'album',
      'track #',
    ], trackList);
    return (
      <TrackListContainer>
        <MainTitle>
          {trackList.name}
          {!trackList.custom && <em> (sortable) </em>}
        </MainTitle>
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
                const columns = trimColumns([
                  <TrackImage src={track.imageSrc || PlaceholderImage} />,
                  track.title || `(${track.album})`,
                  truncate(track.artist, 20),
                  track.durationDisplay,
                  track.album,
                  track.trackNumberDisplay,
                ], trackList);
                return (
                  <TrackRow
                    key={`track-${row}`}
                    onClick={() => setCurrentTrack(track)}
                    highlight={track === player.track}
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
