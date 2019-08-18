import React from 'react';
import styled from 'styled-components';
import { DataState } from '../redux/reducers/data';
import { UiState } from '../redux/reducers/ui';
import { MasterState } from '../redux/reducers';
import { connect } from 'react-redux';
import { togglePopupSearch } from '../redux/actions';
import { PopupContainer, PopupInner, PopupTitle } from './Popup';

const SearchInput = styled.input`
  font-size: 2rem;
  padding: 0.2rem;
`;

interface Props {
  data: DataState;
  ui: UiState;
  togglePopupSearch(): void;
}
class PopupSearch extends React.Component<Props> {
  private input?: HTMLInputElement;
  setRef(elm: HTMLInputElement | null) {
    if (elm) {
      this.input = elm;
    }
  }
  onChange() {
    const query = this.input && this.input.value;
    const manager = this.props.data.manager;
    if (!query || !manager) {
      return;
    }
    console.log('search onChange:', query);
    const found = manager.search(query);
    console.log(found);
  }
  render() {
    return this.props.ui.showPopupSearch ? (
      <PopupContainer onClick={this.props.togglePopupSearch}>
        <PopupInner onClick={e => e.stopPropagation()}>
          <PopupTitle>
            Search
          </PopupTitle>
          <SearchInput type="text" ref={elm => this.setRef(elm)} onChange={() => this.onChange()}/>
        </PopupInner>
      </PopupContainer>
    ) : '';
  }
}

export default connect((state: MasterState) => ({
  data: state.data,
  ui: state.ui,
}), {
    togglePopupSearch,
  })(PopupSearch);
