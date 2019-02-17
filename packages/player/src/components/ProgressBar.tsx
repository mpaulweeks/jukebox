import React from 'react';
import styled from 'styled-components';
import {
  setSeekByPercent,
} from '../redux/actions';
import { connect } from 'react-redux';
import { MasterState } from '../redux/reducers';
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
        <ProgressBarOuter onClick={this.setProgress}>
          <ProgressBarInner percent={this.props.ui.progressPercent} />
        </ProgressBarOuter>
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
