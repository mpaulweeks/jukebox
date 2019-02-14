import React from 'react';
import styled from 'styled-components';
import { seekNextTrack, seekPrevTrack, toggleIsPlaying, toggleIsRepeat, toggleIsShuffle } from './redux/actions';
import { CanHighlight, HoverMixin } from './Components';
import { connect } from 'react-redux';
import { MasterState } from './redux/reducers';
import { PlayerState } from './redux/reducers/player';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
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

  border: 1px solid var(--jukebox-foreground);
  border-radius: 5px;
  margin: 5px;
  font-size: 1.5em;
  height: 2em;
  width: 2em;

  & i {
    font-size: 1.5em;
  }

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
`;

export interface PlaybackControlProps {
  player: PlayerState,
  seekNextTrack(): void,
  seekPrevTrack(): void,
  toggleIsPlaying(): void,
  toggleIsShuffle(): void,
  toggleIsRepeat(): void,
}
class PlaybackControls extends React.Component<PlaybackControlProps>{
  render() {
    const { player } = this.props;

    // <i className="material-icons">volume_up</i>
    // <i className="material-icons">volume_down</i>
    // <i className="material-icons">volume_mute</i>
    // <i className="material-icons">volume_off</i>

    return (
      <ControlsContainer>
        <ControlsBlock>
          <Control>
            ?
          </Control>
        </ControlsBlock>
        <CenterControlsBlock>
          <Control onClick={this.props.seekPrevTrack}>
            <i className="material-icons">skip_previous</i>
          </Control>
          <Control onClick={this.props.toggleIsPlaying}>
            {player.isPlaying ? (
              <i className="material-icons">pause_circle_outline</i>
            ) : (
                <i className="material-icons">play_circle_outline</i>
              )}
          </Control>
          <Control onClick={this.props.seekNextTrack}>
            <i className="material-icons">skip_next</i>
          </Control>
        </CenterControlsBlock>
        <ControlsBlock>
          <Control onClick={this.props.toggleIsShuffle} highlight={player.shuffle}>
            <i className="material-icons">shuffle</i>
          </Control>
          <Control onClick={this.props.toggleIsRepeat} highlight={player.repeat}>
            <i className="material-icons">repeat</i>
          </Control>
        </ControlsBlock>
      </ControlsContainer>
    )
  }
}

export default connect((state: MasterState) => ({
  player: state.player,
}), {
    seekNextTrack,
    seekPrevTrack,
    toggleIsPlaying,
    toggleIsShuffle,
    toggleIsRepeat,
  })(PlaybackControls);
