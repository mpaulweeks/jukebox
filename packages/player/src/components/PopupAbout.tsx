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
  border-radius: 2em;
  padding: 2em;
  text-align: center;
`;

const AboutTitle = styled.div`
  font-size: 2em;
  font-style: italic;
  font-weight: bold;
  padding-bottom: 1em;
`;
const AboutAuthor = styled.div``;

interface Props {
  ui: UiState;
  togglePopupAbout(): void;
}
class PopupAbout extends React.Component<Props> {
  render() {
    return this.props.ui.showPopupAbout ? (
      <PopupContainer onClick={this.props.togglePopupAbout}>
        <PopupInner>
          <AboutTitle>
            jukebox
          </AboutTitle>
          <AboutAuthor>
            made by <a href="https://twitter.com/mpaulweeks">@mpaulweeks</a>
          </AboutAuthor>
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
