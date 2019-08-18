import React from 'react';
import styled from 'styled-components';
import { UiState } from '../redux/reducers/ui';
import { MasterState } from '../redux/reducers';
import { connect } from 'react-redux';
import { togglePopupAbout } from '../redux/actions';
import { PopupContainer, PopupInner, PopupTitle } from './Popup';

const AboutAuthor = styled.div``;

const InstructionsTitle = styled.div`
  font-size: 1.5em;
  font-style: italic;
  margin-top: 1em;
  margin-bottom: 0.5em;
`;
const InstructionsTable = styled.table`
  border-collapse: collapse;
  color: inherit;

  & th,
  & td {
    border: 1px solid var(--jukebox-foreground);
    box-sizing: border-box;
    padding: 0.5em;
  }
`;

interface Props {
  ui: UiState;
  togglePopupAbout(): void;
}
class PopupAbout extends React.Component<Props> {
  render() {
    return this.props.ui.showPopupAbout ? (
      <PopupContainer onClick={this.props.togglePopupAbout}>
        <PopupInner onClick={e => e.stopPropagation()}>
          <PopupTitle>
            jukebox
          </PopupTitle>
          <AboutAuthor>
            made by <a href="https://twitter.com/mpaulweeks">@mpaulweeks</a>
          </AboutAuthor>
          <InstructionsTitle>
            keyboard shortcuts
          </InstructionsTitle>
          <InstructionsTable>
            <tbody>
              <tr>
                <td>spacebar</td>
                <td>play/pause the music</td>
              </tr>
              <tr>
                <td>+</td>
                <td>increase volume</td>
              </tr>
              <tr>
                <td>-</td>
                <td>decrease volume</td>
              </tr>
              <tr>
                <td>left arrow</td>
                <td>previous song</td>
              </tr>
              <tr>
                <td>right arrow</td>
                <td>next song</td>
              </tr>
              <tr>
                <td>comma</td>
                <td>skip back 10 seconds</td>
              </tr>
              <tr>
                <td>period</td>
                <td>skip forward 10 seconds</td>
              </tr>
              <tr>
                <td>S</td>
                <td>toggle shuffle</td>
              </tr>
              <tr>
                <td>R</td>
                <td>toggle repeat</td>
              </tr>
            </tbody>
          </InstructionsTable>
        </PopupInner>
      </PopupContainer>
    ) : '';
  }
}

export default connect((state: MasterState) => ({
  ui: state.ui,
}), {
    togglePopupAbout,
  })(PopupAbout);
