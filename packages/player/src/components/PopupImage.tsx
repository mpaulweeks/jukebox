import React from 'react';
import styled from 'styled-components';
import PlaceholderImage from '../placeholder.png';
import { PlayerState } from '../redux/reducers/player';
import { UiState } from '../redux/reducers/ui';
import { MasterState } from '../redux/reducers';
import { connect } from 'react-redux';
import { togglePopupImage } from '../redux/actions';
import { PopupContainer, PopupInner, PopupTitle } from './Popup';

const LargeAlbumArt = styled.img`
  height: 80vh;
  width: auto;
 `;

interface Props {
  player: PlayerState;
  ui: UiState;
  togglePopupImage(): void;
}
class PopupImage extends React.Component<Props> {
  render() {
    const { player, ui } = this.props;
    const albumImg = (player.track && player.track.imageSrc) || PlaceholderImage;
    return ui.showPopupImage ? (
      <PopupContainer onClick={this.props.togglePopupImage}>
        <PopupInner onClick={e => e.stopPropagation()}>
          <LargeAlbumArt src={albumImg} />
        </PopupInner>
      </PopupContainer>
    ) : '';
  }
}

export default connect((state: MasterState) => ({
  player: state.player,
  ui: state.ui,
}), {
    togglePopupImage,
  })(PopupImage);
