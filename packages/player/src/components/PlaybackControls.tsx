import React from 'react';
import styled from 'styled-components';
import {
  seekNextTrack,
  seekPrevTrack,
  setSeekByDelta,
  toggleIsPlaying,
  toggleIsRepeat,
  toggleIsShuffle,
  togglePopupAbout,
} from '../redux/actions';
import { CanHighlight, HoverMixin, IconMixin } from './Common';
import { connect } from 'react-redux';
import { MasterState } from '../redux/reducers';
import { PlayerState } from '../redux/reducers/player';
import VolumeControl from './VolumeControl';

const ControlsContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;
const ControlsBlock = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;
const CenterControlsBlock = styled(ControlsBlock)`
  flex-grow: 1;
`;
const Control = styled(CanHighlight)`
  ${HoverMixin}
  ${IconMixin}

  border: 1px solid var(--jukebox-foreground);
  border-radius: 5px;
  margin: 5px;
`;

export interface PlaybackControlProps {
  player: PlayerState;
  seekNextTrack(): void;
  seekPrevTrack(): void;
  setSeekByDelta(delta: number): void;
  toggleIsPlaying(): void;
  toggleIsShuffle(): void;
  toggleIsRepeat(): void;
  togglePopupAbout(): void;
}
class PlaybackControls extends React.Component<PlaybackControlProps> {
  render() {
    const { player } = this.props;

    // <i className='material-icons'>volume_up</i>
    // <i className='material-icons'>volume_down</i>
    // <i className='material-icons'>volume_mute</i>
    // <i className='material-icons'>volume_off</i>

    return (
      <ControlsContainerRow>
        <ControlsBlock>
          <Control onClick={this.props.togglePopupAbout}>
            ?
          </Control>
          <VolumeControl />
        </ControlsBlock>
        <CenterControlsBlock>
          <Control onClick={() => this.props.setSeekByDelta(-10)}>
            <i className='material-icons'>replay_10</i>
          </Control>
          <Control onClick={this.props.seekPrevTrack}>
            <i className='material-icons'>skip_previous</i>
          </Control>
          <Control onClick={this.props.toggleIsPlaying}>
            {player.isPlaying ? (
              <i className='material-icons'>pause_circle_outline</i>
            ) : (
                <i className='material-icons'>play_circle_outline</i>
              )}
          </Control>
          <Control onClick={this.props.seekNextTrack}>
            <i className='material-icons'>skip_next</i>
          </Control>
          <Control onClick={() => this.props.setSeekByDelta(10)}>
            <i className='material-icons'>forward_10</i>
          </Control>
        </CenterControlsBlock>
        <ControlsBlock>
          <Control
            onClick={this.props.toggleIsShuffle}
            highlight={player.shuffle}
          >
            <i className='material-icons'>shuffle</i>
          </Control>
          <Control
            onClick={this.props.toggleIsRepeat}
            highlight={player.repeat}
          >
            <i className='material-icons'>repeat</i>
          </Control>
        </ControlsBlock>
      </ControlsContainerRow>
    );
  }
}

export default connect(
  (state: MasterState) => ({
    player: state.player,
  }),
  {
    seekNextTrack,
    seekPrevTrack,
    setSeekByDelta,
    toggleIsPlaying,
    toggleIsShuffle,
    toggleIsRepeat,
    togglePopupAbout,
  },
)(PlaybackControls);
