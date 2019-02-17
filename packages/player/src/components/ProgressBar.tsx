import React from 'react';
import styled, { keyframes } from 'styled-components';
import {
  setSeekByPercent,
} from '../redux/actions';
import { connect } from 'react-redux';
import { MasterState } from '../redux/reducers';
import { UiState } from '../redux/reducers/ui';


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
  background: repeating-linear-gradient(
    135deg,
    var(--jukebox-background),
    var(--jukebox-background) 10px,
    var(--jukebox-highlight-background) 10px,
    var(--jukebox-highlight-background) 20px
  );
  background-repeat: no-repeat;
  animation: ${AnimationSlidingStripes} 1s linear infinite;
`;

export interface ProgressBarViewProps {
  ui: UiState;
  setSeekByPercent(percent?: number): void;
}
class ProgressBarView extends React.Component<ProgressBarViewProps> {
  private setProgress = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const clicked: any = evt.target;
    const rect = clicked.getBoundingClientRect();
    const offset = evt.pageX - rect.left;
    const percent = offset / (rect.right - rect.left);
    this.props.setSeekByPercent(percent);
  }
  render() {
    return (
      <ProgressContainerRow>
        <ProgressBar onClick={this.setProgress} percent={this.props.ui.progressPercent} />
      </ProgressContainerRow>
    );
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
