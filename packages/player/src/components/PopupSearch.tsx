import React from 'react';
import styled from 'styled-components';
import { PlayableTrackList, PlayableTrack, SearchResult } from 'jukebox-utils';
import { DataState } from '../redux/reducers/data';
import { UiState } from '../redux/reducers/ui';
import { MasterState } from '../redux/reducers';
import { connect } from 'react-redux';
import { setCurrentTrackList, setCurrentTrack, togglePopupSearch } from '../redux/actions';
import { PopupContainer, PopupInner, PopupTitle } from './Popup';

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
  private input?: HTMLInputElement;
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
    if (!manager || !query || query.length < 3) {
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
    return this.props.ui.showPopupSearch ? (
      <PopupContainer onClick={this.props.togglePopupSearch}>
        <PopupInner onClick={e => e.stopPropagation()}>
          <PopupTitle>
            Search
          </PopupTitle>
          <SearchInput type="text" ref={elm => this.setRef(elm)} onChange={() => this.onChange()}/>
          {results.map(sr => (
            <div onClick={() => this.onSelect(sr)}>
              {sr.track.title}
            </div>
          ))}
        </PopupInner>
      </PopupContainer>
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
