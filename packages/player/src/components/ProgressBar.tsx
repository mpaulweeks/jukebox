import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  setSeekByPercent,
} from '../redux/actions';
import { connect } from 'react-redux';
import { MasterState } from '../redux/reducers';
import { UiState } from '../redux/reducers/ui';
import { FlexStretchMixin, getClickPercent } from './Common';
import { throws } from 'assert';

const ProgressContainerRow = styled.div`
  padding: 5px;
`;

const AnimationSlidingStripes = keyframes`
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: 0px -27.5px;
  }
`;

interface BarProps {
  percent: number;
}
const ProgressBar: any = styled.div.attrs((props: BarProps) => ({
  style: {
    backgroundSize: `${100 * props.percent}% 400%`,
  },
}))`
  cursor: pointer;
  height: 30px;
  border: var(--jukebox-border-width) solid var(--jukebox-foreground);
  border-radius: 5px;
  box-sizing: border-box;
  background: repeating-linear-gradient(
    135deg,
    var(--jukebox-highlight-foreground),
    var(--jukebox-highlight-foreground) 10px,
    var(--jukebox-highlight-background) 10px,
    var(--jukebox-highlight-background) 20px
  );
  background-repeat: no-repeat;
  animation: ${AnimationSlidingStripes} 1s linear infinite;

  ${FlexStretchMixin}
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const ProgressTime = styled.div`
  margin: 0px 10px;
`;

export interface ProgressBarViewProps {
  ui: UiState;
  setSeekByPercent(percent?: number): void;
}
class ProgressBarView extends React.Component<ProgressBarViewProps> {
  render() {
    return (
      <ProgressContainerRow>
        <ProgressBar onClick={this.setProgress} percent={this.props.ui.progressPercent}>
          <ProgressTime>{this.renderTime(this.props.ui.progressTime)}</ProgressTime>
        </ProgressBar>
      </ProgressContainerRow>
    );
  }
  private setProgress = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.props.setSeekByPercent(getClickPercent(evt));
  }
  private renderTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = String(Math.floor(time % 60)).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}

export default connect(
  (state: MasterState) => ({
    ui: state.ui,
  }),
  {
    setSeekByPercent,
  },
)(ProgressBarView);
