import React from 'react';
import styled from 'styled-components';
import { PlayableTrackList, PlayableTrack, SearchResult, truncate } from 'jukebox-utils';
import { DataState } from '../redux/reducers/data';
import { UiState } from '../redux/reducers/ui';
import { MasterState } from '../redux/reducers';
import { connect } from 'react-redux';
import {
  TrackListContainer,
  TracksTableContainer,
  TracksTable,
  TrackRow,
  TrackImage,
  TrackInfo,
  trimColumns,
} from './TrackTable';
import PlaceholderImage from '../placeholder.png';
import { setCurrentTrackList, setCurrentTrack, togglePopupSearch } from '../redux/actions';
import { PopupContainer, PopupInner, PopupTitle } from './Popup';

const SearchContainerOuter = styled(PopupContainer)`
  justify-content: flex-start;
`;
const SearchContainerInner = styled(PopupInner)`
  width: 90%;
  height: 90%;
  margin-top: 5vh;
`;

const SearchInput = styled.input`
  font-size: 2rem;
  padding: 0.2rem;
`;

interface Props {
  data: DataState;
  ui: UiState;
  setCurrentTrackList(trackList: PlayableTrackList): void;
  setCurrentTrack(track: PlayableTrack): void;
  togglePopupSearch(): void;
}
interface State {
  results: SearchResult[];
}
class PopupSearch extends React.Component<Props, State> {
  input?: HTMLInputElement;
  state: State = {
    results: [],
  };
  setRef(elm: HTMLInputElement | null) {
    if (elm) {
      this.input = elm;
    }
  }
  onChange() {
    const { manager } = this.props.data;
    const query = this.input && this.input.value;
    if (!manager || !query) {
      return;
    }
    const found = manager.search(query);
    this.setState({
      results: found,
    });
  }
  onSelect(sr: SearchResult) {
    this.props.togglePopupSearch();
    this.props.setCurrentTrackList(sr.playlist);
    this.props.setCurrentTrack(sr.track);
  }
  render() {
    const { results } = this.state;
    const columnHeaders = [
      '',
      'title',
      'artist',
      'length',
      'playlist',
    ];
    return this.props.ui.showPopupSearch ? (
      <SearchContainerOuter onClick={this.props.togglePopupSearch}>
        <SearchContainerInner onClick={e => e.stopPropagation()}>
          <PopupTitle>
            Search
          </PopupTitle>
          <SearchInput
            type='text'
            ref={elm => this.setRef(elm)}
            onChange={() => this.onChange()}
          />
          <TrackListContainer>
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
                  {results.map((sr, row) => {
                    const { track } = sr;
                    const columns = trimColumns([
                      <TrackImage src={track.imageSrc || PlaceholderImage} />,
                      track.title || `(${track.album})`,
                      truncate(track.artist, 20),
                      track.durationDisplay,
                      sr.playlist.name,
                    ]);
                    return (
                      <TrackRow
                        key={`track-${row}`}
                        onClick={() => this.onSelect(sr)}
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
        </SearchContainerInner>
      </SearchContainerOuter>
    ) : '';
  }
}

export default connect((state: MasterState) => ({
  data: state.data,
  ui: state.ui,
}), {
  setCurrentTrackList,
  setCurrentTrack,
  togglePopupSearch,
})(PopupSearch);
