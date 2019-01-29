import React from 'react';
import styled from 'styled-components';
import { PlayerSettings } from 'jukebox-utils';
import { CanHighlight } from './Components';

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
`;
const ControlsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;
const Control = styled(CanHighlight)`
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
`;

export interface PlaybackControlProps {
  settings: PlayerSettings,
  prevTrack(): void,
  nextTrack(): void,
  togglePlay(): void,
  toggleShuffle(): void,
  toggleRepeat(): void,
}
export class PlaybackControls extends React.Component<PlaybackControlProps>{
  render() {
    const { settings } = this.props;
    return (
      <ControlsContainer>
        <ControlsRow>
          <Control
            onClick={this.props.prevTrack}
          >
            prev
        </Control>
          <Control
            onClick={this.props.togglePlay}
          >
            {settings.isPlaying ? 'pause' : 'play'}
          </Control>
          <Control
            onClick={this.props.nextTrack}
          >
            next
        </Control>
        </ControlsRow>
        <ControlsRow>
          <Control
            onClick={this.props.toggleShuffle}
            highlight={settings.shuffle}
          >
            shuffle?
        </Control>
          <Control
            onClick={this.props.toggleRepeat}
            highlight={settings.repeat}
          >
            repeat?
        </Control>
        </ControlsRow>
      </ControlsContainer>
    )
  }
}
