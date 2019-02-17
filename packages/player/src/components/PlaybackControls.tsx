import React from 'react';
import styled from 'styled-components';
import {
  seekNextTrack,
  seekPrevTrack,
  setSeekByPercent,
  toggleIsPlaying,
  toggleIsRepeat,
  toggleIsShuffle,
  togglePopupAbout,
} from '../redux/actions';
import { CanHighlight, HoverMixin } from './Common';
import { connect } from 'react-redux';
import { MasterState } from '../redux/reducers';
import { PlayerState } from '../redux/reducers/player';
import { UiState } from '../redux/reducers/ui';


const ProgressContainerRow = styled.div`
  padding: 20px;
  height: 30px;
`;
const ProgressBarOuter = styled.div`
  position: relative;
  height: 100%;
  border: 1px solid black;
  background-color: var(--jukebox-background);
`;
const ProgressBarInner = styled.div <{ percent: number }>`
  position: absolute;
  top: 0px;
  left: 0px;
  width: ${props => 100 * props.percent}%;
  height: 100%;
  background-color: var(--jukebox-foreground);
`;


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
  player: PlayerState;
  ui: UiState;
  seekNextTrack(): void;
  seekPrevTrack(): void;
  setSeekByPercent(percent?: number): void;
  toggleIsPlaying(): void;
  toggleIsShuffle(): void;
  toggleIsRepeat(): void;
  togglePopupAbout(): void;
}
class PlaybackControls extends React.Component<PlaybackControlProps> {
  private setProgress = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clicked: any = evt.target;
    const rect = clicked.getBoundingClientRect();
    const offset = evt.pageX - rect.left;
    const percent = offset / (rect.right - rect.left);
    this.props.setSeekByPercent(percent);
  }
  render() {
    const { player } = this.props;

    // <i className='material-icons'>volume_up</i>
    // <i className='material-icons'>volume_down</i>
    // <i className='material-icons'>volume_mute</i>
    // <i className='material-icons'>volume_off</i>

    return (
      <div>
        <ProgressContainerRow>
          <ProgressBarOuter onClick={this.setProgress}>
            <ProgressBarInner percent={this.props.ui.progressPercent} />
          </ProgressBarOuter>
        </ProgressContainerRow>
        <ControlsContainerRow>
          <ControlsBlock>
            <Control onClick={this.props.togglePopupAbout}>
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
            <Control
              onClick={this.props.toggleIsShuffle}
              highlight={player.shuffle}
            >
              <i className="material-icons">shuffle</i>
            </Control>
            <Control
              onClick={this.props.toggleIsRepeat}
              highlight={player.repeat}
            >
              <i className="material-icons">repeat</i>
            </Control>
          </ControlsBlock>
        </ControlsContainerRow>
      </div>
    );
  }
}

export default connect(
  (state: MasterState) => ({
    player: state.player,
    ui: state.ui,
  }),
  {
    seekNextTrack,
    seekPrevTrack,
    setSeekByPercent,
    toggleIsPlaying,
    toggleIsShuffle,
    toggleIsRepeat,
    togglePopupAbout,
  },
)(PlaybackControls);
