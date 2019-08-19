import React from 'react';
import styled from 'styled-components';
import {
  setVolume,
} from '../redux/actions';
import { CanHighlight, HoverMixin, IconMixin, FlexStretchMixin, getClickPercent } from './Common';
import { connect } from 'react-redux';
import { MasterState } from '../redux/reducers';
import { PlayerState } from '../redux/reducers/player';

const ContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
`;

interface BarProps {
  percent: number;
}
const ProgressBar = styled.div`
  cursor: pointer;
  height: 10px;
  width: 100px;
  border: var(--jukebox-border-width) solid var(--jukebox-foreground);
  box-sizing: border-box;

  background: linear-gradient(
    to right,
    var(--jukebox-background),
    var(--jukebox-foreground)
  );

  position: relative;
`;
const ProgressDial: any = styled.div.attrs((props: BarProps) => ({
  style: {
    left: `${100 * props.percent}%`,
  },
}))`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 30px;
  width: 10px;
  background-color: var(--jukebox-background);
  border: var(--jukebox-border-width) solid var(--jukebox-foreground);
`;
const VolumeIcon = styled.div`
  ${IconMixin}
`;

export interface VolumeControlProps {
  player: PlayerState;
  setVolume(volume: number): void;
}
class VolumeControls extends React.Component<VolumeControlProps> {
  setVolume = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.props.setVolume(getClickPercent(evt));
  }
  onBarDrag = (evt: any) => {
    this.props.setVolume(getClickPercent(evt));
  }
  render() {
    const { volume } = this.props.player;
    let icon = 'volume_off';
    if (volume > 0.6) {
      icon = 'volume_up';
    } else if (volume > 0.3) {
      icon = 'volume_down';
    } else if (volume > 0) {
      icon = 'volume_mute';
    }

    return (
      <ContainerRow>
        <ProgressBar onClick={this.setVolume} onDragOver={this.onBarDrag}>
          <ProgressDial
            draggable
            percent={volume}
          />
        </ProgressBar>
        <VolumeIcon >
          <i className='material-icons'>{icon}</i>
        </VolumeIcon>
      </ContainerRow>
    );
  }
}

export default connect(
  (state: MasterState) => ({
    player: state.player,
  }),
  {
    setVolume,
  },
)(VolumeControls);
