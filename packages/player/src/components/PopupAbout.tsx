import React from 'react';
import styled from 'styled-components';
import { UiState } from '../redux/reducers/ui';
import { MasterState } from '../redux/reducers';
import { connect } from 'react-redux';
import { togglePopupAbout } from '../redux/actions';
import { FlexStretchMixin } from './Common';

const PopupContainer = styled.div`
  ${FlexStretchMixin}
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;

  z-index: var(--jukebox-popup-z-index);

  background-color: rgba(0,0,0,0.5);
`;

const PopupInner = styled.div`
  background-color: var(--jukebox-background);
  color: var(--jukebox-foreground);
  border: 0.5em solid var(--jukebox-foreground);
  border-radius: 2em;
  padding: 2em;
  text-align: center;
`;

const AboutTitle = styled.div`
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 0.5em;
`;
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
          <AboutTitle>
            jukebox
          </AboutTitle>
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
