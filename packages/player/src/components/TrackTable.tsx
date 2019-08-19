import styled from 'styled-components';
import { MainViewContainer, MainViewScrollable, MainTitle, CanHighlightTableRow, HoverMixin } from './Common';
import { PlayableTrackList } from 'jukebox-utils';

export const TrackListContainer = styled(MainViewContainer)`
  max-height: 100%;
`;

export const TracksTableContainer = styled(MainViewScrollable)``;

export const TracksTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: inherit;

  & th,
  & td {
    border-top: 1px solid var(--jukebox-foreground);
    box-sizing: border-box;
    padding: 0px 5px;
    height: 60px;
  }

  & th {
    border-top-width: 0px;
  }
`;
export const TrackRow = styled(CanHighlightTableRow)`
  ${HoverMixin}
`;

export const TrackImage = styled.img`
  width: auto;
  height: 50px;

  @media (max-width: 600px) {
    display: none;
  }
`;
export const TrackInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: no-wrap;
`;

export function trimColumns<T>(arr: Array<T>, trackList?: PlayableTrackList): Array<T> {
  if (trackList && trackList.custom) {
    arr.splice(5, 1);
  }
  return arr;
}
